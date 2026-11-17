"use client";

// Tela inicial: o gato da marca (que segue o ponteiro com os olhos), uma saudação de acordo com a hora ("Boa tarde."), a pergunta-convite e o
// campo de pergunta (com exemplos que se revezam dentro dele). Embaixo, três cartões que já perguntam, cada um com
// uma miniatura do tipo de resposta que traz (gráfico, número, tabela), que se mexe quando o ponteiro passa.
import { useSyncExternalStore } from "react";
import Composer from "./Composer";
import { ArrowUpRightIcon, SparkIcon } from "./Icons";
import { LogoMark } from "./Logo";

const EXAMPLES = [
  { label: "Pessoas por setor", kind: "Gráfico", question: "Quantos colaboradores trabalham em cada setor?" },
  { label: "Total de pessoas", kind: "Número", question: "Quantos colaboradores existem no total?" },
  { label: "Estagiários ativos", kind: "Tabela", question: "Quais são os nomes dos estagiários com vínculo ativo?" },
] as const;

// as perguntas que se revezam dentro do campo vazio
const HINTS = [
  "Quantos vínculos começaram em cada ano?",
  "Qual o ano com mais encerramentos?",
  "Quantos vínculos existem de cada tipo?",
  "Quais motivos de encerramento mais aparecem?",
];

/** "Bom dia.", "Boa tarde." ou "Boa noite.", pela hora do computador de quem usa. */
function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bom dia.";
  if (hour >= 12 && hour < 18) return "Boa tarde.";
  return "Boa noite.";
}
function useGreeting(): string | null {
  // no servidor não se sabe a hora de quem usa: a linha fica reservada (invisível) e aparece já certa no navegador
  return useSyncExternalStore(
    () => () => {},
    () => greetingFor(new Date().getHours()),
    () => null,
  );
}

// as miniaturas são pequenas: animar altura e largura aqui é barato e não deforma os cantos (como faria o scale)
const bar =
  "rounded-control bg-brand/35 transition-[height,width,background-color] duration-500 ease-[var(--ease-out)] group-hover:bg-brand";

// miniaturas: só formas, sem números de verdade (os dados aparecem quando a pessoa pergunta)
function Preview({ kind }: { kind: (typeof EXAMPLES)[number]["kind"] }) {
  if (kind === "Gráfico") {
    return (
      <div className="flex h-full items-end gap-2 px-4 pb-2">
        {[40, 70, 30, 100, 55].map((h, i) => (
          <span
            key={i}
            className={`${bar} h-(--from) w-full group-hover:h-(--to)`}
            style={{ ["--from" as string]: `${h}%`, ["--to" as string]: `${[70, 40, 90, 60, 80][i]}%`, transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    );
  }
  if (kind === "Número") {
    // um contador de três algarismos: em repouso só traços (nenhum número que pareça dado); ao passar o ponteiro,
    // cada coluna rola até um algarismo diferente
    return (
      <div className="flex h-full items-center justify-center font-display text-5xl leading-12 text-ink">
        {[3, 7, 5].map((to, col) => (
          <span key={col} className="h-12 overflow-hidden">
            <span
              className="flex flex-col tabular-nums transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-y-(--roll)"
              style={{ ["--roll" as string]: `-${to * 3}rem`, transitionDelay: `${col * 80}ms` }}
            >
              {["–", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4">
      {[80, 55, 70].map((w, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-pill bg-brand/40" />
          <span
            className={`${bar} h-2 w-(--from) group-hover:w-(--to)`}
            style={{ ["--from" as string]: `${w}%`, ["--to" as string]: `${[55, 85, 70][i]}%`, transitionDelay: `${i * 60}ms` }}
          />
        </span>
      ))}
    </div>
  );
}

interface GreetingProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
  onMoreIdeas: () => void;
}

export default function Greeting({ onSubmit, disabled, onMoreIdeas }: GreetingProps) {
  const hello = useGreeting();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 pb-16 pt-8">
      <div className="enter">
        {/* o gato olha para onde o ponteiro está */}
        <div className="flex justify-center">
          <span className="rounded-[28%] shadow-[0_24px_48px_-16px_rgb(90_46_230/0.55)]">
            <LogoMark size={88} follow />
          </span>
        </div>

        <h1 className="mt-6 text-balance text-center font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          {hello ? (
            <span className="block text-accent">{hello}</span>
          ) : (
            <span className="invisible block" aria-hidden="true">
              Boa tarde.
            </span>
          )}
          <span className="block">O que você quer saber?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-center text-base leading-6 text-muted">
          Pergunte sobre os dados de RH em português, como falaria com um colega.
        </p>

        <div className="mt-8">
          <Composer onSubmit={onSubmit} disabled={disabled} autoFocus hints={HINTS} />
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-3 sm:gap-4" aria-label="Exemplos de pergunta">
          {EXAMPLES.map(({ label, kind, question }) => (
            <li key={label}>
              <button
                type="button"
                title={question}
                disabled={disabled}
                onClick={() => onSubmit(question)}
                className="press group flex w-full items-center gap-4 overflow-hidden rounded-card border border-line bg-surface/80 p-2 text-left shadow-card hover:border-brand/40 hover:bg-surface hover:shadow-[0_20px_40px_-20px_rgb(90_46_230/0.5)] disabled:opacity-50 sm:flex-col sm:items-stretch sm:gap-2"
              >
                <span className="hidden h-24 overflow-hidden rounded-control bg-sunken sm:block" aria-hidden="true">
                  <Preview kind={kind} />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2 px-2 py-1">
                  <span>
                    <span className="block text-sm font-medium text-ink">{label}</span>
                    <span className="block text-xs text-faint">{kind}</span>
                  </span>
                  <ArrowUpRightIcon className="size-4 shrink-0 text-accent opacity-40 transition-[opacity,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={onMoreIdeas}
            className="press inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-medium text-ink hover:bg-surface"
          >
            <SparkIcon className="size-4 text-accent" />
            Ver todas as perguntas prontas
          </button>
        </div>
      </div>
    </div>
  );
}
