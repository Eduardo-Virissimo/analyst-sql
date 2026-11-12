export type Row = Record<string, unknown>;

export interface Attempt {
  attempt: number;
  sql: string | null;
  error: string | null;
}

export interface AgentResult {
  question: string;
  success: boolean;
  sql: string | null;
  rows: Row[];
  answer?: string;
  attempts: Attempt[];
  durationMs: number;
}

/** Em que etapa do trabalho o agente está. A tela mostra isso enquanto a resposta não chega. */
export type AgentStep = "writing" | "checking" | "running" | "explaining";

export interface AgentProgress {
  step: AgentStep;
  /** 1 na primeira busca; 2 ou 3 quando o agente está corrigindo a própria busca */
  attempt: number;
}

/** O que POST /api/ask envia, uma linha JSON por vez: o progresso e, no fim, o resultado ou um erro. */
export type AskEvent = { progress: AgentProgress } | { result: AgentResult } | { error: string };

/** Uma pergunta na tela: carregando, respondida ou com erro. */
export type Conversation =
  | { id: string; question: string; status: "loading"; progress?: AgentProgress }
  | { id: string; question: string; status: "done"; result: AgentResult }
  | { id: string; question: string; status: "error"; error: string };
