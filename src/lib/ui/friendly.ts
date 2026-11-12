// Traduz o jeito técnico do banco para o jeito de falar de quem não é da área.
// Só apresentação: nada aqui muda os dados nem o que o agente faz.
import type { SchemaColumn, SchemaTable } from "@/lib/db/schema";
import type { AgentStep } from "@/lib/types";

/** int -> "número", varchar -> "texto", date -> "data"... */
export function friendlyType(type: string): string {
  const base = type.replace(/\(.*$/, "").toLowerCase().trim();
  if (/^(tinyint|bool)/.test(base) && /\(1\)/.test(type)) return "sim ou não";
  if (/^(tiny|small|medium|big)?int|^decimal|^numeric|^float|^double/.test(base)) return "número";
  if (/^(var)?char|text$|^text/.test(base)) return "texto";
  if (base === "date") return "data";
  if (/^(datetime|timestamp)/.test(base)) return "data e hora";
  if (base === "time") return "hora";
  if (base === "enum" || base === "set") return "uma opção";
  return "dado";
}

/**
 * "Colaboradores: pessoas que trabalham..." -> título "Colaboradores" + descrição.
 * Sem dois-pontos, o comentário inteiro é o título. Sem comentário, usa o nome da tabela.
 */
export function tableText(table: Pick<SchemaTable, "name" | "comment">): { title: string; description: string } {
  const comment = table.comment.trim();
  if (!comment) return { title: table.name, description: "" };
  const colon = comment.indexOf(":");
  if (colon < 0) return { title: comment, description: "" };
  const description = comment.slice(colon + 1).trim();
  return {
    title: comment.slice(0, colon).trim(),
    description: description.charAt(0).toUpperCase() + description.slice(1),
  };
}

/** O que mostrar de uma coluna: a descrição (em português) quando existe; senão, o nome. */
export function columnText(column: Pick<SchemaColumn, "name" | "comment">): string {
  const comment = column.comment.trim();
  if (!comment) return column.name;
  // "Tipo de vínculo: permanent = efetivo, ..." -> o início explica; o resto são os valores possíveis
  return comment;
}

/** Nome amigável do banco no cabeçalho. Bancos desconhecidos mostram o próprio nome, sem sublinhado. */
const DATABASE_LABELS: Record<string, string> = {
  hr_agent: "Dados de RH",
};

export function databaseLabel(name: string): string {
  return DATABASE_LABELS[name] ?? (name.replaceAll("_", " ") || "Dados");
}

/** "1 assunto", "3 assuntos": cada tabela do banco é um assunto sobre o qual dá para perguntar. */
export function subjectsLabel(count: number): string {
  return `${count} ${count === 1 ? "assunto" : "assuntos"}`;
}

/** "1 informação", "8 informações": cada coluna é uma informação guardada sobre o assunto. */
export function fieldsLabel(count: number): string {
  return `${count} ${count === 1 ? "informação" : "informações"}`;
}

/**
 * O nome curto de uma informação, para etiquetas: "Tipo de vínculo: permanent = efetivo..." -> "Tipo de vínculo",
 * "Sigla do setor, ex: TI, RH" -> "Sigla do setor". Sem comentário, usa o nome da coluna.
 */
export function shortColumnText(column: Pick<SchemaColumn, "name" | "comment">): string {
  // sem comentário, o nome da coluna vira texto legível: "job_title" -> "Job title"
  if (!column.comment.trim()) {
    const plain = column.name.replaceAll("_", " ");
    return plain.charAt(0).toUpperCase() + plain.slice(1);
  }
  const text = columnText(column);
  return text.split(/[:;,(]/)[0].trim() || text;
}

/**
 * Título curto de um assunto e sua descrição. Se o título traz um parêntese, ele vira a descrição:
 * "Vínculos de trabalho (contratos) de cada colaborador" -> "Vínculos de trabalho" + "Contratos de cada colaborador".
 */
export function subjectText(table: Pick<SchemaTable, "name" | "comment">): { title: string; description: string } {
  const { title, description } = tableText(table);
  const paren = title.match(/^(.*?)\s*\(([^)]*)\)\s*(.*)$/);
  if (!paren) return { title, description };
  const detail = `${paren[2]} ${paren[3]}`.trim();
  return {
    title: paren[1],
    description: description || detail.charAt(0).toUpperCase() + detail.slice(1),
  };
}

/**
 * Põe primeiro os assuntos que os outros usam: "Setores" antes de "Colaboradores" (que pertencem a um setor),
 * antes de "Vínculos" (que pertencem a um colaborador). Assim a tela conta a história na ordem certa.
 */
export function orderBySubject<T extends Pick<SchemaTable, "name" | "columns">>(tables: T[]): T[] {
  const ordered: T[] = [];
  const placed = new Set<string>();
  let remaining = [...tables];

  while (remaining.length > 0) {
    // quem só depende de assuntos já colocados (ou de si mesmo) pode entrar
    const ready = remaining.filter((t) =>
      t.columns.every((c) => !c.references || c.references.table === t.name || placed.has(c.references.table)),
    );
    // se houver um ciclo, segue na ordem original em vez de travar
    const next = ready.length > 0 ? ready : [remaining[0]];
    for (const t of next) {
      ordered.push(t);
      placed.add(t.name);
    }
    remaining = remaining.filter((t) => !placed.has(t.name));
  }
  return ordered;
}

/**
 * O que explicar ao lado do nome de uma informação, em português:
 *  "Tipo de vínculo: permanent = efetivo, temporary = temporário" -> "efetivo, temporário" (as opções)
 *  "Sigla do setor, ex: TI, RH"                                  -> "ex: TI, RH"
 *  "Data de encerramento; NULL enquanto o vínculo está ativo"    -> "vazia enquanto o vínculo está ativo"
 *  sem explicação (ou com código no meio): o tipo ("texto", "data", "número"...).
 */
export function columnDetail(column: Pick<SchemaColumn, "name" | "comment" | "type">): string {
  const rest = columnText(column).match(/^[^:;,]*[:;,]\s*([\s\S]*)$/)?.[1].trim() ?? "";
  const asType = friendlyType(column.type);
  if (!rest) return asType;

  // lista de opções "codigo = significado, codigo = significado": só o significado interessa
  const parts = rest.split(",").map((p) => p.trim());
  if (parts.every((p) => /^\w+ = .+$/.test(p))) return parts.map((p) => p.split(" = ")[1]).join(", ");

  // com "=" ou nomes de coluna no meio da frase, o tipo explica melhor que o texto técnico
  if (/[=_]/.test(rest)) return asType;
  return rest.replace(/\bNULL\b/g, "vazia");
}

/** O nome de uma coluna do resultado, legível: "total_colaboradores" -> "Total colaboradores". */
export function columnLabel(name: string): string {
  const plain = name.replaceAll("_", " ").trim();
  return plain.charAt(0).toUpperCase() + plain.slice(1);
}

/**
 * A linha discreta sob o resultado: quanto tempo levou e, se a primeira busca falhou, que o assistente
 * corrigiu a si mesmo. "Respondido em 2,1 s" ou "Respondido em 5,4 s, na 2ª tentativa (...)".
 */
export function answerMeta(durationMs: number, attempts: number): string {
  const seconds = (durationMs / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const base = `Respondido em ${seconds} s`;
  if (attempts <= 1) return `${base}.`;
  return `${base}, na ${attempts}ª tentativa: a primeira busca falhou e o assistente corrigiu sozinho.`;
}

/** As etapas do trabalho do agente, na ordem em que acontecem. */
export const STEPS: AgentStep[] = ["writing", "checking", "running", "explaining"];

/** O nome de cada etapa, em português simples. Da 2ª tentativa em diante, conta que a busca está sendo corrigida. */
export function stepLabel(step: AgentStep, attempt = 1): string {
  const labels: Record<AgentStep, string> = {
    writing: attempt > 1 ? `Corrigindo a busca (tentativa ${attempt})` : "Escrevendo a busca (SQL)",
    checking: "Conferindo se a busca é segura",
    running: "Consultando os dados, sem alterar nada",
    explaining: "Escrevendo a resposta",
  };
  return labels[step];
}
