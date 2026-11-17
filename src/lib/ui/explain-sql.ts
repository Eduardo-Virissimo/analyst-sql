// Traduz a busca (SQL) em passos de português simples, para quem não lê SQL entender como a resposta foi achada:
// "Olhou colaboradores e setores", "Contou", "Separou em grupos", "Ordenou do maior para o menor".
// Só lê o texto da busca para explicar; não muda nada nem é usado para executar.
import { IDEA_GROUPS } from "./ideas";

// o nome de cada tabela do banco de exemplo, como a pessoa fala
const TABLE_NAMES: Record<string, string> = {
  departments: "setores",
  employees: "colaboradores",
  employments: "vínculos",
};

/** "a", "a e b", "a, b e c" */
function listPt(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** As tabelas que a busca usa (depois de FROM e JOIN), na ordem em que aparecem, sem repetir. */
export function sqlTables(sql: string): string[] {
  const found = [...sql.matchAll(/\b(?:from|join)\s+[`"]?(\w+)[`"]?/gi)].map((m) => m[1].toLowerCase());
  return [...new Set(found)];
}

/** Os passos da busca, em português simples. */
export function explainSql(sql: string): string[] {
  const text = sql.replace(/\s+/g, " ");
  const steps: string[] = [];

  const tables = sqlTables(text).map((t) => TABLE_NAMES[t] ?? t.replaceAll("_", " "));
  if (tables.length) steps.push(`Olhou ${listPt(tables)}`);
  if (/\bwhere\b/i.test(text)) steps.push("Filtrou só o que a pergunta pede");
  if (/\bdistinct\b/i.test(text)) steps.push("Tirou as repetições");
  if (/\bcount\s*\(/i.test(text)) steps.push("Contou");
  if (/\bsum\s*\(/i.test(text)) steps.push("Somou");
  if (/\bavg\s*\(/i.test(text)) steps.push("Calculou a média");
  if (/\bmax\s*\(/i.test(text)) steps.push("Achou o maior valor");
  if (/\bmin\s*\(/i.test(text)) steps.push("Achou o menor valor");

  const group = text.match(/\bgroup by (.+?)(?=\bhaving\b|\border by\b|\blimit\b|$)/i);
  if (group) steps.push(/\byear\s*\(/i.test(group[1]) ? "Separou por ano" : "Separou em grupos");

  const order = text.match(/\border by (.+?)(?=\blimit\b|$)/i);
  if (order) steps.push(/\bdesc\b/i.test(order[1]) ? "Ordenou do maior para o menor" : "Ordenou do menor para o maior");

  return steps;
}

/**
 * Até `max` perguntas prontas para continuar a conversa: primeiro as do mesmo assunto da última busca, depois as
 * outras. Nunca repete uma pergunta já feita nesta conversa.
 */
export function relatedQuestions(sql: string | null, asked: string[], max = 3): string[] {
  const used = new Set(asked.map((q) => q.trim().toLowerCase()));
  const tables = new Set(sql ? sqlTables(sql) : []);
  const near = IDEA_GROUPS.filter((g) => g.tables.some((t) => tables.has(t)));
  const far = IDEA_GROUPS.filter((g) => !near.includes(g));
  return [...near, ...far]
    .flatMap((g) => g.ideas.map((i) => i.question))
    .filter((q) => !used.has(q.toLowerCase()))
    .slice(0, max);
}
