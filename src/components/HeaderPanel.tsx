"use client";

// A moldura dos painéis pequenos (Ajuda, sob o campo de pergunta; Sobre, no cabeçalho): um botão que abre um
// painel flutuante com título, uma frase de introdução e o conteúdo. Fecha com Esc ou clicando fora.
// `placement` diz onde abre:
//  - "below" (cabeçalho): embaixo do botão; no celular ocupa a largura da tela
//  - "above" (sob o campo de pergunta): para cima, com a largura do campo (o pai precisa ser `relative`)
// (As janelas grandes, Perguntas prontas e Dados, usam o Modal.)
import { useRef, type ComponentType, type ReactNode, type SVGProps } from "react";
import { CloseIcon } from "./Icons";
import PanelButton from "./PanelButton";
import { usePopoverClose } from "@/hooks/use-popover-close";

interface HeaderPanelProps {
  /** id do painel (liga o botão ao conteúdo para leitores de tela) */
  id: string;
  /** texto do botão; no cabeçalho, no celular só o ícone aparece */
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  placement?: "below" | "above";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function HeaderPanel({
  id,
  label,
  icon,
  placement = "below",
  open,
  onOpenChange,
  title,
  intro,
  children,
  footer,
}: HeaderPanelProps) {
  const root = useRef<HTMLDivElement>(null);
  usePopoverClose(root, open, () => onOpenChange(false));
  const above = placement === "above";

  return (
    <div ref={root} className={above ? "" : "sm:relative"}>
      <PanelButton
        icon={icon}
        label={label}
        open={open}
        controls={id}
        onClick={() => onOpenChange(!open)}
        labelOnMobile={above}
      />

      {open && (
        <section
          id={id}
          aria-label={title}
          className={`fade-in z-30 overflow-hidden rounded-card border border-line bg-popover shadow-pop ${above ? "absolute inset-x-0 bottom-full mb-2" : "fixed inset-x-4 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[27rem]"}`}
        >
          <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="font-serif text-xl leading-tight">{title}</h2>
              <p className="mt-1 text-sm text-muted">{intro}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar"
              className="press -mr-2 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-pill text-muted hover:bg-surface-2 hover:text-ink"
            >
              <CloseIcon className="size-4" />
            </button>
          </header>

          {/* para cima, o espaço é menor (só o que sobra acima do botão): a área de rolagem encolhe para o título nunca ser cortado */}
          <div className={`scrollbar overflow-y-auto ${above ? "max-h-[min(40dvh,22rem)]" : "max-h-[min(68vh,32rem)]"}`}>{children}</div>

          {footer && <footer className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">{footer}</footer>}
        </section>
      )}
    </div>
  );
}
