"use client";

import { useCallback, useEffect, useState } from "react";
import { askAgent } from "@/lib/ui/ask-client";
import { STORAGE_KEY, parseThreads, sortThreads, threadTitle, toStorable, type Thread } from "@/lib/ui/history";
import type { Conversation } from "@/lib/types";

// As conversas da barra lateral e a conversa aberta. Cada pergunta entra no fim da conversa aberta como
// "loading" e, quando a resposta chega, vira "done" (ou "error"). Tudo fica guardado no navegador.
export function useConversations() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // lê o histórico depois de a página abrir (no servidor não existe localStorage)
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do navegador, depois da hidratação
      setThreads(parseThreads(localStorage.getItem(STORAGE_KEY)));
    } catch {
      // navegador sem acesso ao armazenamento (janela anônima, bloqueio): segue sem histórico
    }
    setLoaded(true);
  }, []);

  // grava a cada mudança
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStorable(threads)));
    } catch {
      // armazenamento cheio ou bloqueado: o histórico só não fica salvo
    }
  }, [threads, loaded]);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const turns = active?.turns ?? [];
  const isLoading = threads.some((t) => t.turns.some((c) => c.status === "loading"));

  const ask = useCallback(
    async (question: string) => {
      const turnId = crypto.randomUUID();
      const threadId = activeId ?? crypto.randomUUID();
      const loading: Conversation = { id: turnId, question, status: "loading" };

      setThreads((list) => {
        const exists = list.some((t) => t.id === threadId);
        if (!exists) {
          return [{ id: threadId, title: threadTitle(question), updatedAt: Date.now(), turns: [loading] }, ...list];
        }
        return list.map((t) =>
          t.id === threadId ? { ...t, updatedAt: Date.now(), turns: [...t.turns, loading] } : t,
        );
      });
      setActiveId(threadId);

      // troca só a pergunta que acabou de ser respondida, na conversa certa (mesmo que outra esteja aberta)
      const replace = (next: Conversation) =>
        setThreads((list) =>
          list.map((t) =>
            t.id === threadId ? { ...t, turns: t.turns.map((c) => (c.id === turnId ? next : c)) } : t,
          ),
        );

      try {
        const result = await askAgent(question, fetch, (progress) =>
          replace({ id: turnId, question, status: "loading", progress }),
        );
        replace({ id: turnId, question, status: "done", result });
      } catch (err) {
        const error = err instanceof Error ? err.message : "Erro desconhecido.";
        replace({ id: turnId, question, status: "error", error });
      }
    },
    [activeId],
  );

  const newThread = useCallback(() => setActiveId(null), []);
  const selectThread = useCallback((id: string) => setActiveId(id), []);
  const deleteThread = useCallback(
    (id: string) => {
      setThreads((list) => list.filter((t) => t.id !== id));
      if (id === activeId) setActiveId(null);
    },
    [activeId],
  );

  return {
    threads: sortThreads(threads),
    active,
    turns,
    isLoading,
    ask,
    newThread,
    selectThread,
    deleteThread,
  };
}
