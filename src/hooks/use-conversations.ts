"use client";

import { useCallback, useState } from "react";
import { askAgent } from "@/lib/ui/ask-client";
import type { Conversation } from "@/lib/types";

// Estado da conversa. Cada pergunta entra no fim da lista como "loading" e,
// quando a resposta chega, vira "done" (ou "error" se algo falhar).
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const isLoading = conversations.some((c) => c.status === "loading");

  const ask = useCallback(async (question: string) => {
    const id = crypto.randomUUID();
    setConversations((list) => [...list, { id, question, status: "loading" }]);

    // troca só a conversa que acabou de ser respondida
    const replace = (next: Conversation) =>
      setConversations((list) => list.map((c) => (c.id === id ? next : c)));

    try {
      const result = await askAgent(question);
      replace({ id, question, status: "done", result });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Erro desconhecido.";
      replace({ id, question, status: "error", error });
    }
  }, []);

  const clear = useCallback(() => setConversations([]), []);

  return { conversations, isLoading, ask, clear };
}
