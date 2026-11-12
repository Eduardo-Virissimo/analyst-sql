// Uma pergunta pronta, em forma de linha: um toque envia. É a mesma em toda parte (tela inicial,
// Perguntas prontas e Dados), para a pessoa reconhecer de longe "isto aqui eu posso clicar para perguntar".
import { ArrowUpRightIcon, IconTile } from "./Icons";

interface QuestionRowProps {
  question: string;
  /** ícone à esquerda (nas Perguntas prontas, o do tipo de resposta) */
  icon?: Parameters<typeof IconTile>[0]["icon"];
  /** o tipo de resposta que a pergunta traz (ex.: "Gráfico"), num selo à direita */
  tag?: string;
  onAsk: (question: string) => void;
  disabled?: boolean;
}

export default function QuestionRow({ question, icon, tag, onAsk, disabled = false }: QuestionRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onAsk(question)}
      className="press group flex min-h-12 w-full items-center gap-4 rounded-control px-2 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-ink disabled:opacity-50"
    >
      {icon && <IconTile icon={icon} />}
      <span className="flex-1">{question}</span>
      {tag && <span className="badge hidden shrink-0 sm:inline-flex">{tag}</span>}
      <ArrowUpRightIcon className="size-4 shrink-0 text-accent opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
    </button>
  );
}

/** Uma lista de perguntas, separadas por linhas finas. */
export function QuestionList({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-line/60 border-y border-line/60">
      {children}
    </ul>
  );
}
