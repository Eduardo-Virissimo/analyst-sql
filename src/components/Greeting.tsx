// Tela inicial, enxuta: diz o que fazer e deixa escrever. Embaixo do campo vêm os atalhos
// (Perguntas prontas e Ajuda), que chegam prontos em `actions`, e três exemplos para começar com um toque.
import type { ReactNode } from "react";
import Composer from "./Composer";
import QuestionRow, { QuestionList } from "./QuestionRow";

// um exemplo de cada tipo de resposta: gráfico, número e tabela
const EXAMPLES = [
  "Quantos colaboradores trabalham em cada setor?",
  "Quantos colaboradores existem no total?",
  "Quais são os nomes dos estagiários com vínculo ativo?",
];

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
          <h1 className="text-balance text-center font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            O que você quer saber sobre os dados?
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty text-center text-base leading-relaxed text-muted">
            Escreva em português, como falaria com um colega. A resposta vem em texto, tabela e gráfico.
          </p>

          <div className="mt-6">
            <Composer onSubmit={onSubmit} disabled={disabled} autoFocus />
          </div>

          {actions}

          <section className="mt-8" aria-label="Exemplos de pergunta">
            <h2 className="px-2 text-xs text-muted">Ou comece por um exemplo</h2>
            <div className="mt-2">
              <QuestionList>
                {EXAMPLES.map((question) => (
                  <li key={question}>
                    <QuestionRow question={question} onAsk={onSubmit} disabled={disabled} />
                  </li>
                ))}
              </QuestionList>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
