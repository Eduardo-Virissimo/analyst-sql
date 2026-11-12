import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectChart, detectSingleValue, isNumeric } from "@/lib/ui/chart";

describe("detectChart", () => {
  it("texto + número vira gráfico", () => {
    const rows = [
      { setor: "TI", total: "5" },
      { setor: "RH", total: 7 },
    ];
    assert.deepEqual(detectChart(rows), { labelColumn: "setor", valueColumn: "total" });
  });
  it("duas colunas numéricas: a primeira é o rótulo", () => {
    const rows = [
      { ano: 2024, total: 3 },
      { ano: 2025, total: 4 },
    ];
    assert.deepEqual(detectChart(rows), { labelColumn: "ano", valueColumn: "total" });
  });
  it("uma linha só não vira gráfico", () => {
    assert.equal(detectChart([{ setor: "TI", total: 1 }]), null);
  });
  it("mais de 30 linhas não vira gráfico", () => {
    const rows = Array.from({ length: 31 }, (_, i) => ({ nome: `x${i}`, total: i }));
    assert.equal(detectChart(rows), null);
  });
  it("só texto não vira gráfico", () => {
    assert.equal(detectChart([{ a: "x" }, { a: "y" }]), null);
  });
  it("lista vazia não quebra", () => {
    assert.equal(detectChart([]), null);
  });
  it("isNumeric", () => {
    assert.equal(isNumeric("12.5"), true);
    assert.equal(isNumeric(""), false);
    assert.equal(isNumeric(null), false);
    assert.equal(isNumeric("abc"), false);
  });
});

describe("detectSingleValue", () => {
  it("uma linha com um número vira número grande", () => {
    assert.deepEqual(detectSingleValue([{ total: "40" }]), { label: "total", value: 40 });
  });
  it("texto, várias colunas ou várias linhas não viram", () => {
    assert.equal(detectSingleValue([{ nome: "Ana" }]), null);
    assert.equal(detectSingleValue([{ setor: "TI", total: 1 }]), null);
    assert.equal(detectSingleValue([{ total: 1 }, { total: 2 }]), null);
    assert.equal(detectSingleValue([]), null);
  });
});
