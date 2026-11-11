// Barreira de segurança do SQL gerado pela IA (camada 2 de 4; ver docs/SECURITY.md).
// O SQL que será executado é SEMPRE o `safeSql` devolvido aqui (sem comentários e
// com limite de linhas), nunca o texto original da IA.

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
  "DO",
];

// funções que travam o servidor, vazam informação do servidor ou usam travas globais
const FORBIDDEN_FUNCTIONS = [
  "SLEEP",
  "BENCHMARK",
  "LOAD_FILE",
  "GET_LOCK",
  "RELEASE_LOCK",
  "RELEASE_ALL_LOCKS",
  "IS_FREE_LOCK",
  "IS_USED_LOCK",
  "MASTER_POS_WAIT",
  "WAIT_FOR_EXECUTED_GTID_SET",
  "VERSION",
  "USER",
  "CURRENT_USER",
  "SESSION_USER",
  "SYSTEM_USER",
  "CONNECTION_ID",
  "DATABASE",
  "SCHEMA",
];

const FORBIDDEN_SCHEMAS = [
  "INFORMATION_SCHEMA",
  "MYSQL",
  "PERFORMANCE_SCHEMA",
  "SYS",
];

export interface ValidateOptions {
  /** Se informado, FROM/JOIN só podem citar estas tabelas (ou CTEs da própria consulta). */
  allowedTables?: readonly string[];
}

export type ValidationResult =
  | { valid: false; reason: string }
  | { valid: true; sql: string; safeSql: string };

interface Scanned {
  /** SQL sem comentários, com os textos originais (é o que será executado) */
  clean: string;
  /** versão só para inspeção: textos viram '' e crases são removidas */
  masked: string;
}

// Percorre o SQL caractere a caractere, respeitando aspas, crases e comentários.
// Isso evita que "--" ou "#" dentro de um texto sejam tratados como comentário
// e que palavras dentro de textos disparem falsos positivos.
function scan(input: string): Scanned | { error: string } {
  let clean = "";
  let masked = "";
  let i = 0;

  while (i < input.length) {
    const c = input[i];
    const next = input[i + 1];

    if (c === "'" || c === '"') {
      let j = i + 1;
      let closed = false;
      while (j < input.length) {
        if (input[j] === "\\") {
          j += 2;
          continue;
        }
        if (input[j] === c) {
          closed = true;
          break;
        }
        j++;
      }
      if (!closed) return { error: "Texto entre aspas sem fechar." };
      clean += input.slice(i, j + 1);
      masked += c + c;
      i = j + 1;
    } else if (c === "`") {
      const end = input.indexOf("`", i + 1);
      if (end === -1) return { error: "Identificador entre crases sem fechar." };
      const name = input.slice(i + 1, end);
      clean += input.slice(i, end + 1);
      masked += ` ${name} `;
      i = end + 1;
    } else if (c === "/" && next === "*") {
      const end = input.indexOf("*/", i + 2);
      if (end === -1) return { error: "Comentário sem fechar." };
      // /*! ... */ é executado pelo MySQL: nunca deixamos passar
      if (input[i + 2] === "!") {
        return { error: "Comentário executável do MySQL não é permitido." };
      }
      clean += " ";
      masked += " ";
      i = end + 2;
    } else if (c === "#" || (c === "-" && next === "-")) {
      const end = input.indexOf("\n", i);
      clean += " ";
      masked += " ";
      i = end === -1 ? input.length : end;
    } else {
      clean += c;
      masked += c;
      i++;
    }
  }

  return { clean: clean.trim(), masked: masked.trim() };
}

