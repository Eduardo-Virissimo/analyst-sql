import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clientKey, isJson, isSameOrigin } from "@/lib/http/request-guard";

function req(headers: Record<string, string>) {
  return new Request("http://localhost:3000/api/ask", { method: "POST", headers });
}

describe("isSameOrigin", () => {
  it("aceita requisição sem Origin (curl)", () => {
    assert.equal(isSameOrigin(req({ host: "localhost:3000" })), true);
  });
  it("aceita a mesma origem", () => {
    assert.equal(
      isSameOrigin(req({ host: "localhost:3000", origin: "http://localhost:3000" })),
      true,
    );
  });
  it("bloqueia outra origem", () => {
    assert.equal(
      isSameOrigin(req({ host: "localhost:3000", origin: "https://evil.example" })),
      false,
    );
  });
  it("bloqueia Origin malformado", () => {
    assert.equal(isSameOrigin(req({ host: "localhost:3000", origin: "não é url" })), false);
  });
  it("respeita x-forwarded-host atrás de proxy", () => {
    assert.equal(
      isSameOrigin(
        req({ host: "interno:3000", "x-forwarded-host": "app.example", origin: "https://app.example" }),
      ),
      true,
    );
  });
});

describe("isJson", () => {
  it("aceita application/json com charset", () => {
    assert.equal(isJson(req({ "content-type": "application/json; charset=utf-8" })), true);
  });
  it("recusa text/plain", () => {
    assert.equal(isJson(req({ "content-type": "text/plain" })), false);
  });
  it("recusa sem content-type", () => {
    assert.equal(isJson(req({})), false);
  });
});

describe("clientKey", () => {
  it("usa o primeiro IP de x-forwarded-for", () => {
    assert.equal(clientKey(req({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
  });
  it("usa 'local' quando não há cabeçalho", () => {
    assert.equal(clientKey(req({})), "local");
  });
});
