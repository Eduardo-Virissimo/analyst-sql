"use client";

// A linha logo abaixo do campo de pergunta: "Perguntas prontas" e "Ajuda". Cada um abre uma janela.
// Aparece na tela inicial e embaixo da conversa.
import HelpPanel from "./HelpPanel";
import IdeasPanel from "./IdeasPanel";
import type { PanelId } from "./Header";

interface QuickActionsProps {
  panel: PanelId | null;
  onPanelChange: (panel: PanelId | null) => void;
  onAsk: (question: string) => void;
  /** true enquanto uma resposta está a caminho */
  asking: boolean;
}

export default function QuickActions({ panel, onPanelChange, onAsk, asking }: QuickActionsProps) {
  const control = (id: PanelId) => ({
    open: panel === id,
    onOpenChange: (open: boolean) => onPanelChange(open ? id : null),
  });

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <IdeasPanel {...control("ideas")} onAsk={onAsk} disabled={asking} />
      <HelpPanel {...control("help")} />
    </div>
  );
}
