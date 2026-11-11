// Converte um erro do agente na resposta que o navegador recebe.
// Nunca devolve o texto técnico do erro: ele fica só no terminal.
import { AgentError } from "@/lib/agent/errors";

export interface ApiError {
  message: string;
  status: number;
}

export function describeError(err: unknown): ApiError {
  if (err instanceof AgentError) {
    return err.kind === "db"
      ? { message: "O banco de dados está indisponível no momento.", status: 503 }
      : {
          message: "O serviço de IA está indisponível. Tente de novo em instantes.",
          status: 502,
        };
  }
  return { message: "Erro interno ao processar a pergunta.", status: 500 };
}
