// As perguntas prontas, por assunto. Ficam aqui (e não no componente) para serem usadas em dois lugares:
// na janela "Perguntas prontas" e nas sugestões "Continue perguntando" depois de cada resposta.

export type AnswerKind = "Gráfico" | "Número" | "Tabela";

export interface Idea {
  question: string;
  kind: AnswerKind;
}

export interface IdeaGroup {
  topic: string;
  /** as tabelas do banco de que o assunto fala (servem para achar perguntas parecidas com a última busca) */
  tables: string[];
  ideas: Idea[];
}

export const IDEA_GROUPS: IdeaGroup[] = [
  {
    topic: "Pessoas e setores",
    tables: ["employees", "departments"],
    ideas: [
      { question: "Quantos colaboradores trabalham em cada setor?", kind: "Gráfico" },
      { question: "Quantos colaboradores existem no total?", kind: "Número" },
    ],
  },
  {
    topic: "Contratos",
    tables: ["employments"],
    ideas: [
      { question: "Quantos vínculos existem de cada tipo?", kind: "Gráfico" },
      { question: "Quantos vínculos começaram em cada ano?", kind: "Gráfico" },
      { question: "Quais são os nomes dos estagiários com vínculo ativo?", kind: "Tabela" },
    ],
  },
  {
    topic: "Saídas",
    tables: ["employments"],
    ideas: [
      { question: "Quais motivos de encerramento existem e quantas vezes cada um aparece?", kind: "Gráfico" },
      { question: "Qual o ano com mais encerramentos?", kind: "Tabela" },
    ],
  },
];

export const ALL_QUESTIONS = IDEA_GROUPS.flatMap((g) => g.ideas.map((i) => i.question));
