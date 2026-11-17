// O histórico de conversas da barra lateral, guardado só no navegador (localStorage).
// Funções puras: recebem e devolvem listas, sem tocar na tela. Quem lê e grava é o hook use-conversations.
import type { Conversation } from "@/lib/types";

/** Uma conversa da barra lateral: um título e as perguntas feitas nela. */
export interface Thread {
  id: string;
  title: string;
  updatedAt: number;
  turns: Conversation[];
}

export const STORAGE_KEY = "analyst-sql:conversas";
/** Quantas conversas ficam guardadas; as mais antigas saem primeiro. */
export const MAX_THREADS = 30;
const TITLE_LENGTH = 60;

/** O título da conversa é a primeira pergunta, encurtada. */
export function threadTitle(question: string): string {
  const clean = question.replace(/\s+/g, " ").trim();
  return clean.length > TITLE_LENGTH ? `${clean.slice(0, TITLE_LENGTH - 1).trimEnd()}…` : clean;
}

/** A mais recente primeiro. */
export function sortThreads(threads: Thread[]): Thread[] {
  return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * O que vai para o navegador: só perguntas já respondidas (ou com erro) e só as últimas MAX_THREADS conversas.
 * Uma resposta "a caminho" não é guardada: ao recarregar a página ela nunca chegaria.
 */
export function toStorable(threads: Thread[]): Thread[] {
  return sortThreads(threads)
    .map((t) => ({ ...t, turns: t.turns.filter((c) => c.status !== "loading") }))
    .filter((t) => t.turns.length > 0)
    .slice(0, MAX_THREADS);
}

/** Lê o texto guardado. Qualquer coisa estranha vira lista vazia, em vez de quebrar a tela. */
export function parseThreads(raw: string | null): Thread[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (t): t is Thread =>
        !!t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.updatedAt === "number" &&
        Array.isArray(t.turns),
    );
  } catch {
    return [];
  }
}

/** "Hoje", "Ontem" ou "Antes": os grupos da lista de conversas. */
export function threadGroup(updatedAt: number, now = Date.now()): "Hoje" | "Ontem" | "Antes" {
  const day = (ms: number) => {
    const d = new Date(ms);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };
  const diff = Math.round((day(now) - day(updatedAt)) / 86_400_000);
  return diff <= 0 ? "Hoje" : diff === 1 ? "Ontem" : "Antes";
}
