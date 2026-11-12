"use client";

// "Perguntas prontas": um cartão por assunto, lado a lado, com as perguntas dentro. O ícone de cada linha mostra o tipo de
// resposta que a pergunta traz (gráfico, número ou tabela). Um toque envia; "Escolher uma por mim" sorteia.
import { ChartIcon, ContractIcon, ExitIcon, HashIcon, IconTile, ShuffleIcon, SparkIcon, TableIcon, UsersIcon } from "./Icons";
import Modal from "./Modal";
import PanelButton from "./PanelButton";
import QuestionRow from "./QuestionRow";

const KINDS = {
  Gráfico: ChartIcon,
  Número: HashIcon,
  Tabela: TableIcon,
};

const GROUPS: { topic: string; icon: typeof ChartIcon; ideas: { question: string; kind: keyof typeof KINDS }[] }[] = [
  {
    topic: "Pessoas e setores",
    icon: UsersIcon,
    ideas: [
      { question: "Quantos colaboradores trabalham em cada setor?", kind: "Gráfico" },
      { question: "Quantos colaboradores existem no total?", kind: "Número" },
    ],
  },
  {
    topic: "Contratos",
    icon: ContractIcon,
    ideas: [
      { question: "Quantos vínculos existem de cada tipo?", kind: "Gráfico" },
      { question: "Quantos vínculos começaram em cada ano?", kind: "Gráfico" },
      { question: "Quais são os nomes dos estagiários com vínculo ativo?", kind: "Tabela" },
    ],
  },
  {
    topic: "Saídas",
    icon: ExitIcon,
    ideas: [
      { question: "Quais motivos de encerramento existem e quantas vezes cada um aparece?", kind: "Gráfico" },
      { question: "Qual o ano com mais encerramentos?", kind: "Tabela" },
    ],
  },
];

const QUESTIONS = GROUPS.flatMap((group) => group.ideas.map((idea) => idea.question));

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
        intro="Escolha uma e veja a resposta na hora."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* a legenda dos ícones das linhas */}
            <ul className="flex flex-wrap items-center gap-4" aria-label="Tipos de resposta">
              {Object.entries(KINDS).map(([kind, icon]) => (
                <li key={kind} className="flex items-center gap-2">
                  <IconTile icon={icon} size="size-6" />
                  {kind}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={disabled}
              onClick={() => ask(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])}
              className="press inline-flex min-h-10 shrink-0 items-center gap-2 rounded-pill border border-line bg-surface px-4 text-sm text-ink hover:border-brand/50 disabled:opacity-50"
            >
              <ShuffleIcon className="size-4 text-accent" />
              Escolher uma por mim
            </button>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          {GROUPS.map(({ topic, icon, ideas }) => (
            <section key={topic} className="card overflow-hidden" aria-label={topic}>
              <header className="flex items-center gap-4 border-b border-line bg-white/[0.04] px-4 py-2">
                <IconTile icon={icon} tone="bg-brand-strong/40 text-accent" />
                <h3 className="flex-1 font-serif text-base">{topic}</h3>
                <span className="text-xs text-muted">
                  {ideas.length} {ideas.length === 1 ? "pergunta" : "perguntas"}
                </span>
              </header>
              <ul className="divide-y divide-line/60 px-2">
                {ideas.map(({ question, kind }) => (
                  <li key={question} className="py-1">
                    <QuestionRow question={question} icon={KINDS[kind]} onAsk={ask} disabled={disabled} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}