export function validateSql(
  input: string | null | undefined,
  options: ValidateOptions = {},
): ValidationResult {
  if (!input || !input.trim()) {
    return { valid: false, reason: "Consulta vazia." };
  }

  const scanned = scan(input);
  if ("error" in scanned) return { valid: false, reason: scanned.error };

  // tira UM ponto e vírgula final (inofensivo); qualquer outro é segundo comando
  const sql = scanned.clean.replace(/;\s*$/, "");
  const masked = scanned.masked.replace(/;\s*$/, "");

  if (!sql) return { valid: false, reason: "Consulta vazia." };

  if (masked.includes(";")) {
    return { valid: false, reason: "Mais de um comando na mesma consulta." };
  }

  const upper = masked.toUpperCase();

  if (!/^(SELECT|WITH)\b/.test(upper)) {
    return {
      valid: false,
      reason: "Só são permitidas consultas de leitura (SELECT).",
    };
  }

  if (upper.includes("@")) {
    return {
      valid: false,
      reason: "Variáveis (@) e variáveis de sistema (@@) não são permitidas.",
    };
  }

  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (new RegExp(`\\b${keyword}\\b`).test(upper)) {
      return { valid: false, reason: `Comando não permitido: ${keyword}.` };
    }
  }

  if (/\bFOR\s+(UPDATE|SHARE)\b/.test(upper)) {
    return { valid: false, reason: "Consultas com trava (FOR UPDATE/SHARE) não são permitidas." };
  }

  for (const fn of FORBIDDEN_FUNCTIONS) {
    if (new RegExp(`\\b${fn}\\s*\\(`).test(upper)) {
      return { valid: false, reason: `Função não permitida: ${fn}.` };
    }
  }

  for (const schema of FORBIDDEN_SCHEMAS) {
    if (new RegExp(`\\b${schema}\\s*\\.`).test(upper)) {
      return {
        valid: false,
        reason: `Acesso ao esquema interno ${schema} não é permitido.`,
      };
    }
  }

  if (options.allowedTables) {
    const problem = checkTables(upper, options.allowedTables);
    if (problem) return { valid: false, reason: problem };
  }

  return { valid: true, sql, safeSql: enforceRowLimit(sql) };
}

// FROM/JOIN só podem citar tabelas conhecidas (ou CTEs da própria consulta)
function checkTables(upper: string, allowed: readonly string[]): string | null {
  const allowedSet = new Set(allowed.map((t) => t.toUpperCase()));

  const ctes = new Set<string>();
  for (const m of upper.matchAll(
    /(?:\bWITH\s+(?:RECURSIVE\s+)?|,\s*)(\w+)\s*(?:\([^)]*\))?\s+AS\s*\(/g,
  )) {
    ctes.add(m[1]);
  }

  // EXTRACT(YEAR FROM x), TRIM(... FROM x) e SUBSTRING(x FROM n) não são tabelas
  const withoutFunctionFrom = upper.replace(
    /\b(?:TRIM\s*\([^()]*?|SUBSTRING\s*\([^()]*?|EXTRACT\s*\(\s*\w+\s+)\bFROM\b/g,
    "(",
  );

  for (const m of withoutFunctionFrom.matchAll(
    /\b(?:FROM|JOIN)\s+(\w+)(\s*\.\s*\w+)?/g,
  )) {
    if (m[2]) {
      return "Use apenas o nome da tabela, sem prefixo de banco/esquema.";
    }
    const table = m[1];
    if (!allowedSet.has(table) && !ctes.has(table)) {
      return `Tabela não permitida: ${table.toLowerCase()}.`;
    }
  }
  return null;
}

// garante um LIMIT de no máximo MAX_ROWS linhas no fim da consulta
// (cobre as formas "LIMIT n", "LIMIT n OFFSET m" e "LIMIT m, n")
function enforceRowLimit(sql: string): string {
  const trailingLimit =
    /\bLIMIT\s+(\d+)(?:\s*,\s*(\d+)|\s+OFFSET\s+(\d+))?\s*$/i;
  const match = sql.match(trailingLimit);
  if (!match) return `${sql} LIMIT ${MAX_ROWS}`;

  const [, first, commaCount, offsetValue] = match;
  const count = Number(commaCount ?? first);
  if (count <= MAX_ROWS) return sql;

  const replacement = commaCount
    ? `LIMIT ${first}, ${MAX_ROWS}`
    : offsetValue
      ? `LIMIT ${MAX_ROWS} OFFSET ${offsetValue}`
      : `LIMIT ${MAX_ROWS}`;
  return sql.replace(trailingLimit, replacement);
}
