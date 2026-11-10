import { validateSql } from "./sql-validator";

// cada caso: [consulta, deveria ser permitida?]
const cases: [string, boolean][] = [
  ["SELECT * FROM departments", true],
  ["select name from employees where job_title = 'Desenvolvedor';", true],
  ["WITH t AS (SELECT 1 AS x) SELECT x FROM t", true],
  ["SELECT * FROM employments WHERE end_reason = 'pedido de demissão'", true],
  ["SELECT 'DROP TABLE' AS text", true],
  ["SELECT * FROM employments WHERE start_date >= '2024-01-01'", true],
  ["DELETE FROM employees", false],
  ["DROP TABLE departments", false],
  ["SELECT * FROM departments; DROP TABLE departments", false],
  ["SELECT * FROM departments /* */; DELETE FROM departments", false],
  ["UPDATE employments SET status = 'active'", false],
  ["SELECT SLEEP(10)", false],
  ["SELECT * FROM information_schema.tables", false],
  ["SELECT * FROM mysql.user", false],
  ["SELECT * INTO OUTFILE '/tmp/x' FROM employees", false],
  ["", false],
  ["-- só um comentário", false],
];

// cada caso: [consulta, como ela deve ficar com o limite de linhas]
const limitCases: [string, string][] = [
  ["SELECT * FROM departments", "SELECT * FROM departments LIMIT 200"],
  [
    "SELECT * FROM departments ORDER BY name LIMIT 5",
    "SELECT * FROM departments ORDER BY name LIMIT 5",
  ],
  ["SELECT * FROM employees LIMIT 5000", "SELECT * FROM employees LIMIT 200"],
];

let failures = 0;

for (const [sql, expected] of limitCases) {
  const result = validateSql(sql);
  const safeSql = result.valid ? result.safeSql : null;
  const ok = safeSql === expected;
  if (!ok) failures++;
  console.log(`${ok ? "passou" : "nao passou"} limite: ${sql} -> ${safeSql}`);
}

for (const [sql, shouldPass] of cases) {
  const result = validateSql(sql);
  const ok = result.valid === shouldPass;
  if (!ok) failures++;
  const reason = result.valid ? "" : `-> ${result.reason}`;
  console.log(
    `${ok ? "passou" : "nao passou"} ${shouldPass ? "permitir" : "bloquear"}: ${sql || "(vazio)"}${reason}`,
  );
}

const total = cases.length + limitCases.length;
console.log(`\n${total - failures}/${total} testes passaram.`);
process.exit(failures ? 1 : 0);
