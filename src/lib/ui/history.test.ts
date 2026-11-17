import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_THREADS, parseThreads, threadGroup, threadTitle, toStorable, type Thread } from "./history";

const done = (id: string) => ({
  id,
  question: "Quantos colaboradores?",
  status: "done" as const,
  result: { question: "q", success: true, sql: "SELECT 1", rows: [], attempts: [], durationMs: 10 },
});

test("threadTitle encurta perguntas longas e tira espaços extras", () => {
  assert.equal(threadTitle("  Quantos   colaboradores? "), "Quantos colaboradores?");
  const long = threadTitle("a".repeat(100));
  assert.equal(long.length, 60);
  assert.ok(long.endsWith("…"));
});

test("toStorable tira respostas a caminho e conversas vazias", () => {
  const threads: Thread[] = [
    { id: "1", title: "um", updatedAt: 1, turns: [done("a"), { id: "b", question: "x", status: "loading" }] },
    { id: "2", title: "dois", updatedAt: 2, turns: [{ id: "c", question: "x", status: "loading" }] },
  ];
  const stored = toStorable(threads);
  assert.equal(stored.length, 1);
  assert.equal(stored[0].turns.length, 1);
});

test("toStorable guarda só as conversas mais recentes", () => {
  const many: Thread[] = Array.from({ length: MAX_THREADS + 5 }, (_, i) => ({
    id: String(i),
    title: String(i),
    updatedAt: i,
    turns: [done(`t${i}`)],
  }));
  const stored = toStorable(many);
  assert.equal(stored.length, MAX_THREADS);
  assert.equal(stored[0].id, String(MAX_THREADS + 4));
});

test("parseThreads aguenta texto inválido", () => {
  assert.deepEqual(parseThreads(null), []);
  assert.deepEqual(parseThreads("{quebrado"), []);
  assert.deepEqual(parseThreads('{"a":1}'), []);
  assert.deepEqual(parseThreads('[{"id":1}]'), []);
  const ok = parseThreads('[{"id":"1","title":"t","updatedAt":1,"turns":[]}]');
  assert.equal(ok.length, 1);
});

test("threadGroup separa hoje, ontem e antes", () => {
  const now = new Date(2026, 10, 17, 15).getTime();
  assert.equal(threadGroup(new Date(2026, 10, 17, 8).getTime(), now), "Hoje");
  assert.equal(threadGroup(new Date(2026, 10, 16, 23).getTime(), now), "Ontem");
  assert.equal(threadGroup(new Date(2026, 10, 1).getTime(), now), "Antes");
});
