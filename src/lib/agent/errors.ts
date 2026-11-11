// Erros de infraestrutura (banco ou IA fora do ar), diferentes de "a IA errou o SQL".
// A rota converte cada tipo em uma resposta HTTP clara, sem vazar detalhes internos.

export type AgentErrorKind = "db" | "llm";

export class AgentError extends Error {
  constructor(
    public readonly kind: AgentErrorKind,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AgentError";
  }
}

// códigos do mysql2/Node que indicam banco inacessível (e não SQL errado)
const DB_CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "PROTOCOL_CONNECTION_LOST",
  "ER_ACCESS_DENIED_ERROR",
  "ER_DBACCESS_DENIED_ERROR",
  "ER_BAD_DB_ERROR",
  "ER_CON_COUNT_ERROR",
]);

export function isDbConnectionError(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  if (typeof code === "string" && DB_CONNECTION_CODES.has(code)) return true;
  // mysql2 agrupa tentativas IPv4/IPv6 num AggregateError
  const inner = (err as { errors?: unknown[] } | null)?.errors;
  return Array.isArray(inner) && inner.some(isDbConnectionError);
}

// o texto de erro do MySQL volta para a IA e para a tela: tiramos usuário@host e caminhos
export function sanitizeDbError(message: string): string {
  return message
    .replace(/'[^']*'@'[^']*'/g, "'***'@'***'")
    .replace(/(?:[A-Za-z]:)?[\\/][\w.\\/-]{3,}/g, "<caminho>");
}
