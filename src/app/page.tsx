"use client";

// A tela inteira: barra lateral (conversas e atalhos) à esquerda e, à direita, a conversa aberta com o campo
// de pergunta embaixo. A página nunca rola: só a área de mensagens rola, por dentro.
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import AboutPanel from "@/components/AboutPanel";
import Composer from "@/components/Composer";
import DatabasePanel from "@/components/DatabasePanel";
import Greeting from "@/components/Greeting";
import Header from "@/components/Header";
import HelpPanel from "@/components/HelpPanel";
import IdeasPanel from "@/components/IdeasPanel";
import Sidebar, { type PanelId } from "@/components/Sidebar";
import Turn from "@/components/Turn";
import { useConversations } from "@/hooks/use-conversations";
import { useSchema } from "@/hooks/use-schema";
import { relatedQuestions } from "@/lib/ui/explain-sql";
import { databaseLabel, subjectsLabel } from "@/lib/ui/friendly";

// a partir de 768 px a barra lateral fica fixa ao lado; abaixo disso, abre por cima da conversa
const DESKTOP = "(min-width: 768px)";
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

export default function HomePage() {
  const { threads, active, turns, isLoading, ask, newThread, selectThread, deleteThread } = useConversations();
  const schema = useSchema();
  const [panel, setPanel] = useState<PanelId | null>(null);

  const isDesktop = useIsDesktop();
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarOpen = isDesktop ? desktopOpen : mobileOpen;
  const setSidebar = (open: boolean) => (isDesktop ? setDesktopOpen(open) : setMobileOpen(open));

  const total = turns.length;
  const started = total > 0;
  const ready = schema.status === "ready" ? schema.schema : null;
  const closePanel = () => setPanel(null);

  // a luz do fundo segue o ponteiro na tela inicial (escreve --mx e --my no céu, uma vez por quadro)
  const sky = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (started || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      sky.current?.style.setProperty("--mx", `${x}px`);
      sky.current?.style.setProperty("--my", `${y}px`);
    });
  }

  // a pergunta nova aparece embaixo (como num chat): leva a área de mensagens até ela
  useEffect(() => {
    if (total > 0) {
      document.getElementById(`turn-${total}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [total, active?.id]);

  return (
    <div className="flex h-dvh overflow-hidden">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-control bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo
      </a>

      <Sidebar
        open={sidebarOpen}
        overlay={!isDesktop}
        onClose={() => setSidebar(false)}
        threads={threads}
        activeId={active?.id ?? null}
        onNew={newThread}
        onSelect={selectThread}
        onDelete={deleteThread}
        onOpenPanel={setPanel}
        databaseLabel={ready ? databaseLabel(ready.database) : "Dados"}
        databaseBadge={ready ? subjectsLabel(ready.tables.length) : undefined}
      />

      <div className="relative flex min-w-0 flex-1 flex-col" onPointerMove={followPointer}>
        {/* o céu: manchas de luz que orbitam devagar; fica mais calmo quando a conversa começa */}
        <div ref={sky} aria-hidden="true" className={`sky ${started ? "sky-quiet" : ""}`}>
          <span className="blob blob-a" />
          <span className="blob blob-b" />
          <span className="blob blob-c" />
        </div>

        <Header
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebar(true)}
          title={active?.title}
          onNew={newThread}
        />

        <main id="conteudo" className={`scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto ${started ? "fade-bottom" : ""}`}>
          {!started ? (
            <Greeting key="greeting" onSubmit={ask} disabled={isLoading} onMoreIdeas={() => setPanel("ideas")} />
          ) : (
            <div key={active?.id} className="mx-auto w-full max-w-3xl space-y-12 px-4 pb-8 pt-4">
              {turns.map((conversation, i) => (
                <Turn
                  key={conversation.id}
                  id={`turn-${i + 1}`}
                  conversation={conversation}
                  onOpenDatabase={() => setPanel("db")}
                  onRetry={isLoading ? undefined : () => ask(conversation.question)}
                  onAsk={isLoading ? undefined : ask}
                  followUps={
                    i === total - 1 && conversation.status === "done"
                      ? relatedQuestions(conversation.result.sql, turns.map((t) => t.question))
                      : []
                  }
                />
              ))}
            </div>
          )}
        </main>

        {started && (
          <div className="relative z-10 shrink-0">
            <div className="mx-auto w-full max-w-3xl px-4 pb-4">
              <Composer onSubmit={ask} disabled={isLoading} working={isLoading} autoFocus placeholder="Faça outra pergunta" />
              <p className="mt-2 text-center text-xs text-ink">
                O assistente usa inteligência artificial e pode errar. Confira os números importantes.
              </p>
            </div>
          </div>
        )}
      </div>

      <IdeasPanel open={panel === "ideas"} onClose={closePanel} onAsk={ask} disabled={isLoading} />
      <HelpPanel open={panel === "help"} onClose={closePanel} />
      <DatabasePanel state={schema} open={panel === "db"} onClose={closePanel} />
      <AboutPanel open={panel === "about"} onClose={closePanel} />
    </div>
  );
}
