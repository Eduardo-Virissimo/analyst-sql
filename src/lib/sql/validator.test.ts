import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_ROWS, validateSql } from "@/lib/sql/validator";

const TABLES = ["departments", "employees", "employments"];

function allowed(sql: string, tables: readonly string[] = TABLES) {
  const result = validateSql(sql, { allowedTables: tables });
  assert.equal(result.valid, true, `deveria permitir: ${sql} -> ${result.valid ? "" : result.reason}`);
  return result.valid ? result.safeSql : "";
}

function blocked(sql: string, reason?: RegExp) {
  const result = validateSql(sql, { allowedTables: TABLES });
  assert.equal(result.valid, false, `deveria bloquear: ${sql}`);
  if (!result.valid && reason) assert.match(result.reason, reason);
}

describe("consultas legítimas", () => {
  const legit = [
    "SELECT * FROM departments",
    "select name from employees where job_title = 'Desenvolvedor';",
    "WITH t AS (SELECT 1 AS x) SELECT x FROM t",
    "SELECT * FROM employments WHERE end_reason = 'pedido de demissão'",
    "SELECT 'DROP TABLE' AS texto",
    "SELECT * FROM employments WHERE start_date >= '2024-01-01'",
    "SELECT YEAR(end_date) AS ano, COUNT(*) AS total FROM employments GROUP BY YEAR(end_date)",
    "SELECT EXTRACT(YEAR FROM start_date) AS ano FROM employments",
    "SELECT d.code AS setor, COUNT(e.id) AS total FROM departments d LEFT JOIN employees e ON e.department_id = d.id GROUP BY d.id, d.code",
    "SELECT `name` FROM `employees`",
    "SELECT 'a--b' AS texto FROM departments",
    "SELECT 'item #1' AS texto FROM departments",
    "SELECT * FROM employees WHERE name = 'O''Brien'",
    "SELECT d.code FROM departments d WHERE d.id NOT IN (SELECT e.department_id FROM employees e)",
    "WITH a AS (SELECT 1 AS x), b AS (SELECT 2 AS y) SELECT x, y FROM a, b",
  ];
  for (const sql of legit) {
    it(`permite: ${sql.slice(0, 70)}`, () => {
      allowed(sql);
    });
  }

  it("remove comentários do SQL que será executado", () => {
    const safe = allowed("SELECT 1 FROM departments /* oi */ -- fim");
    assert.equal(safe.includes("/*"), false);
    assert.equal(safe.includes("--"), false);
  });

  it("não confunde -- dentro de texto com comentário", () => {
    assert.match(allowed("SELECT 'a--b' AS t FROM departments"), /'a--b'/);
  });
});

describe("comandos de escrita e administração", () => {
  const writes = [
    "DELETE FROM employees",
    "DROP TABLE departments",
    "UPDATE employments SET status = 'active'",
    "INSERT INTO departments VALUES (9, 'x', 'y')",
    "TRUNCATE employees",
    "ALTER TABLE employees ADD x INT",
    "CREATE TABLE t (id INT)",
    "REPLACE INTO departments VALUES (1,'a','b')",
    "GRANT ALL ON *.* TO 'a'@'%'",
    "SET GLOBAL max_connections = 1",
    "CALL algum_procedimento()",
    "SHOW TABLES",
    "DESCRIBE employees",
    "WITH x AS (SELECT 1) DELETE FROM employees",
    "SELECT 1 INTO OUTFILE '/tmp/x'",
    "SELECT * INTO DUMPFILE '/tmp/x' FROM employees",
    "SELECT name INTO @v FROM employees",
  ];
  for (const sql of writes) {
    it(`bloqueia: ${sql}`, () => blocked(sql));
  }
});

describe("múltiplos comandos e comentários", () => {
  it("bloqueia segundo comando", () => blocked("SELECT * FROM departments; DROP TABLE departments", /mais de um/i));
  it("bloqueia segundo comando após comentário", () => blocked("SELECT * FROM departments /* */; DELETE FROM departments"));
  it("bloqueia comando escondido em comentário executável /*! */", () =>
    blocked("SELECT 1 /*! ; DROP TABLE employees */", /executável/i));
  it("bloqueia /*!50000 ... */", () => blocked("SELECT /*!50000 SLEEP(5) */ 1"));
  it("bloqueia comentário sem fechar", () => blocked("SELECT 1 /* sem fim"));
  it("bloqueia texto sem fechar", () => blocked("SELECT 'sem fim FROM departments"));
  it("permite ; no fim", () => {
    allowed("SELECT 1 FROM departments;");
  });
  it("bloqueia vazio", () => blocked(""));
  it("bloqueia só comentário", () => blocked("-- só um comentário"));
  it("bloqueia nulo", () => assert.equal(validateSql(null).valid, false));
  it("bloqueia ; dentro de crases usadas como disfarce", () =>
    blocked("SELECT 1 FROM departments; SELECT 2"));
});

