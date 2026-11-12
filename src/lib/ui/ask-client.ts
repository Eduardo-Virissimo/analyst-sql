// Cliente da API no navegador: envia a pergunta, acompanha o andamento e devolve o resultado.
// A API responde aos poucos, uma linha JSON por vez: { progress }, e no fim { result } ou { error }.
// Fica fora do componente para ser testado com um fetch falso.
import type { AgentProgress, AgentResult, AskEvent } from "@/lib/types";

export async function askAgent(
  question: string,
  fetcher: typeof fetch = fetch,
  onProgress?: (progress: AgentProgress) => void,
): Promise<AgentResult> {
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

  // lê linha por linha, conforme chegam
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let result: AgentResult | null = null;

  const handle = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line) as AskEvent;
    if ("progress" in event) onProgress?.(event.progress);
    if ("error" in event) throw new Error(event.error);
    if ("result" in event) result = event.result;
  };

  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    pending += decoder.decode(value, { stream: true });
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    lines.forEach(handle);
  }
  handle(pending);

  if (!result) throw new Error("A resposta chegou incompleta. Tente de novo.");
  return result;
}
