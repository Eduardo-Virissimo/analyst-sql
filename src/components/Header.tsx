// A faixa de cima da área da conversa: o botão da barra lateral (quando ela está fechada), o título da conversa
// aberta e, à direita, "Nova conversa". (A marca, as janelas e o histórico ficam na barra lateral: veja Sidebar.)
import { EditIcon, SidebarIcon } from "./Icons";
import { LogoMark } from "./Logo";

interface HeaderProps {
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  /** título da conversa aberta; vazio na tela inicial */
  title?: string;
  onNew: () => void;
}

export default function Header({ sidebarOpen, onOpenSidebar, title, onNew }: HeaderProps) {
  const iconButton =
    "press inline-flex size-10 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface hover:text-ink";

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-2 px-2 md:px-4">
      {!sidebarOpen && (
        <>
          <button type="button" onClick={onOpenSidebar} aria-label="Abrir a barra lateral" className={iconButton}>
            <SidebarIcon className="size-5" />
          </button>
          {title && (
            <span className="md:hidden">
              <LogoMark size={24} />
            </span>
          )}
        </>
      )}

      <p className="min-w-0 flex-1 truncate px-2 text-sm text-ink">{title}</p>

      {(!sidebarOpen || title) && (
        <button type="button" onClick={onNew} aria-label="Nova conversa" title="Nova conversa" className={iconButton}>
          <EditIcon className="size-5" />
        </button>
      )}
    </header>
  );
}
