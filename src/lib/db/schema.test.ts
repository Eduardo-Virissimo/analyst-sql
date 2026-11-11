import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatSchemaForPrompt, shortType, type DatabaseSchema } from "@/lib/db/schema";
import { tablesFromSchema } from "@/lib/agent/agent";

const SCHEMA: DatabaseSchema = {
  database: "hr_agent",
  tables: [
    {
      name: "departments",
      comment: "Setores",
      columns: [
        { name: "id", type: "int", isPrimaryKey: true, comment: "" },
        { name: "code", type: "varchar(10)", isPrimaryKey: false, comment: "Sigla do setor" },
      ],
    },
    {
      name: "employees",
      comment: "",
      columns: [
        { name: "id", type: "int", isPrimaryKey: true, comment: "" },
        {
          name: "department_id",
          type: "int",
          isPrimaryKey: false,
          comment: "Setor da pessoa",
          references: { table: "departments", column: "id" },
        },
      ],
    },
  ],
};

describe("formatSchemaForPrompt", () => {
  const text = formatSchemaForPrompt(SCHEMA);

  it("mostra o tipo de cada coluna (nunca 'undefined')", () => {
    assert.match(text, /- code \(varchar\(10\)\)/);
    assert.doesNotMatch(text, /undefined/);
  });

  it("marca a chave primária e inclui o comentário", () => {
    assert.match(text, /- id \(int\) - chave primaria/);
    assert.match(text, /- code \(varchar\(10\)\) - Sigla do setor/);
  });

  it("junta chave primária e comentário quando as duas existem", () => {
    const both = formatSchemaForPrompt({
      database: "x",
      tables: [
        { name: "t", comment: "", columns: [{ name: "id", type: "int", isPrimaryKey: true, comment: "Identificador" }] },
      ],
    });
    assert.match(both, /chave primaria, Identificador/);
  });

  it("escreve o comentário da tabela só quando existe", () => {
    assert.match(text, /^Tabela departments — Setores$/m);
    assert.match(text, /^Tabela employees$/m);
  });

  it("lista os relacionamentos no fim", () => {
    assert.match(text, /Relacionamentos:\n {2}- employees\.department_id -> departments\.id\n$/);
  });

  it("sem chaves estrangeiras, não escreve a seção de relacionamentos", () => {
    assert.doesNotMatch(
      formatSchemaForPrompt({ database: "x", tables: [SCHEMA.tables[0]] }),
      /Relacionamentos/,
    );
  });

  it("o validador consegue ler os nomes das tabelas do texto", () => {
    assert.deepEqual(tablesFromSchema(text), ["departments", "employees"]);
  });
});

describe("shortType", () => {
  it("tira o tamanho e os valores do enum", () => {
    assert.equal(shortType("varchar(100)"), "varchar");
    assert.equal(shortType("enum('active','ended')"), "enum");
    assert.equal(shortType("INT"), "int");
  });
});
