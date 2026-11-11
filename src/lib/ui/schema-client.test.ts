import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchSchema } from "@/lib/ui/schema-client";

const respond = (status: number, body: unknown, raw = false): typeof fetch =>
  (async () => new Response(raw ? String(body) : JSON.stringify(body), { status })) as typeof fetch;

describe("fetchSchema", () => {
  it("devolve o schema quando a API responde 200", async () => {
    const schema = { database: "hr_agent", tables: [] };
    assert.deepEqual(await fetchSchema(respond(200, schema)), schema);
  });

  it("usa a mensagem de erro da API", async () => {
    await assert.rejects(
      fetchSchema(respond(503, { error: "O banco de dados está indisponível no momento." })),
      /indisponível/,
    );
  });

  it("erro que não é JSON vira mensagem com o status", async () => {
    await assert.rejects(fetchSchema(respond(502, "<html>x</html>", true)), /erro 502/);
  });

  it("resposta 200 sem a lista de tabelas é erro", async () => {
    await assert.rejects(fetchSchema(respond(200, { database: "x" })), /inesperada/);
  });
});
