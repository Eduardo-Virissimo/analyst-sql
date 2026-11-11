// Uma troca: a pergunta do usuário (bolha) e a resposta do agente (texto puro, com a marca
// na lateral, como a assinatura de quem responde).
import { LogoMark } from "./Logo";
import ResultPanel from "./ResultPanel";
import type { Conversation } from "@/lib/types";

interface TurnProps {
  id: string;
  conversation: Conversation;
  /** abre a lista do que dá para consultar (usada na dica quando o assistente não pode responder) */
  onOpenDatabase: () => void;
}

export default function Turn({ id, conversation, onOpenDatabase }: TurnProps) {
  const result = conversation.status === "done" ? conversation.result : null;

  return (
    <article id={id} className="fade-in scroll-mt-2 space-y-6">
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-sheet rounded-br-control bg-surface-2 px-5 py-3 leading-7">
          {conversation.question}
        </p>
      </div>

      <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3.5">
        <div className="pt-0.5">
          <LogoMark size={26} />
        </div>

        <div className="min-w-0 space-y-4">
          {conversation.status === "loading" && (
            <p className="flex items-center gap-2.5 text-sm text-muted" role="status">
              <span className="pulse-dot size-2 rounded-pill bg-brand" aria-hidden="true" />
              Procurando a resposta nos dados…
            </p>
          )}

          {conversation.status === "error" && (
            <div className="space-y-1">
              <p className="text-[1.0625rem] leading-7 text-danger-ink">{conversation.error}</p>
              <p className="text-sm text-muted">Nada foi alterado. Você pode tentar de novo.</p>
            </div>
          )}

          {result && (
            <p className="whitespace-pre-wrap text-[1.0625rem] leading-7">{result.answer}</p>
          )}

          {/* quando o assistente não pôde responder, ensina o que fazer em vez de deixar a pessoa sem rumo */}
          {result && !result.success && (
            <p className="text-sm leading-relaxed text-muted">
              Dica: eu só consigo responder o que está nos dados, e só consulto, sem alterar nada. Veja quais
              assuntos existem e tente perguntar de outro jeito.{" "}
              <button
                type="button"
                onClick={onOpenDatabase}
                className="press min-h-8 text-accent underline-offset-2 hover:underline"
              >
                Ver o que dá para consultar
              </button>
            </p>
          )}

          {result?.success && <ResultPanel result={result} />}
        </div>
      </div>
    </article>
  );
}
