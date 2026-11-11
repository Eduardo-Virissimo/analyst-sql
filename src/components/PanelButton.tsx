"use client";

// O botão em forma de pílula que abre um painel ou uma janela (Perguntas prontas, Dados, Ajuda, Sobre).
import type { ComponentType, SVGProps } from "react";

interface PanelButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** pequeno selo ao lado do texto (ex.: "3 assuntos") */
  badge?: string;
  open: boolean;
  /** id do que o botão abre (liga o botão ao conteúdo para leitores de tela) */
  controls: string;
  onClick: () => void;
  /** true mostra o texto também no celular; false deixa só o ícone */
  labelOnMobile?: boolean;
}

export default function PanelButton({ icon: Icon, label, badge, open, controls, onClick, labelOnMobile = false }: PanelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={label}
      className={`press inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-pill border px-3 text-sm hover:border-brand/50 hover:text-ink sm:px-3.5 ${open ? "border-brand/60 bg-surface-2 text-ink" : "border-line bg-surface text-muted"}`}
    >
      <Icon className="size-4 text-accent" />
      <span className={labelOnMobile ? "" : "hidden sm:inline"}>{label}</span>
      {badge && <span className="hidden rounded-pill bg-surface-2 px-2 py-0.5 text-xs lg:inline">{badge}</span>}
    </button>
  );
}
