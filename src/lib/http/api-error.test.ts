import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AgentError } from "@/lib/agent/errors";
import { describeError } from "@/lib/http/api-error";

describe("describeError", () => {
  it("banco fora do ar vira 503", () => {
    assert.equal(describeError(new AgentError("db", "x")).status, 503);
  });
  it("IA fora do ar vira 502", () => {
    assert.equal(describeError(new AgentError("llm", "x")).status, 502);
  });
  it("erro desconhecido vira 500 genérico e não vaza o texto original", () => {
    const result = describeError(new Error("senha=123 em /etc/segredo"));
    assert.equal(result.status, 500);
    assert.doesNotMatch(result.message, /senha|segredo/);
  });
  it("aceita qualquer coisa lançada", () => {
    assert.equal(describeError("texto solto").status, 500);
    assert.equal(describeError(null).status, 500);
  });
});
