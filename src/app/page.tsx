"use client";

import { useEffect, useState } from "react";
import Composer from "@/components/Composer";
import Greeting from "@/components/Greeting";
import Header, { type PanelId } from "@/components/Header";
import QuickActions from "@/components/QuickActions";
import Turn from "@/components/Turn";
import { useConversations } from "@/hooks/use-conversations";
import { useSchema } from "@/hooks/use-schema";

export default function HomePage() {
  const { conversations, isLoading, ask, clear } = useConversations();
  const schema = useSchema();
  const [panel, setPanel] = useState<PanelId | null>(null);

  // os atalhos sob o campo de pergunta (Perguntas prontas e Ajuda): aparecem na tela inicial e na conversa
  const actions = <QuickActions panel={panel} onPanelChange={setPanel} onAsk={ask} asking={isLoading} />;

  const total = conversations.length;
  const started = total > 0;

  // a pergunta nova aparece embaixo (como num chat): leva a área de mensagens até ela
  useEffect(() => {
    if (total > 0) {
      document.getElementById(`turn-${total}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [total]);

  return (
    // A página nunca rola: ela tem a altura da janela. Só a área de mensagens rola, por dentro.
    <div className="flex h-dvh flex-col overflow-hidden">
      <a
        href="#conteudo"
        className="sr-only z-40 rounded-control bg-brand px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo
      </a>

      <Header
        schema={schema}
        panel={panel}
        onPanelChange={setPanel}
        onAsk={ask}
        asking={isLoading}
        onReset={started ? clear : undefined}
      />

      <main id="conteudo" className="scrollbar min-h-0 flex-1 overflow-y-auto">
        {!started ? (
          <Greeting onSubmit={ask} disabled={isLoading} actions={actions} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-12 px-4 pb-8 pt-4">
            {conversations.map((conversation, i) => (
              <Turn
                key={conversation.id}
                id={`turn-${i + 1}`}
                conversation={conversation}
                onOpenDatabase={() => setPanel("db")}
              />
            ))}
          </div>
        )}
      </main>

      {started && (
        <div className="shrink-0">
          <div className="mx-auto w-full max-w-3xl px-4 pb-3 pt-1">
            <Composer onSubmit={ask} disabled={isLoading} autoFocus />
            {actions}
            <p className="mt-2 text-center text-xs text-muted">
              O assistente usa inteligência artificial e pode errar. Confira os números importantes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
