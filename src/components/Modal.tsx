"use client";

// Uma janela grande no centro da tela, com o fundo escurecido. Usa o <dialog> do próprio navegador, que já
// cuida de prender o foco dentro da janela e de fechar com Esc. Clicar no fundo também fecha.
import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
  /** id (liga o botão que abre a janela a ela, para leitores de tela) */
  id: string;
  open: boolean;
  onClose: () => void;
  title: string;
  intro: string;
  /** botão extra no canto do título (ex.: "Me surpreenda") */
  action?: ReactNode;
  children: ReactNode;
  /** largura máxima: a de Dados é maior, para três cartões lado a lado */
  size?: "md" | "lg";
}

export default function Modal({ id, open, onClose, title, intro, action, children, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // abre e fecha a janela de acordo com `open`
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`fade-in m-auto max-h-[88dvh] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-sheet border border-line bg-popover p-0 text-ink shadow-pop backdrop:bg-black/65 open:flex ${size === "lg" ? "max-w-4xl" : "max-w-3xl"}`}
    >
      {open && (
        <>
          <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div>
              <h2 className="font-serif text-2xl leading-tight">{title}</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">{intro}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {action}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="press inline-flex size-10 items-center justify-center rounded-pill text-muted hover:bg-surface-2 hover:text-ink"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
          </header>
          <div className="scrollbar min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
        </>
      )}
    </dialog>
  );
}
