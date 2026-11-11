// O cabeçalho: a marca à esquerda e, à direita, "Dados" e "Sobre". (Perguntas prontas e Ajuda ficam
// sob o campo de pergunta: veja QuickActions.) Só um painel fica aberto por vez; quem manda é `panel`,
// guardado na página.
import Link from "next/link";
import AboutPanel from "./AboutPanel";
import DatabasePanel from "./DatabasePanel";
import { PlusIcon } from "./Icons";
import { LogoMark, Wordmark } from "./Logo";
import type { SchemaState } from "@/hooks/use-schema";

/** Qual painel está aberto (no cabeçalho ou sob o campo de pergunta). */
export type PanelId = "ideas" | "help" | "db" | "about";

interface HeaderProps {
  schema: SchemaState;
  panel: PanelId | null;
  onPanelChange: (panel: PanelId | null) => void;
  /** envia uma das perguntas de exemplo da janela de Dados */
  onAsk: (question: string) => void;
  /** true enquanto uma resposta está a caminho */
  asking: boolean;
  /** só existe depois da primeira pergunta */
  onReset?: () => void;
}

export default function Header({ schema, panel, onPanelChange, onAsk, asking, onReset }: HeaderProps) {
  // abrir um painel fecha o outro
  const control = (id: PanelId) => ({
    open: panel === id,
    onOpenChange: (open: boolean) => onPanelChange(open ? id : null),
  });

  return (
    <header className="relative z-20 shrink-0">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="press flex items-center gap-2.5 rounded-control" aria-label="analyst-sql, início">
          <LogoMark size={28} />
          <Wordmark className="hidden text-[15px] sm:inline" />
        </Link>

        <div className="flex items-center gap-1.5">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Nova conversa"
              className="press inline-flex min-h-10 items-center gap-2 rounded-pill px-3 text-sm text-muted hover:bg-surface hover:text-ink sm:px-3.5"
            >
              <PlusIcon className="size-4 sm:hidden" />
              <span className="hidden sm:inline">Nova conversa</span>
            </button>
          )}
          <DatabasePanel state={schema} {...control("db")} onAsk={onAsk} disabled={asking} />
          <AboutPanel {...control("about")} />
        </div>
      </div>
    </header>
  );
}
