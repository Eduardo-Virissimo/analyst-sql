import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { askAgent } from "@/lib/ui/ask-client";
import type { AgentResult } from "@/lib/types";

const RESULT = { question: "q", success: true, sql: "SELECT 1", rows: [], attempts: [], durationMs: 1 } satisfies AgentResult;

function fakeFetch(status: number, body: unknown, raw = false): typeof fetch {
  return (async () => new Response(raw ? String(body) : JSON.stringify(body), { status })) as typeof fetch;
}

describe("askAgent", () => {
  it("devolve o resultado quando a API responde 200", async () => {
    assert.deepEqual(await askAgent("q", fakeFetch(200, RESULT)), RESULT);
  });

  it("envia a pergunta como JSON", async () => {
    let sent: RequestInit | undefined;
    const fetcher = (async (_url: unknown, init?: RequestInit) => {
      sent = init;
      return new Response(JSON.stringify(RESULT));
    }) as typeof fetch;
    await askAgent("Quantos setores?", fetcher);
    assert.equal(sent?.method, "POST");
    assert.equal(sent?.body, JSON.stringify({ question: "Quantos setores?" }));
  });

  it("usa a mensagem de erro da API", async () => {
    await assert.rejects(askAgent("q", fakeFetch(429, { error: "Muitas perguntas seguidas." })), /Muitas perguntas/);
  });

  it("tem mensagem própria quando a resposta de erro não é JSON", async () => {
    await assert.rejects(askAgent("q", fakeFetch(502, "<html>Bad Gateway</html>", true)), /erro 502/);
  });
});
