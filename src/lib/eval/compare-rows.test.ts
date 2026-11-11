import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeRows, sameRows } from "@/lib/eval/compare-rows";

describe("comparação da avaliação", () => {
  it("ignora nome de coluna e formato do número", () => {
    const a = normalizeRows([{ total: "33.80" }]);
    const b = normalizeRows([{ "COUNT(*)": 33.8 }]);
    assert.ok(sameRows(a, b));
  });
  it("ignora a ordem das linhas quando ela não importa", () => {
    const a = normalizeRows([{ x: "b" }, { x: "a" }]);
    const b = normalizeRows([{ x: "a" }, { x: "b" }]);
    assert.ok(sameRows(a, b));
  });
  it("respeita a ordem quando importa", () => {
    const a = normalizeRows([{ x: "b" }, { x: "a" }], true);
    const b = normalizeRows([{ x: "a" }, { x: "b" }], true);
    assert.equal(sameRows(a, b), false);
  });
  it("detecta resultado diferente", () => {
    assert.equal(sameRows(normalizeRows([{ x: 1 }]), normalizeRows([{ x: 2 }])), false);
  });
});
