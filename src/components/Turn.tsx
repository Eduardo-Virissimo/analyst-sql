"use client";

// Uma troca: a pergunta do usuário (bolha à direita) e a resposta do agente (texto puro, com a marca na lateral).
// Enquanto o agente trabalha, a marca "mede" e as quatro etapas aparecem numa linha do tempo que se preenche,
// com um cronômetro. Quando a resposta chega nesta visita, ela aparece palavra por palavra e o cartão de dados se
// desdobra (respostas do histórico aparecem prontas). Embaixo: copiar, perguntar de novo e quanto tempo levou.
import { useEffect, useState } from "react";
import { ArrowRightIcon, CheckIcon, CopyIcon, RetryIcon, SparkIcon } from "./Icons";
import { LogoMark } from "./Logo";
import ResultPanel from "./ResultPanel";
import { explainSql } from "@/lib/ui/explain-sql";
import { STEPS, answerMeta, stepLabel } from "@/lib/ui/friendly";
import type { Conversation } from "@/lib/types";

interface TurnProps {
  id: string;
  conversation: Conversation;
  /** abre a lista do que dá para consultar (usada na dica quando o assistente não pode responder) */
  onOpenDatabase: () => void;
  /** pergunta de novo a mesma coisa (ausente enquanto outra resposta está a caminho) */
  onRetry?: () => void;
  /** perguntas para continuar a conversa (só na última resposta) */
  followUps?: string[];
  onAsk?: (question: string) => void;
}

const smallButton =
  "press inline-flex h-10 items-center gap-2 rounded-control px-2 text-xs text-muted hover:bg-surface hover:text-ink";

