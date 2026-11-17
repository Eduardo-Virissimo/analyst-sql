import assert from "node:assert/strict";
import { test } from "node:test";
import { explainSql, relatedQuestions, sqlTables } from "./explain-sql";

const BY_DEPARTMENT =
  "SELECT d.name AS setor, COUNT(e.id) AS total FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY total DESC LIMIT 200";

test("sqlTables acha as tabelas de FROM e JOIN, sem repetir", () => {
  assert.deepEqual(sqlTables(BY_DEPARTMENT), ["departments", "employees"]);
  assert.deepEqual(sqlTables("select * from `employments` e join employments x on 1=1"), ["employments"]);
});

test("explainSql descreve a busca em português simples", () => {
  assert.deepEqual(explainSql(BY_DEPARTMENT), [
    "Olhou setores e colaboradores",
    "Contou",
    "Separou em grupos",
    "Ordenou do maior para o menor",
  ]);
});

test("explainSql reconhece filtro, ano, média e ordem crescente", () => {
  const sql = "SELECT YEAR(start_date) ano, AVG(weekly_hours) FROM employments WHERE status = 'active' GROUP BY YEAR(start_date) ORDER BY ano";
  assert.deepEqual(explainSql(sql), [
    "Olhou vínculos",
    "Filtrou só o que a pergunta pede",
    "Calculou a média",
    "Separou por ano",
    "Ordenou do menor para o maior",
  ]);
});

test("explainSql com tabela desconhecida usa o nome sem sublinhado", () => {
  assert.deepEqual(explainSql("SELECT * FROM job_titles"), ["Olhou job titles"]);
});

test("relatedQuestions prefere o mesmo assunto e não repete perguntas feitas", () => {
  const next = relatedQuestions("SELECT COUNT(*) FROM employments", ["Quantos vínculos existem de cada tipo?"]);
  assert.equal(next.length, 3);
  assert.ok(!next.includes("Quantos vínculos existem de cada tipo?"));
  assert.equal(next[0], "Quantos vínculos começaram em cada ano?");
});

test("relatedQuestions sem busca devolve as primeiras perguntas", () => {
  assert.equal(relatedQuestions(null, [], 2).length, 2);
});
