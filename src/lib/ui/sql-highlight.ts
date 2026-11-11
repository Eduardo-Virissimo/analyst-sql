// Realce de SQL: lógica pura (sem React) para ser testada.
// O componente só transforma cada token em um <span>; nunca monta HTML cru (sem XSS).

export type SqlTokenKind = "keyword" | "function" | "string" | "number" | "plain";

export interface SqlToken {
  text: string;
  kind: SqlTokenKind;
}

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL", "AS", "ON",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "GROUP", "BY", "ORDER", "HAVING",
  "LIMIT", "OFFSET", "DISTINCT", "WITH", "UNION", "ALL", "CASE", "WHEN", "THEN",
  "ELSE", "END", "ASC", "DESC", "BETWEEN", "LIKE", "EXISTS",
]);

const FUNCTIONS = new Set([
  "COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "YEAR", "MONTH", "DATE",
  "CURDATE", "NOW", "COALESCE", "DATEDIFF", "TIMESTAMPDIFF",
]);

/** Divide o SQL em pedaços (textos, números, palavras, resto) e classifica cada um. */
export function tokenizeSql(sql: string): SqlToken[] {
  const pieces =
    sql.match(/'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b\w+\b|[^\w']+/g) ?? [];

  return pieces.map((text) => {
    const upper = text.toUpperCase();
    let kind: SqlTokenKind = "plain";
    if (text.startsWith("'")) kind = "string";
    else if (/^\d/.test(text)) kind = "number";
    else if (KEYWORDS.has(upper)) kind = "keyword";
    else if (FUNCTIONS.has(upper)) kind = "function";
    return { text, kind };
  });
}

/** Quebra a linha antes das cláusulas principais, para ficar legível. */
export function formatSql(sql: string): string {
  return sql.replace(
    /\s+(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN)\b/gi,
    "\n$1",
  );
}
