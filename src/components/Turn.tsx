// Uma troca: a pergunta do usuário (bolha) e a resposta do agente (texto puro, com a marca
// na lateral, como a assinatura de quem responde).
import { CheckIcon } from "./Icons";
import { LogoMark } from "./Logo";
import ResultPanel from "./ResultPanel";
import { STEPS, stepLabel } from "@/lib/ui/friendly";
import type { Conversation } from "@/lib/types";

interface TurnProps {
  id: string;
  conversation: Conversation;
  /** abre a lista do que dá para consultar (usada na dica quando o assistente não pode responder) */
  onOpenDatabase: () => void;
  /** pergunta de novo a mesma coisa (só aparece quando deu erro; ausente enquanto outra resposta está a caminho) */
  onRetry?: () => void;
}

export default function Turn({ id, conversation, onOpenDatabase, onRetry }: TurnProps) {
  const result = conversation.status === "done" ? conversation.result : null;

  return (
    // a última troca ocupa a altura da área de mensagens: assim a pergunta nova sobe para o topo e a resposta
    // aparece inteira embaixo dela, sem ficar escondida atrás do campo de pergunta
    <article id={id} className="fade-in scroll-mt-2 space-y-6 last:min-h-[calc(100dvh-20rem)]">
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-card rounded-br-control bg-surface-2 px-4 py-2 leading-7">
          {conversation.question}
        </p>
      </div>

      <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
        <div>
          <LogoMark size={32} />
        </div>

        <div className="min-w-0 space-y-4">
          {conversation.status === "loading" && (
            // as etapas do trabalho, ao vivo: as prontas ganham um visto, a atual pisca, as próximas ficam apagadas
            <ol className="space-y-2 pt-1 text-sm" role="status" aria-label="Andamento da resposta">
              {STEPS.map((step, i) => {
                const current = STEPS.indexOf(conversation.progress?.step ?? "writing");
                const state = i < current ? "done" : i === current ? "now" : "next";
                return (
                  <li
                    key={step}
                    aria-current={state === "now" ? "step" : undefined}
                    className={`flex items-center gap-2 ${state === "now" ? "text-ink" : "text-muted"} ${state === "next" ? "opacity-50" : ""}`}
                  >
                    <span className="inline-flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                      {state === "done" ? (
                        <CheckIcon className="size-4 text-ok" />
                      ) : (
                        <span className={`size-2 rounded-pill ${state === "now" ? "pulse-dot bg-brand" : "border border-line-strong"}`} />
                      )}
                    </span>
                    {stepLabel(step, state === "now" ? conversation.progress?.attempt : 1)}
                  </li>
                );
              })}
            </ol>
          )}

          {conversation.status === "error" && (
            <div className="space-y-2">
              <p className="text-lg leading-7 text-danger-ink">{conversation.error}</p>
              <p className="text-sm text-muted">Nada foi alterado nos dados.</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="press inline-flex min-h-10 items-center rounded-pill border border-line bg-surface px-4 text-sm text-ink hover:border-brand/50"
                >
                  Tentar de novo
                </button>
              )}
            </div>
          )}

          {result && (
            <p className="whitespace-pre-wrap text-lg leading-7">{result.answer}</p>
          )}

          {/* quando o assistente não pôde responder, ensina o que fazer em vez de deixar a pessoa sem rumo */}
          {result && !result.success && (
            <p className="text-sm leading-relaxed text-muted">
              Dica: eu só consigo responder o que está nos dados, e só consulto, sem alterar nada. Veja quais
              assuntos existem e tente perguntar de outro jeito.{" "}
              <button
                type="button"
                onClick={onOpenDatabase}
                className="press min-h-8 text-accent underline underline-offset-4 hover:text-ink"
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