function Progress({ conversation }: { conversation: Extract<Conversation, { status: "loading" }> }) {
  const current = STEPS.indexOf(conversation.progress?.step ?? "writing");
  const [elapsed, setElapsed] = useState(0);

  // o cronômetro da etapa: conta desde que a pergunta saiu
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setElapsed(performance.now() - start), 100);
    return () => clearInterval(id);
  }, []);

  return (
    // as etapas do trabalho, ao vivo: a linha da esquerda se preenche de roxo até a etapa atual
    <ol className="relative space-y-2 pt-1 text-sm" role="status" aria-label="Andamento da resposta">
      <span aria-hidden="true" className="absolute bottom-3 left-2 top-4 w-px -translate-x-1/2 bg-line-strong" />
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-2 top-4 w-px origin-top -translate-x-1/2 bg-brand transition-transform duration-500 ease-[var(--ease-out)]"
        style={{ transform: `scaleY(${current / (STEPS.length - 1)})` }}
      />
      {STEPS.map((step, i) => {
        const state = i < current ? "done" : i === current ? "now" : "next";
        return (
          <li
            key={step}
            aria-current={state === "now" ? "step" : undefined}
            className={`relative flex h-6 items-center gap-4 ${state === "next" ? "text-faint" : "text-muted"}`}
          >
            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-pill bg-bg" aria-hidden="true">
              {state === "done" ? (
                <CheckIcon className="fade-in size-4 text-ok" />
              ) : (
                <span className={`size-2 rounded-pill ${state === "now" ? "bg-brand shadow-[0_0_0_4px_rgb(115_73_248/0.2)]" : "border border-line-strong bg-bg"}`} />
              )}
            </span>
            <span className={state === "now" ? "text-ink" : ""}>
              {stepLabel(step, state === "now" ? conversation.progress?.attempt : 1)}
            </span>
            {state === "now" && (
              <span className="ml-auto font-mono text-xs tabular-nums text-faint">
                {(elapsed / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// a resposta inteira leva no máximo 600 ms para aparecer, seja curta ou longa
const WORDS_SPAN = 600;
const wordStep = (words: number) => Math.min(24, WORDS_SPAN / Math.max(words, 1));

/** O texto da resposta. Se acabou de chegar, cada palavra aparece um pouco depois da anterior. */
function Answer({ text, animate }: { text: string; animate: boolean }) {
  if (!animate) return <p className="whitespace-pre-wrap pt-1 leading-7">{text}</p>;
  // separa em palavras, guardando os espaços e quebras de linha entre elas
  const parts = text.split(/(\s+)/);
  const step = wordStep(parts.length / 2);
  let index = 0;
  return (
    <p className="whitespace-pre-wrap pt-1 leading-7">
      {parts.map((part, i) => {
        if (!part || /^\s+$/.test(part)) return part;
        const delay = Math.round(index++ * step);
        return (
          <span key={i} className="word" style={{ animationDelay: `${delay}ms` }}>
            {part}
          </span>
        );
      })}
    </p>
  );
}

export default function Turn({ id, conversation, onOpenDatabase, onRetry, followUps = [], onAsk }: TurnProps) {
  const [copied, setCopied] = useState(false);
  const result = conversation.status === "done" ? conversation.result : null;
  // só anima a resposta que chegou com a tela aberta (não as que voltam do histórico)
  const [fresh] = useState(conversation.status === "loading");
  const wordCount = result?.answer ? result.answer.split(/\s+/).length : 0;
  // o cartão de dados começa a se desdobrar quando as palavras estão terminando (sobrepõe o fim)
  const cardDelay = fresh ? Math.round(wordCount * wordStep(wordCount) * 0.6) : 0;

  async function copyAnswer() {
    if (!result?.answer) return;
    try {
      await navigator.clipboard.writeText(result.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // navegador bloqueou a área de transferência: ignora
    }
  }

  return (
    // a última troca ocupa a altura da área de mensagens: assim a pergunta nova sobe para o topo e a resposta
    // aparece inteira embaixo dela, sem ficar escondida atrás do campo de pergunta
    <article id={id} className="scroll-mt-4 space-y-6 last:min-h-[calc(100dvh-18rem)]">
      <div className="fade-in flex justify-end">
        <p className="night max-w-[85%] whitespace-pre-wrap rounded-card rounded-br-control bg-bg px-4 py-2 leading-7 shadow-[0_12px_24px_-12px_rgb(20_10_40/0.5)]">
          {conversation.question}
        </p>
      </div>

      <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
        <div className="pt-1">
          <LogoMark size={32} working={conversation.status === "loading"} />
        </div>

        <div className="min-w-0 space-y-4">
          {conversation.status === "loading" && <Progress conversation={conversation} />}

          {conversation.status === "error" && (
            <div className="fade-in space-y-2 pt-1">
              <p className="leading-7 text-danger-ink">{conversation.error}</p>
              <p className="text-sm text-muted">Nada foi alterado nos dados.</p>
              {onRetry && (
                <button type="button" onClick={onRetry} className={`${smallButton} border border-line`}>
                  <RetryIcon className="size-4" />
                  Tentar de novo
                </button>
              )}
            </div>
          )}

          {result?.answer && <Answer text={result.answer} animate={fresh} />}

          {/* quando o assistente não pôde responder, ensina o que fazer em vez de deixar a pessoa sem rumo */}
          {result && !result.success && (
            <p className="fade-in text-sm leading-6 text-muted">
              Dica: eu só consigo responder o que está nos dados, e só consulto, sem alterar nada. Veja quais
              assuntos existem e tente perguntar de outro jeito.{" "}
              <button
                type="button"
                onClick={onOpenDatabase}
                className="press text-accent underline underline-offset-4 hover:text-ink"
              >
                Ver o que dá para consultar
              </button>
            </p>
          )}

          {result?.success && <ResultPanel result={result} delay={cardDelay} />}

          {/* "Como cheguei aqui": a busca traduzida em passos simples, para conferir sem ler SQL */}
          {result?.success && result.sql && (
            <ol
              aria-label="Como cheguei aqui"
              className="fade-in flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted"
              style={{ animationDelay: `${cardDelay + 200}ms` }}
            >
              <li className="font-semibold text-ink">Como cheguei aqui:</li>
              {explainSql(result.sql).map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {i > 0 && <ArrowRightIcon className="size-4 text-faint" aria-hidden="true" />}
                  {step}
                </li>
              ))}
            </ol>
          )}

          {result && (
            <div className="fade-in -ml-2 flex flex-wrap items-center gap-1" style={{ animationDelay: `${cardDelay + 300}ms` }}>
              {result.answer && (
                <button type="button" onClick={copyAnswer} className={smallButton} aria-label={copied ? "Resposta copiada" : "Copiar a resposta"}>
                  {copied ? <CheckIcon className="size-4 text-ok" /> : <CopyIcon className="size-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              )}
              {onRetry && (
                <button type="button" onClick={onRetry} className={smallButton}>
                  <RetryIcon className="size-4" />
                  Perguntar de novo
                </button>
              )}
              <span className="px-2 text-xs text-faint">{answerMeta(result.durationMs, result.attempts.length)}</span>
            </div>
          )}

          {/* "Continue perguntando": perguntas do mesmo assunto, para a conversa seguir com um toque */}
          {result && onAsk && followUps.length > 0 && (
            <section aria-label="Continue perguntando" className="fade-in space-y-2" style={{ animationDelay: `${cardDelay + 400}ms` }}>
              <h3 className="flex items-center gap-2 text-xs font-semibold text-muted">
                <SparkIcon className="size-4 text-accent" />
                Continue perguntando
              </h3>
              <ul className="flex flex-wrap gap-2">
                {followUps.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => onAsk(question)}
                      className="press min-h-10 rounded-pill border border-line bg-surface/80 px-4 py-2 text-left text-sm text-ink shadow-card hover:border-brand/40 hover:bg-surface"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
