"use client";

// A barra lateral: a marca, "Nova conversa", os atalhos para as quatro janelas e a lista de conversas
// (guardadas só neste navegador). No computador ela recolhe para a esquerda; no celular abre por cima da tela.
import type { ComponentType, SVGProps } from "react";
import { DatabaseIcon, HelpIcon, InfoIcon, PlusIcon, SidebarIcon, SparkIcon, TrashIcon } from "./Icons";
import { LogoMark, Wordmark } from "./Logo";
import { threadGroup, type Thread } from "@/lib/ui/history";

/** Qual janela está aberta. */
export type PanelId = "ideas" | "help" | "db" | "about";

interface SidebarProps {
  open: boolean;
  /** true no celular: a barra fica por cima da conversa, com o fundo escurecido */
  overlay: boolean;
  onClose: () => void;
  threads: Thread[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenPanel: (panel: PanelId) => void;
  /** nome do banco ("Dados de RH") e quantos assuntos ele tem ("3 assuntos") */
  databaseLabel: string;
  databaseBadge?: string;
}

const GROUPS = ["Hoje", "Ontem", "Antes"] as const;

export default function Sidebar(props: SidebarProps) {
  const { open, overlay, onClose, threads, activeId, onNew, onSelect, onDelete, onOpenPanel } = props;

  const nav: { id: PanelId; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; badge?: string }[] = [
    { id: "ideas", label: "Perguntas prontas", icon: SparkIcon },
    { id: "db", label: props.databaseLabel, icon: DatabaseIcon, badge: props.databaseBadge },
    { id: "help", label: "Ajuda", icon: HelpIcon },
    { id: "about", label: "Sobre", icon: InfoIcon },
  ];

  // no celular, escolher alguma coisa fecha a barra
  const then = (action: () => void) => () => {
    action();
    if (overlay) onClose();
  };

  return (
    <>
      {overlay && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className={`fixed inset-0 z-30 bg-[rgb(244_239_255/0.6)] backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
      )}

      <aside
        aria-label="Conversas e atalhos"
        inert={!open}
        className={`night fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-hidden border-r border-line bg-sidebar bg-[radial-gradient(140%_50%_at_50%_100%,#2a2533,transparent_70%)] transition-[transform,width] duration-300 ease-[var(--ease-out)] md:relative md:z-auto md:translate-x-0 ${open ? "translate-x-0 md:w-72" : "-translate-x-full md:w-0 md:border-r-0"}`}
      >
        <div className="flex h-full w-72 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 pl-4 pr-2">
            <button
              type="button"
              onClick={then(onNew)}
              className="press flex items-center gap-2 rounded-control"
              aria-label="analyst-sql, nova conversa"
            >
              <LogoMark size={32} />
              <Wordmark className="text-base" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Recolher a barra lateral"
              className="press inline-flex size-10 items-center justify-center rounded-control text-muted hover:bg-surface hover:text-ink"
            >
              <SidebarIcon className="size-5" />
            </button>
          </div>

          <div className="space-y-1 px-2 pb-4">
            <button
              type="button"
              onClick={then(onNew)}
              className="press group flex h-10 w-full items-center gap-2 rounded-control px-2 text-sm font-medium text-ink hover:bg-surface"
            >
              <span className="btn-brand inline-flex size-6 items-center justify-center rounded-pill transition-transform duration-300 group-hover:rotate-90">
                <PlusIcon className="size-4" />
              </span>
              Nova conversa
            </button>
            {nav.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                aria-haspopup="dialog"
                onClick={then(() => onOpenPanel(id))}
                className="press flex h-10 w-full items-center gap-2 rounded-control px-2 text-sm text-muted hover:bg-surface hover:text-ink"
              >
                <span className="inline-flex size-6 items-center justify-center">
                  <Icon className="size-4" />
                </span>
                {/* o nome do banco e os assuntos chegam depois (GET /api/schema): entram com um fade, sem saltar */}
                <span key={label} className="fade-in flex-1 truncate text-left">
                  {label}
                </span>
                {badge && <span className="badge fade-in">{badge}</span>}
              </button>
            ))}
          </div>

          <nav aria-label="Conversas" className="scrollbar min-h-0 flex-1 overflow-y-auto border-t border-line px-2 pb-4">
            {threads.length === 0 ? (
              <p className="px-2 pt-4 text-xs leading-5 text-faint">
                Suas conversas aparecem aqui. Elas ficam guardadas só neste navegador.
              </p>
            ) : (
              GROUPS.map((group) => {
                const items = threads.filter((t) => threadGroup(t.updatedAt) === group);
                if (!items.length) return null;
                return (
                  <section key={group} className="pt-4">
                    <h2 className="px-2 pb-1 text-xs font-medium text-faint">{group}</h2>
                    <ul className="space-y-1">
                      {items.map((thread) => {
                        const current = thread.id === activeId;
                        const working = thread.turns.some((c) => c.status === "loading");
                        return (
                          <li key={thread.id} className="group relative">
                            <button
                              type="button"
                              onClick={then(() => onSelect(thread.id))}
                              aria-current={current ? "page" : undefined}
                              title={thread.title}
                              className={`press flex h-10 w-full items-center gap-2 rounded-control pl-2 pr-10 text-left text-sm ${current ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
                            >
                              {working && <span className="size-2 shrink-0 rounded-pill bg-brand" aria-label="Respondendo" />}
                              <span className="truncate">{thread.title}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(thread.id)}
                              aria-label={`Apagar a conversa “${thread.title}”`}
                              className={`press absolute right-0 top-0 inline-flex size-10 items-center justify-center rounded-control text-faint hover:bg-line-strong hover:text-danger-ink focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${current ? "opacity-100" : "opacity-0"}`}
                            >
                              <TrashIcon className="size-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 border-t border-line px-4 py-4 text-xs text-muted">
            <span className="size-2 shrink-0 rounded-pill bg-ok shadow-[0_0_0_4px_rgb(127_220_171/0.15)]" aria-hidden="true" />
            <span>
              <span className="text-ink">Somente leitura.</span> Nada é alterado nos dados.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