describe("esquemas internos e tabelas fora da lista", () => {
  const internals = [
    "SELECT * FROM information_schema.tables",
    "SELECT * FROM mysql.user",
    "SELECT * FROM `mysql`.`user`",
    "SELECT * FROM `information_schema`.`columns`",
    "SELECT * FROM MySQL . user",
    "SELECT * FROM performance_schema.threads",
    "SELECT * FROM sys.session",
  ];
  for (const sql of internals) {
    it(`bloqueia: ${sql}`, () => blocked(sql));
  }

  it("bloqueia tabela inexistente na lista", () =>
    blocked("SELECT * FROM users", /Tabela não permitida: users/));
  it("bloqueia tabela fora da lista em JOIN", () =>
    blocked("SELECT * FROM employees e JOIN secrets s ON s.id = e.id", /secrets/));
  it("bloqueia prefixo de banco", () =>
    blocked("SELECT * FROM hr_agent.employees", /sem prefixo/));
  it("aceita CTE como tabela", () => {
    allowed("WITH ativos AS (SELECT * FROM employments WHERE status = 'active') SELECT COUNT(*) FROM ativos");
  });
  it("sem lista de tabelas, não confere tabelas", () => {
    assert.equal(validateSql("SELECT * FROM qualquer").valid, true);
  });
});

describe("funções e variáveis perigosas", () => {
  const dangerous = [
    "SELECT SLEEP(10)",
    "SELECT BENCHMARK(1000000, MD5('a'))",
    "SELECT LOAD_FILE('/etc/passwd')",
    "SELECT GET_LOCK('x', 100)",
    "SELECT VERSION()",
    "SELECT USER()",
    "SELECT CURRENT_USER()",
    "SELECT DATABASE()",
    "SELECT @@version",
    "SELECT @@global.max_connections",
    "SELECT @x := 1",
    "SELECT * FROM employees FOR UPDATE",
    "SELECT * FROM employees LOCK IN SHARE MODE",
    "SELECT * FROM employees FOR SHARE",
  ];
  for (const sql of dangerous) {
    it(`bloqueia: ${sql}`, () => blocked(sql));
  }

  it("não bloqueia coluna chamada user_id nem texto 'sleep'", () => {
    allowed("SELECT 'sleep' AS t FROM departments");
  });
});

describe("limite de linhas", () => {
  const cases: [string, string][] = [
    ["SELECT * FROM departments", `SELECT * FROM departments LIMIT ${MAX_ROWS}`],
    ["SELECT * FROM departments ORDER BY name LIMIT 5", "SELECT * FROM departments ORDER BY name LIMIT 5"],
    ["SELECT * FROM employees LIMIT 5000", `SELECT * FROM employees LIMIT ${MAX_ROWS}`],
    ["SELECT * FROM employees LIMIT 10, 5000", `SELECT * FROM employees LIMIT 10, ${MAX_ROWS}`],
    ["SELECT * FROM employees LIMIT 10, 5", "SELECT * FROM employees LIMIT 10, 5"],
    ["SELECT * FROM employees LIMIT 5000 OFFSET 20", `SELECT * FROM employees LIMIT ${MAX_ROWS} OFFSET 20`],
    ["SELECT * FROM employees LIMIT 5 OFFSET 20", "SELECT * FROM employees LIMIT 5 OFFSET 20"],
    ["SELECT * FROM employees LIMIT 99999999999999999999", `SELECT * FROM employees LIMIT ${MAX_ROWS}`],
    ["SELECT * FROM (SELECT * FROM employees LIMIT 5) t", `SELECT * FROM (SELECT * FROM employees LIMIT 5) t LIMIT ${MAX_ROWS}`],
  ];
  for (const [input, expected] of cases) {
    it(`${input} -> ${expected.slice(-30)}`, () => {
      assert.equal(allowed(input), expected);
    });
  }
});
