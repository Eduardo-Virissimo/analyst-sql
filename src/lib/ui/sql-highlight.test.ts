import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatSql, tokenizeSql } from "@/lib/ui/sql-highlight";

const kinds = (sql: string) =>
  tokenizeSql(sql)
    .filter((t) => t.kind !== "plain")
    .map((t) => `${t.kind}:${t.text}`);

describe("tokenizeSql", () => {
  it("classifica palavras-chave, funções, textos e números", () => {
    assert.deepEqual(kinds("SELECT COUNT(*) FROM t WHERE x = 'a' AND y > 10"), [
      "keyword:SELECT",
      "function:COUNT",
      "keyword:FROM",
      "keyword:WHERE",
      "string:'a'",
      "keyword:AND",
      "number:10",
    ]);
  });

  it("ignora maiúsculas e minúsculas", () => {
    assert.deepEqual(kinds("select count(*) from t"), [
      "keyword:select",
      "function:count",
      "keyword:from",
    ]);
  });

  it("não reclassifica palavra dentro de texto", () => {
    assert.deepEqual(kinds("WHERE motivo = 'SELECT FROM'"), [
      "keyword:WHERE",
      "string:'SELECT FROM'",
    ]);
  });

  it("não perde nenhum caractere (remontar devolve o SQL original)", () => {
    const sql = "SELECT d.code AS setor, COUNT(*) FROM departments d -- fim\n";
    assert.equal(tokenizeSql(sql).map((t) => t.text).join(""), sql);
  });

  it("tags HTML viram texto comum (nada é interpretado)", () => {
    const tokens = tokenizeSql("SELECT '<script>alert(1)</script>'");
    assert.equal(tokens.find((t) => t.text.includes("<script>"))?.kind, "string");
  });

  it("texto vazio devolve lista vazia", () => {
    assert.deepEqual(tokenizeSql(""), []);
  });
});

describe("formatSql", () => {
  it("quebra a linha antes das cláusulas principais", () => {
    assert.equal(
      formatSql("SELECT a FROM t WHERE x = 1 GROUP BY a ORDER BY a LIMIT 5"),
      "SELECT a\nFROM t\nWHERE x = 1\nGROUP BY a\nORDER BY a\nLIMIT 5",
    );
  });

  it("quebra antes de JOIN", () => {
    assert.match(formatSql("SELECT 1 FROM a LEFT JOIN b ON a.id = b.id"), /\nLEFT JOIN b/);
  });
});
