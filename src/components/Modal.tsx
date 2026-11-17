"use client";

// A janela do programa: as quatro (Perguntas prontas, Ajuda, Dados e Sobre) usam esta mesma moldura, para
// abrirem e se comportarem do mesmo jeito. Fica no centro da tela, com o fundo escurecido e desfocado.
// Usa o <dialog> do próprio navegador, que já cuida de prender o foco dentro da janela e de fechar com Esc.
// Clicar no fundo também fecha. A animação de abrir e fechar está em `.modal` (globals.css).
import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

// largura máxima: pequena para texto corrido, média para listas, grande para três colunas
const WIDTH = { sm: "max-w-xl", md: "max-w-2xl", lg: "max-w-5xl" };

interface ModalProps {
  /** id (liga o botão que abre a janela a ela, para leitores de tela) */
  id: string;
  open: boolean;
  onClose: () => void;
  title: string;
  /** uma frase sob o título, dizendo para que a janela serve */
  intro: string;
  children: ReactNode;
  /** faixa fixa embaixo (uma observação ou um botão) */
  footer?: ReactNode;
  size?: keyof typeof WIDTH;
}

export default function Modal({ id, open, onClose, title, intro, children, footer, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // abre e fecha a janela de acordo com `open`
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // o foco vai para a janela em si, não para o botão de fechar; o Tab seguinte já entra nos botões de dentro
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={`${id}-titulo`}
      tabIndex={-1}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`modal m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-card border border-line-strong bg-popover p-0 text-ink shadow-pop outline-none open:flex ${WIDTH[size]}`}
    >
      <header className="flex items-start justify-between gap-4 py-4 pl-6 pr-4">
        <div className="pt-2">
          <h2 id={`${id}-titulo`} className="font-display text-2xl leading-8 tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">{intro}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="press inline-flex size-10 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface-2 hover:text-ink"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-2 text-sm leading-6">{children}</div>

      {footer && (
        <footer className="border-t border-line bg-surface-2/60 px-6 py-4 text-xs leading-5 text-muted">{footer}</footer>
      )}
    </dialog>
  );
}
