"use client";

// "Perguntas prontas": um cartão por assunto, lado a lado, com as perguntas dentro. O ícone de cada linha mostra o tipo de
// resposta que a pergunta traz (gráfico, número ou tabela). Um toque envia; "Escolher uma por mim" sorteia.
import { ChartIcon, ContractIcon, ExitIcon, HashIcon, ShuffleIcon, TableIcon, UsersIcon } from "./Icons";
import Modal from "./Modal";
import QuestionRow from "./QuestionRow";
import { ALL_QUESTIONS, IDEA_GROUPS } from "@/lib/ui/ideas";

export const KINDS = {
  Gráfico: ChartIcon,
  Número: HashIcon,
  Tabela: TableIcon,
};

// o ícone de cada assunto (as perguntas ficam em lib/ui/ideas.ts)
const TOPIC_ICONS: Record<string, typeof ChartIcon> = {
  "Pessoas e setores": UsersIcon,
  Contratos: ContractIcon,
  Saídas: ExitIcon,
};

const GROUPS = IDEA_GROUPS.map((group) => ({ ...group, icon: TOPIC_ICONS[group.topic] ?? ChartIcon }));
const QUESTIONS = ALL_QUESTIONS;

interface IdeasPanelProps {
  open: boolean;
  onClose: () => void;
  onAsk: (question: string) => void;
  /** true enquanto uma resposta está a caminho */
  disabled: boolean;
}

export default function IdeasPanel({ open, onClose, onAsk, disabled }: IdeasPanelProps) {
  function ask(question: string) {
    onClose();
    onAsk(question);
  }

  return (
      <Modal
        id="janela-perguntas"
        open={open}
        onClose={onClose}
        size="lg"
        title="Perguntas prontas"
        intro="Escolha uma e veja a resposta na hora."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* a legenda dos ícones das linhas */}
            <ul className="flex flex-wrap items-center gap-4" aria-label="Tipos de resposta">
              {Object.entries(KINDS).map(([kind, Icon]) => (
                <li key={kind} className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" />
                  {kind}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={disabled}
              onClick={() => ask(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])}
              className="btn-brand press inline-flex min-h-10 shrink-0 items-center gap-2 rounded-pill px-4 text-sm font-semibold disabled:opacity-50"
            >
              <ShuffleIcon className="size-4" />
              Escolher uma por mim
            </button>
          </div>
        }
      >
        {/* três assuntos lado a lado, separados por fios; dentro, as perguntas separadas por fios */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line">
          {GROUPS.map(({ topic, icon: Icon, ideas }) => (
            <section key={topic} aria-label={topic} className="lg:px-4 lg:first:pl-0 lg:last:pr-0">
              <h3 className="flex items-center gap-2 pb-2 font-display text-lg">
                <Icon className="size-5 text-muted" />
                {topic}
              </h3>
              <ul className="divide-y divide-line border-t border-line">
                {ideas.map(({ question, kind }) => (
                  <li key={question}>
                    <QuestionRow question={question} icon={KINDS[kind]} onAsk={ask} disabled={disabled} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
  );
}
