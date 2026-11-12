import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  answerMeta,
  columnLabel,
  columnDetail,
  columnText,
  databaseLabel,
  fieldsLabel,
  friendlyType,
  orderBySubject,
  shortColumnText,
  stepLabel,
  subjectText,
  subjectsLabel,
  tableText,
} from "@/lib/ui/friendly";

describe("friendlyType", () => {
  it("traduz os tipos do banco", () => {
    assert.equal(friendlyType("int"), "número");
    assert.equal(friendlyType("bigint"), "número");
    assert.equal(friendlyType("decimal(10,2)"), "número");
    assert.equal(friendlyType("varchar(100)"), "texto");
    assert.equal(friendlyType("text"), "texto");
    assert.equal(friendlyType("date"), "data");
    assert.equal(friendlyType("datetime"), "data e hora");
    assert.equal(friendlyType("enum('active','ended')"), "uma opção");
    assert.equal(friendlyType("tinyint(1)"), "sim ou não");
  });
  it("tipo desconhecido vira 'dado'", () => {
    assert.equal(friendlyType("geometry"), "dado");
  });
});

describe("tableText", () => {
  it("separa título e descrição no dois-pontos", () => {
    assert.deepEqual(
      tableText({ name: "employees", comment: "Colaboradores: pessoas que trabalham ou já trabalharam" }),
      { title: "Colaboradores", description: "Pessoas que trabalham ou já trabalharam" },
    );
  });
  it("sem dois-pontos, o comentário inteiro é o título", () => {
    assert.deepEqual(tableText({ name: "departments", comment: "Setores da instituição" }), {
      title: "Setores da instituição",
      description: "",
    });
  });
  it("sem comentário, usa o nome da tabela", () => {
    assert.deepEqual(tableText({ name: "logs", comment: "  " }), { title: "logs", description: "" });
  });
});

describe("columnText", () => {
  it("prefere a descrição em português; senão, o nome", () => {
    assert.equal(columnText({ name: "name", comment: "Nome do setor" }), "Nome do setor");
    assert.equal(columnText({ name: "email", comment: "" }), "email");
  });
});

describe("databaseLabel", () => {
  it("traduz bancos conhecidos e tira sublinhados dos outros", () => {
    assert.equal(databaseLabel("hr_agent"), "Dados de RH");
    assert.equal(databaseLabel("vendas_2026"), "vendas 2026");
    assert.equal(databaseLabel(""), "Dados");
  });
});

describe("plurais", () => {
  it("assuntos e informações", () => {
    assert.equal(subjectsLabel(1), "1 assunto");
    assert.equal(subjectsLabel(3), "3 assuntos");
    assert.equal(fieldsLabel(1), "1 informação");
    assert.equal(fieldsLabel(8), "8 informações");
  });
});

describe("shortColumnText", () => {
  it("fica só com o começo do comentário", () => {
    assert.equal(shortColumnText({ name: "type", comment: "Tipo de vínculo: permanent = efetivo, temporary = temporário" }), "Tipo de vínculo");
    assert.equal(shortColumnText({ name: "code", comment: "Sigla do setor, ex: TI, RH" }), "Sigla do setor");
    assert.equal(shortColumnText({ name: "end_date", comment: "Data de encerramento; NULL enquanto o vínculo está ativo" }), "Data de encerramento");
  });
  it("sem comentário usa o nome da coluna", () => {
    assert.equal(shortColumnText({ name: "email", comment: "" }), "Email");
    assert.equal(shortColumnText({ name: "job_title", comment: "" }), "Job title");
  });
});

describe("orderBySubject", () => {
  const col = (name: string, table?: string) => ({ name, comment: "", type: "int", isPrimaryKey: false, references: table ? { table, column: "id" } : undefined });

  it("põe primeiro o assunto que os outros usam", () => {
    const tables = [
      { name: "employments", columns: [col("employee_id", "employees")] },
      { name: "employees", columns: [col("department_id", "departments")] },
      { name: "departments", columns: [col("id")] },
    ];
    assert.deepEqual(orderBySubject(tables).map((t) => t.name), ["departments", "employees", "employments"]);
  });

  it("não trava quando há uma ligação em ciclo", () => {
    const tables = [
      { name: "a", columns: [col("b_id", "b")] },
      { name: "b", columns: [col("a_id", "a")] },
    ];
    assert.equal(orderBySubject(tables).length, 2);
  });
});

describe("columnDetail", () => {
  const col = (comment: string, type = "varchar(50)") => ({ name: "x", comment, type });

  it("mostra só o significado das opções", () => {
    assert.equal(
      columnDetail(col("Tipo de vínculo: permanent = efetivo, temporary = temporário, internship = estágio", "enum('a')")),
      "efetivo, temporário, estágio",
    );
    assert.equal(columnDetail(col("Situação: active = ativo, ended = encerrado", "enum('a')")), "ativo, encerrado");
  });
  it("mantém o exemplo e troca NULL por 'vazia'", () => {
    assert.equal(columnDetail(col("Sigla do setor, ex: TI, RH")), "ex: TI, RH");
    assert.equal(columnDetail(col("Data de encerramento; NULL enquanto o vínculo está ativo", "date")), "vazia enquanto o vínculo está ativo");
  });
  it("sem explicação, ou com código no meio, usa o tipo", () => {
    assert.equal(columnDetail(col("Nome do setor")), "texto");
    assert.equal(columnDetail(col("Carga horária semanal", "int")), "número");
    assert.equal(columnDetail(col("Motivo do encerramento (em português); preenchido só quando status = ended")), "texto");
  });
});

describe("subjectText", () => {
  it("passa o parêntese do título para a descrição", () => {
    assert.deepEqual(subjectText({ name: "employments", comment: "Vínculos de trabalho (contratos) de cada colaborador" }), {
      title: "Vínculos de trabalho",
      description: "Contratos de cada colaborador",
    });
  });
  it("sem parêntese, é igual a tableText", () => {
    assert.deepEqual(subjectText({ name: "employees", comment: "Colaboradores: pessoas que trabalham aqui" }), {
      title: "Colaboradores",
      description: "Pessoas que trabalham aqui",
    });
  });
});

describe("columnLabel", () => {
  it("troca o sublinhado por espaço e começa com maiúscula", () => {
    assert.equal(columnLabel("total_colaboradores"), "Total colaboradores");
    assert.equal(columnLabel("setor"), "Setor");
  });
});

describe("answerMeta", () => {
  it("uma tentativa: só o tempo", () => {
    assert.equal(answerMeta(2140, 1), "Respondido em 2,1 s.");
  });
  it("mais de uma tentativa: conta que o assistente se corrigiu", () => {
    assert.match(answerMeta(5400, 2), /^Respondido em 5,4 s, na 2ª tentativa/);
  });
});

describe("stepLabel", () => {
  it("nomeia as etapas em português", () => {
    assert.equal(stepLabel("checking"), "Conferindo se a busca é segura");
    assert.equal(stepLabel("writing"), "Escrevendo a busca (SQL)");
  });
  it("da 2ª tentativa em diante, diz que está corrigindo", () => {
    assert.equal(stepLabel("writing", 2), "Corrigindo a busca (tentativa 2)");
  });
});
