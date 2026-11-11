"use client";

// "Sobre": o que é o programa, para que serve e como usar, em três passos.
import HeaderPanel from "./HeaderPanel";
import { ChartIcon, ChatIcon, InfoIcon, SearchIcon } from "./Icons";

const STEPS = [
  { title: "Pergunte", text: "Escreva do seu jeito, em português. Não precisa saber nada técnico.", icon: ChatIcon },
  { title: "Receba a resposta", text: "Em texto, com tabela e gráfico quando ajudar.", icon: ChartIcon },
  { title: "Confira de onde veio", text: "Na aba “Busca (SQL)” você vê o pedido feito aos dados.", icon: SearchIcon },
];

interface AboutPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutPanel({ open, onOpenChange }: AboutPanelProps) {
  return (
    <HeaderPanel
      id="painel-sobre"
      label="Sobre"
      icon={InfoIcon}
      open={open}
      onOpenChange={onOpenChange}
      title="Sobre o analyst-sql"
      intro="Um analista de dados que conversa em português."
      footer="Projeto do programa Futures (Softplan). Os dados são fictícios e servem só de exemplo."
    >
      <div className="space-y-5 px-5 py-4 text-sm leading-relaxed">
        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">O que é</h3>
          <p>
            Um assistente que responde perguntas sobre os dados de uma organização. Você escreve a pergunta como falaria
            com um colega, e ele procura nos dados e responde.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">Para que serve</h3>
          <p>
            Para quem precisa de números e não sabe (ou não quer esperar alguém) montar um relatório: quantas pessoas há em
            cada setor, quantos contratos terminaram neste ano, qual o motivo mais comum de saída.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">Como usar</h3>
          <ol className="space-y-3">
            {STEPS.map(({ title, text, icon: Icon }, i) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-pill bg-surface-2 text-accent">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block font-medium">
                    {i + 1}. {title}
                  </span>
                  <span className="text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">Com segurança</h3>
          <p>
            O assistente só consulta: ele nunca altera, apaga nem cria nada. Como usa inteligência artificial, ele também
            pode errar, então confira os números importantes.
          </p>
        </section>
      </div>
    </HeaderPanel>
  );
}
