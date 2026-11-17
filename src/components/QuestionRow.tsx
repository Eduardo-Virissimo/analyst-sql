// Uma pergunta pronta, em forma de linha: um toque envia. É a mesma em toda parte, para a pessoa reconhecer de
// longe "isto aqui eu posso clicar para perguntar". O ícone pequeno à esquerda diz o tipo de resposta.
import type { ComponentType, SVGProps } from "react";
import { ArrowUpRightIcon } from "./Icons";

interface QuestionRowProps {
  question: string;
  /** glifo à esquerda (nas Perguntas prontas, o do tipo de resposta) */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** o tipo de resposta que a pergunta traz (ex.: "Gráfico"), num selo à direita */
  tag?: string;
  onAsk: (question: string) => void;
  disabled?: boolean;
}

export default function QuestionRow({ question, icon: Icon, tag, onAsk, disabled = false }: QuestionRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onAsk(question)}
      className="press group flex min-h-12 w-full items-center gap-2 rounded-control px-2 py-2 text-left text-sm text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-50"
    >
      {Icon && <Icon className="size-4 shrink-0 text-accent" />}
      <span className="flex-1">{question}</span>
      {tag && <span className="badge hidden shrink-0 sm:inline-flex">{tag}</span>}
      <ArrowUpRightIcon className="size-4 shrink-0 text-accent opacity-0 transition-[opacity,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100" />
    </button>
  );
}

/** Uma lista de perguntas, separadas por linhas finas. */
export function QuestionList({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-line border-y border-line">
      {children}
    </ul>
  );
}
