// GET /api/schema — a estrutura do banco, para a tela mostrar o que dá para consultar.
// Só metadados (nomes e comentários de tabelas e colunas), nunca os dados.
import { AgentError } from "@/lib/agent/errors";
import { describeError } from "@/lib/http/api-error";
import { createRateLimiter, type RateLimiter } from "@/lib/http/rate-limit";
import { clientKey, isSameOrigin } from "@/lib/http/request-guard";
import { getDatabaseSchema } from "@/lib/db/schema-cache";

// guardado em globalThis para sobreviver ao hot reload do `next dev`
const globalState = globalThis as typeof globalThis & {
  schemaLimiter?: RateLimiter;
};
const limiter = (globalState.schemaLimiter ??= createRateLimiter({
  limit: 30,
  windowMs: 60_000,
}));

export async function GET(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Origem não permitida." }, { status: 403 });
  }

  const limit = limiter.check(clientKey(request));
  if (!limit.allowed) {
    return Response.json(
      { error: "Muitas requisições. Tente de novo em instantes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  try {
    return Response.json(await getDatabaseSchema());
  } catch (err) {
    console.error(err);
    const { message, status } = describeError(new AgentError("db", "schema", { cause: err }));
    return Response.json({ error: message }, { status });
  }
}
