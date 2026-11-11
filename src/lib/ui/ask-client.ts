// Cliente da API no navegador: envia a pergunta e devolve o resultado.
// Fica fora do componente para ser testado com um fetch falso.
import type { AgentResult } from "@/lib/types";

export async function askAgent(question: string, fetcher: typeof fetch = fetch): Promise<AgentResult> {
  const response = await fetcher("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    // a API devolve { error: "mensagem" }; um proxy pode devolver outra coisa
    let message: unknown = null;
    try {
      message = ((await response.json()) as { error?: unknown }).error;
    } catch {
      // resposta que não é JSON
    }
    throw new Error(
      typeof message === "string" && message ? message : `O servidor respondeu com erro ${response.status}.`,
    );
  }

  return (await response.json()) as AgentResult;
}
