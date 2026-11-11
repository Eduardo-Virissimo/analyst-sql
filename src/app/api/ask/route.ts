// POST /api/ask — recebe { "question": "..." } e devolve o AgentResult em JSON.
//
// Antes de chamar o agente, a rota confere a requisição (origem, formato, limite de uso,
// tamanho da pergunta). Detalhes técnicos de erro ficam só no terminal.
import { answerQuestion } from "@/lib/agent/agent";
import { describeError } from "@/lib/http/api-error";
import { createRateLimiter, type RateLimiter } from "@/lib/http/rate-limit";
import { clientKey, isJson, isSameOrigin } from "@/lib/http/request-guard";

const MAX_QUESTION_LENGTH = 500;
const MAX_BODY_BYTES = 4096;

// guardado em globalThis para sobreviver ao hot reload do `next dev`
const globalWithLimiter = globalThis as typeof globalThis & {
  askLimiter?: RateLimiter;
};
const limiter = (globalWithLimiter.askLimiter ??= createRateLimiter({
  limit: 10,
  windowMs: 60_000,
}));

function error(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ error: message }, { status, headers });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return error("Origem não permitida.", 403);
  if (!isJson(request)) return error("Envie o corpo como application/json.", 415);

  const limit = limiter.check(clientKey(request));
  if (!limit.allowed) {
    const seconds = Math.ceil(limit.retryAfterMs / 1000);
    return error(`Muitas perguntas seguidas. Tente de novo em ${seconds} s.`, 429, {
      "Retry-After": String(seconds),
    });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return error("Requisição grande demais.", 413);
    body = JSON.parse(text);
  } catch {
    return error("Corpo da requisição inválido.", 400);
  }

  // o corpo vem de fora: não confiamos no formato
  const question = String((body as { question?: unknown } | null)?.question ?? "").trim();
  if (!question) return error("Envie uma pergunta.", 400);
  if (question.length > MAX_QUESTION_LENGTH) {
    return error(`Pergunta muito longa (máximo ${MAX_QUESTION_LENGTH} caracteres).`, 400);
  }

  try {
    return Response.json(await answerQuestion(question));
  } catch (err) {
    console.error(err);
    const { message, status } = describeError(err);
    return error(message, status);
  }
}
