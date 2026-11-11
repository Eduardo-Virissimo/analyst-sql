// A estrutura do banco como dados (para a tela) e como texto (para a IA). Funções puras.

export interface SchemaColumn {
  name: string;
  /** tipo completo do MySQL, ex.: "varchar(100)" ou "enum('active','ended')" */
  type: string;
  isPrimaryKey: boolean;
  comment: string;
  /** coluna da outra tabela que esta aponta (chave estrangeira) */
  references?: { table: string; column: string };
}

export interface SchemaTable {
  name: string;
  comment: string;
  columns: SchemaColumn[];
}

export interface DatabaseSchema {
  database: string;
  tables: SchemaTable[];
}

/**
 * Texto que a IA recebe. O formato é estável: o validador lê os nomes das tabelas
 * dele ("Tabela nome"), e o prompt depende dos comentários para entender cada coluna.
 */
export function formatSchemaForPrompt(schema: DatabaseSchema): string {
  let text = "";

  for (const table of schema.tables) {
    text += `Tabela ${table.name}${table.comment ? ` — ${table.comment}` : ""}\n`;
    for (const column of table.columns) {
      const extras = [column.isPrimaryKey ? "chave primaria" : "", column.comment]
        .filter(Boolean)
        .join(", ");
      text += `  - ${column.name} (${column.type})${extras ? ` - ${extras}` : ""}\n`;
    }
    text += "\n";
  }

  const relations = schema.tables.flatMap((table) =>
    table.columns
      .filter((column) => column.references)
      .map(
        (column) =>
          `  - ${table.name}.${column.name} -> ${column.references!.table}.${column.references!.column}\n`,
      ),
  );
  if (relations.length) text += `Relacionamentos:\n${relations.join("")}`;

  return text;
}

/** Tipo curto para a tela: "varchar(100)" -> "varchar", "enum('a','b')" -> "enum". */
export function shortType(type: string): string {
  return type.replace(/\(.*$/, "").toLowerCase();
}
