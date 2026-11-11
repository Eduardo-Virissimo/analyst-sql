// Tela inicial, enxuta: diz o que fazer e deixa escrever. Embaixo do campo vêm os atalhos
// (Perguntas prontas e Ajuda), que chegam prontos em `actions`.
import type { ReactNode } from "react";
import Composer from "./Composer";

interface GreetingProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
  actions: ReactNode;
}

export default function Greeting({ onSubmit, disabled, actions }: GreetingProps) {
  return (
    // .glow: brilho radial roxo atrás do título, contido nesta caixa (sem criar rolagem lateral)
    <div className="glow flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 pb-16 pt-4">
        <div className="enter">
          <h1 className="text-balance text-center font-serif text-4xl leading-[1.12] tracking-tight sm:text-[2.75rem]">
            O que você quer saber sobre os dados?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-center text-[15px] leading-relaxed text-muted">
            Escreva em português, como falaria com um colega. A resposta vem em texto, tabela e gráfico.
          </p>

          <div className="mt-6">
            <Composer onSubmit={onSubmit} disabled={disabled} autoFocus />
          </div>

          {actions}
        </div>
      </div>
    </div>
  );
}
