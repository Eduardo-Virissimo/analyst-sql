import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import type { Row } from "./types";

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

export async function readSchema(): Promise<string> {
  const pool = getPool();

  const [columns] = await pool.query<ColumnInfo[]>(
    `SELECT c.TABLE_NAME AS table_name, t.TABLE_COMMENT AS table_comment, c.COLUMN_NAME AS column_name, c.COLUMN_COMMENT AS column_comment from information_schema.COLUMNS c JOIN information_schema.TABLES t ON t.TABLE_SCHEMA = c.TABLE_SCHEMA AND t.TABLE_NAME = c.TABLE_NAME
    WHERE c.TABLE_SCHEMA = ?
    ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION
    `,
    [process.env.DB_NAME],
  );

  const [foreignKeys] = await pool.query<ForeignKeyInfo[]>(
    `SELECT TABLE_NAME AS table_name, COLUMN_NAME AS column_name, REFERENCED_TABLE_NAME AS referenced_table, REFERENCED_COLUMN_NAME AS referenced_column FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
    [process.env.DB_NAME],
  );

  const tables: Record<string, { comment: string; columns: string[] }> = {};

  for (const c of columns) {
    tables[c.table_name] ??= { comment: c.table_comment, columns: [] };
    const extras = [
      c.column_key === "PRI" ? "chave primaria" : "",
      c.column_comment,
    ]
      .filter(Boolean)
      .join(", ");
    tables[c.table_name].columns.push(
      `  - ${c.column_name} (${c.column_type})${extras ? ` - ${extras}` : ""}`,
    );
  }

  let schema = "";
  for (const [name, info] of Object.entries(tables)) {
    schema += `Tabela ${name}${
      info.comment ? ` — ${info.comment}` : ""
    }\n${info.columns.join("\n")}\n\n`;
  }
  if (foreignKeys.length) {
    schema += "Relacionamentos:\n";
    for (const fk of foreignKeys) {
      schema += `  - ${fk.table_name}.${fk.column_name} -> ${fk.referenced_table}.${fk.referenced_column}\n`;
    }
  }
  return schema;
}

// executa uma consulta ja validada com tempo maximo de 5 segundos
export async function runQuery(sql: string): Promise<Row[]> {
  const [rows] = await getPool().query<RowDataPacket[]>({ sql, timeout: 5000 });
  return rows as Row[];
}

export async function closePool(): Promise<void> {
  await globalWithPool.agentPool?.end();
  globalWithPool.agentPool = undefined;
}
