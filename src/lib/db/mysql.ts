import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import type { DatabaseSchema, SchemaTable } from "@/lib/db/schema";
import type { Row } from "@/lib/types";

// Acesso ao MySQL: o pool de conexões, a leitura da estrutura e a execução de consultas.
// O pool fica em globalThis para não abrir um novo a cada recarga do `next dev`.
const globalWithPool = globalThis as typeof globalThis & { agentPool?: Pool };

function getPool(): Pool {
  globalWithPool.agentPool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    dateStrings: true,
  });
  return globalWithPool.agentPool;
}

interface ColumnInfo extends RowDataPacket {
  table_name: string;
  table_comment: string;
  column_name: string;
  column_type: string;
  column_key: string;
  column_comment: string;
}

interface ForeignKeyInfo extends RowDataPacket {
  table_name: string;
  column_name: string;
  referenced_table: string;
  referenced_column: string;
}

// Lê a estrutura do banco (tabelas, colunas, comentários e chaves estrangeiras).
export async function readDatabaseSchema(): Promise<DatabaseSchema> {
  const pool = getPool();
  const database = process.env.DB_NAME ?? "";

  // atenção: é preciso pedir COLUMN_TYPE e COLUMN_KEY, senão a IA recebe "(undefined)"
  const [columns] = await pool.query<ColumnInfo[]>(
    `SELECT c.TABLE_NAME AS table_name, t.TABLE_COMMENT AS table_comment,
            c.COLUMN_NAME AS column_name, c.COLUMN_TYPE AS column_type,
            c.COLUMN_KEY AS column_key, c.COLUMN_COMMENT AS column_comment
       FROM information_schema.COLUMNS c
       JOIN information_schema.TABLES t
         ON t.TABLE_SCHEMA = c.TABLE_SCHEMA AND t.TABLE_NAME = c.TABLE_NAME
      WHERE c.TABLE_SCHEMA = ?
      ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION`,
    [database],
  );

  const [foreignKeys] = await pool.query<ForeignKeyInfo[]>(
    `SELECT TABLE_NAME AS table_name, COLUMN_NAME AS column_name,
            REFERENCED_TABLE_NAME AS referenced_table, REFERENCED_COLUMN_NAME AS referenced_column
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
    [database],
  );

  const references = new Map(
    foreignKeys.map((fk) => [
      `${fk.table_name}.${fk.column_name}`,
      { table: fk.referenced_table, column: fk.referenced_column },
    ]),
  );

  const tables = new Map<string, SchemaTable>();
  for (const c of columns) {
    let table = tables.get(c.table_name);
    if (!table) {
      table = { name: c.table_name, comment: c.table_comment, columns: [] };
      tables.set(c.table_name, table);
    }
    table.columns.push({
      name: c.column_name,
      type: c.column_type,
      isPrimaryKey: c.column_key === "PRI",
      comment: c.column_comment,
      references: references.get(`${c.table_name}.${c.column_name}`),
    });
  }

  return { database, tables: [...tables.values()] };
}

// Executa uma consulta já validada. Defesa em profundidade, além do validador e do
// usuário somente leitura do MySQL: transação READ ONLY e limite de tempo no servidor
// (max_execution_time), que cancela a consulta de verdade, não só no cliente.
export async function runQuery(sql: string): Promise<Row[]> {
  const connection = await getPool().getConnection();
  let broken = false;
  try {
    await connection.query("SET SESSION max_execution_time = 5000");
    await connection.query("START TRANSACTION READ ONLY");
    const [rows] = await connection.query<RowDataPacket[]>({
      sql,
      timeout: 6000,
    });
    return rows as Row[];
  } catch (err) {
    broken = (err as { fatal?: boolean }).fatal === true;
    throw err;
  } finally {
    if (broken) {
      connection.destroy();
    } else {
      try {
        await connection.query("ROLLBACK");
      } catch {
        // conexão já caiu; o pool descarta
      }
      connection.release();
    }
  }
}

export async function closePool(): Promise<void> {
  await globalWithPool.agentPool?.end();
  globalWithPool.agentPool = undefined;
}
