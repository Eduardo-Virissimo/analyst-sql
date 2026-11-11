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

/** Uma pergunta na tela: carregando, respondida ou com erro. */
export type Conversation =
  | { id: string; question: string; status: "loading" }
  | { id: string; question: string; status: "done"; result: AgentResult }
  | { id: string; question: string; status: "error"; error: string };
