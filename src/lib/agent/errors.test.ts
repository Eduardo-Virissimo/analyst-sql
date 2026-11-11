import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDbConnectionError, sanitizeDbError } from "@/lib/agent/errors";

describe("isDbConnectionError", () => {
  it("reconhece recusa de conexão e acesso negado", () => {
    assert.equal(isDbConnectionError({ code: "ECONNREFUSED" }), true);
    assert.equal(isDbConnectionError({ code: "ER_ACCESS_DENIED_ERROR" }), true);
  });
  it("reconhece AggregateError (IPv4 + IPv6)", () => {
    assert.equal(isDbConnectionError({ errors: [{ code: "ECONNREFUSED" }] }), true);
  });
  it("erro de SQL não é erro de conexão", () => {
    assert.equal(isDbConnectionError({ code: "ER_BAD_FIELD_ERROR" }), false);
    assert.equal(isDbConnectionError(new Error("x")), false);
    assert.equal(isDbConnectionError(null), false);
  });
});

describe("sanitizeDbError", () => {
  it("esconde usuário@host", () => {
    assert.doesNotMatch(
      sanitizeDbError("Access denied for user 'agent_readonly'@'172.19.0.1'"),
      /agent_readonly|172/,
    );
  });
  it("esconde caminhos de arquivo", () => {
    assert.doesNotMatch(sanitizeDbError("erro em /var/lib/mysql/data.ibd"), /var\/lib/);
  });
  it("mantém a mensagem útil para a IA corrigir", () => {
    assert.match(sanitizeDbError("Unknown column 'nome' in 'field list'"), /Unknown column 'nome'/);
  });
});
