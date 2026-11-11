"use client";

// "Perguntas prontas": uma grade de blocos de tamanhos diferentes. Cada bloco mostra a pergunta e um
// mini desenho do tipo de resposta que ela traz (gráfico, tabela, número ou linha do tempo).
// Um toque envia a pergunta; "Me surpreenda" escolhe uma ao acaso.
import { ArrowUpRightIcon, ShuffleIcon, SparkIcon } from "./Icons";
import Modal from "./Modal";
import PanelButton from "./PanelButton";

type Kind = "bars" | "line" | "table" | "number";

const KIND_LABEL: Record<Kind, string> = {
  bars: "Gráfico de barras",
  line: "Linha do tempo",
  table: "Tabela",
  number: "Um número",
};

interface Idea {
  question: string;
  topic: string;
  kind: Kind;
  /** como o bloco ocupa a grade (6 colunas no computador) */
  layout: string;
}

const IDEAS: Idea[] = [
  { question: "Quantos colaboradores trabalham em cada setor?", topic: "Setores", kind: "bars", layout: "md:col-span-4 md:row-span-2" },
  { question: "Quantos colaboradores existem no total?", topic: "Pessoas", kind: "number", layout: "md:col-span-2" },
  { question: "Qual o ano com mais encerramentos?", topic: "Saídas", kind: "number", layout: "md:col-span-2" },
  { question: "Quantos vínculos existem de cada tipo?", topic: "Contratos", kind: "bars", layout: "md:col-span-3" },
  { question: "Quantos vínculos começaram em cada ano?", topic: "Entradas", kind: "line", layout: "md:col-span-3" },
  { question: "Quais são os nomes dos estagiários com vínculo ativo?", topic: "Contratos", kind: "table", layout: "md:col-span-3" },
  { question: "Quais motivos de encerramento existem e quantas vezes cada um aparece?", topic: "Saídas", kind: "table", layout: "md:col-span-3" },
];

// o mini desenho de cada tipo de resposta; `big` é o do bloco grande
function Sketch({ kind, big }: { kind: Kind; big: boolean }) {
  const h = big ? "h-40" : "h-14";
  if (kind === "bars") {
    const bars = big ? [38, 62, 24, 84, 50, 70] : [40, 70, 30, 85, 55];
    return (
      <div className={`flex ${h} items-end gap-2`} aria-hidden="true">
        {bars.map((v, i) => (
          <span
            key={i}
            style={{ height: `${v}%` }}
            className="w-full max-w-10 rounded-t-control bg-gradient-to-t from-brand-strong to-brand opacity-90"
          />
        ))}
      </div>
    );
  }
  if (kind === "line") {
    return (
      <svg viewBox="0 0 120 40" className={`${h} w-full`} fill="none" aria-hidden="true" preserveAspectRatio="none">
        <path d="M2 32 L22 24 L42 28 L62 14 L82 18 L118 5 V40 H2 Z" fill="url(#g-line)" opacity="0.5" />
        <path d="M2 32 L22 24 L42 28 L62 14 L82 18 L118 5" stroke="#B36BFF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <defs>
          <linearGradient id="g-line" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#6A2CFF" />
            <stop offset="1" stopColor="#6A2CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (kind === "table") {
    return (
      <div className="space-y-1.5" aria-hidden="true">
        <span className="block h-2 w-full rounded-pill bg-brand/60" />
        {[78, 92, 64].map((w, i) => (
          <span key={i} style={{ width: `${w}%` }} className="block h-2 rounded-pill bg-white/15" />
        ))}
      </div>
    );
  }
  return (
    <p className="font-serif text-4xl leading-none tracking-tight text-accent" aria-hidden="true">
      123
    </p>
  );
}

interface IdeasPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAsk: (question: string) => void;
  /** true enquanto uma resposta está a caminho */
  disabled: boolean;
}

export default function IdeasPanel({ open, onOpenChange, onAsk, disabled }: IdeasPanelProps) {
  function ask(question: string) {
    onOpenChange(false);
    onAsk(question);
  }

  function surprise() {
    ask(IDEAS[Math.floor(Math.random() * IDEAS.length)].question);
  }

  return (
    <>
      <PanelButton
        icon={SparkIcon}
        label="Perguntas prontas"
        open={open}
        controls="janela-perguntas"
        onClick={() => onOpenChange(!open)}
        labelOnMobile
      />

      <Modal
        id="janela-perguntas"
        open={open}
        onClose={() => onOpenChange(false)}
        size="lg"
        title="Perguntas prontas"
        intro="Escolha uma e veja a resposta na hora. O desenho mostra o tipo de resposta que você vai receber."
        action={
          <button
            type="button"
            disabled={disabled}
            onClick={surprise}
            className="press inline-flex min-h-10 items-center gap-2 rounded-pill bg-brand px-4 text-sm font-medium text-on-accent hover:brightness-110 disabled:opacity-50"
          >
            <ShuffleIcon className="size-4" />
            <span className="hidden sm:inline">Me surpreenda</span>
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-6">
          {IDEAS.map(({ question, topic, kind, layout }, index) => {
            const big = index === 0;
            return (
              <button
                key={question}
                type="button"
                disabled={disabled}
                onClick={() => ask(question)}
                className={`press group relative flex flex-col justify-between gap-5 overflow-hidden rounded-card border border-line bg-gradient-to-br from-brand-strong/30 via-white/[0.05] to-white/[0.02] p-5 text-left shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-brand/60 disabled:opacity-50 ${layout}`}
              >
                <div>
                  <p className="text-xs font-medium text-accent">{topic}</p>
                  <p className={`mt-2 text-balance font-serif leading-snug ${big ? "text-3xl" : "text-lg"}`}>{question}</p>
                </div>

                <div className="space-y-3">
                  <Sketch kind={kind} big={big} />
                  <p className="flex items-center justify-between text-xs text-muted">
                    {KIND_LABEL[kind]}
                    <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
