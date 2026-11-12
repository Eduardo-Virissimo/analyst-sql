// POST /api/ask — recebe { "question": "..." } e responde aos poucos, uma linha JSON por vez (NDJSON):
// { "progress": ... } a cada etapa do agente e, no fim, { "result": AgentResult } ou { "error": "mensagem" }.
// Assim a tela mostra o que está acontecendo enquanto a resposta não chega.
//
// Antes de chamar o agente, a rota confere a requisição (origem, formato, limite de uso,
// tamanho da pergunta). Detalhes técnicos de erro ficam só no terminal.
import { answerQuestion } from "@/lib/agent/agent";
import { describeError } from "@/lib/http/api-error";
import { createRateLimiter, type RateLimiter } from "@/lib/http/rate-limit";
import { clientKey, isJson, isSameOrigin } from "@/lib/http/request-guard";
import type { AskEvent } from "@/lib/types";

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

  // daqui em diante a resposta já começou (status 200): um erro do agente vai como a última linha
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AskEvent) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        } catch {
          // a pessoa fechou a página: não há mais para quem enviar
        }
      };
      try {
        const result = await answerQuestion(question, { onStep: (progress) => send({ progress }) });
        send({ result });
      } catch (err) {
        console.error(err);
        send({ error: describeError(err).message });
      }
      try {
        controller.close();
      } catch {
        // já fechado
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
