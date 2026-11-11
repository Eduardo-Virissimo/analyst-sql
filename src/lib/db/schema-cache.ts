// A estrutura do banco é lida uma vez e guardada, para o agente e para a tela usarem a mesma.
// (Fica em globalThis porque o Next pode carregar este arquivo mais de uma vez.)
import { readDatabaseSchema } from "@/lib/db/mysql";
import { formatSchemaForPrompt, type DatabaseSchema } from "@/lib/db/schema";

const store = globalThis as typeof globalThis & { schemaCache?: DatabaseSchema };

export async function getDatabaseSchema(): Promise<DatabaseSchema> {
  store.schemaCache ??= await readDatabaseSchema();
  return store.schemaCache;
}

// o mesmo schema, em texto, para a IA
export async function getSchemaText(): Promise<string> {
  return formatSchemaForPrompt(await getDatabaseSchema());
}
