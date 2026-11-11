// Busca a estrutura do banco para o painel "Banco de dados".
import type { DatabaseSchema } from "@/lib/db/schema";

export async function fetchSchema(fetcher: typeof fetch = fetch): Promise<DatabaseSchema> {
  const response = await fetcher("/api/schema");

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // resposta que não é JSON: tratada abaixo
  }

  if (!response.ok) {
    const message = (body as { error?: unknown } | null)?.error;
    throw new Error(
      typeof message === "string" && message
        ? message
        : `Não foi possível carregar o banco (erro ${response.status}).`,
    );
  }

  const schema = body as DatabaseSchema | null;
  if (!schema || !Array.isArray(schema.tables)) {
    throw new Error("Resposta inesperada ao carregar o banco.");
  }
  return schema;
}
