export const MAX_ROWS = 200;

const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "CREATE",
  "TRUNCATE",
  "REPLACE",
  "GRANT",
  "REVOKE",
  "RENAME",
  "CALL",
  "EXECUTE",
  "PREPARE",
  "HANDLER",
  "LOCK",
  "UNLOCK",
  "SET",
  "LOAD",
  "OUTFILE",
  "DUMPFILE",
  "INTO",
  "SLEEP",
  "BENCHMARK",
  "LOAD_FILE",
];

const FORBIDDEN_SCHEMAS = [
  "INFORMATION_SCHEMA",
  "MYSQL",
  "PERFORMANCE_SCHEMA",
  "SYS",
];

export type ValidationResult =
  | { valid: false; reason: string }
  | { valid: true; sql: string; safeSql: string };

export function validateSql(
  input: string | null | undefined,
): ValidationResult {
  if (!input || !input.trim()) {
    return { valid: false, reason: "Consulta vazia." };
  }

  // 1) remove comentarios (-- , # e /* */), que podem esconder comandos
  let sql = input
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ")
    .replace(/#[^\n]*/g, " ")
    .trim();
  // 2) tira um ponto e virgula final, se houver
  sql = sql.replace(/;\s*$/, "");

  // 3) para checar palavras, ignora o conteudo de textos entre aspas
  // (assim WHERE end_reason = 'dispensa' nao confunde o validador)
  const withoutStrings = sql
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""');

  // 4) um comando de cada vez
  if (withoutStrings.includes(";")) {
    return { valid: false, reason: "Mais de um comando na mesma consulta." };
  }

  // 5) precisa comecar com SELECT ou WITH
  const upper = withoutStrings.toUpperCase();
  if (!/^(SELECT|WITH)\b/.test(upper)) {
    return {
      valid: false,
      reason: "Só são permitidas consultas de leitura (SELECT).",
    };
  }

  // 6) nenhuma palavra proibida
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (new RegExp(`\\b${keyword}\\b`).test(upper)) {
      return { valid: false, reason: `Comando nao permitido: ${keyword}.` };
    }
  }
  for (const schema of FORBIDDEN_SCHEMAS) {
    if (new RegExp(`\\b${schema}\\s*\\.`).test(upper)) {
      return {
        valid: false,
        reason: `Acesso ao esquema interno ${schema} nao eh permitido.`,
      };
    }
  }

  // 7) garante um limite de linhas no fim da consulta
  return { valid: true, sql, safeSql: enforceRowLimit(sql) };
}

function enforceRowLimit(sql: string): string {
  const trailingLimit = /\bLIMIT\s+(\d+)\s*(?:(?:,|OFFSET)\s*\d+)?\s*$/i;
  const match = sql.match(trailingLimit);
  if (!match) return `${sql} LIMIT ${MAX_ROWS}`;
  if (Number(match[1]) > MAX_ROWS) {
    return sql.replace(trailingLimit, `LIMIT ${MAX_ROWS}`);
  }
  return sql;
}
