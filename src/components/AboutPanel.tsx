"use client";

// "Sobre": o que é o programa e para que serve (dois blocos lado a lado), como usar (três passos numerados,
// ligados por setas) e por que é seguro (um aviso em destaque).
import { ChartIcon, ChatIcon, IconTile, LockIcon, SearchIcon } from "./Icons";
import Modal from "./Modal";

const STEPS = [
  { title: "Pergunte", text: "Escreva do seu jeito, em português. Não precisa saber nada técnico.", icon: ChatIcon },
  { title: "Receba a resposta", text: "Em texto, com tabela e gráfico quando ajudar.", icon: ChartIcon },
  { title: "Confira de onde veio", text: "Na aba “Busca (SQL)” você vê o pedido feito aos dados.", icon: SearchIcon },
];

interface AboutPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutPanel({ open, onClose }: AboutPanelProps) {
  return (
      <Modal
        id="janela-sobre"
        open={open}
        onClose={onClose}
        title="Sobre o analyst-sql"
        intro="Um analista de dados que conversa em português."
        footer="Projeto do programa Futures (Softplan). Os dados são fictícios e servem só de exemplo."
      >
        <div className="space-y-6">
          {/* dois blocos de texto, separados por um fio */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-line">
            <section className="sm:pr-6">
              <h3 className="mb-2 font-display text-lg">O que é</h3>
              <p className="text-muted">
                Um assistente que responde perguntas sobre os dados de uma organização. Você escreve como falaria com um
                colega, e ele procura nos dados e responde.
              </p>
            </section>
            <section className="sm:pl-6">
              <h3 className="mb-2 font-display text-lg">Para que serve</h3>
              <p className="text-muted">
                Para quem precisa de números e não quer esperar alguém montar um relatório: quantas pessoas há em cada
                setor, quantos contratos terminaram neste ano.
              </p>
            </section>
          </div>

          <section aria-label="Como usar">
            <h3 className="mb-2 font-display text-lg">Como usar</h3>
            <ol className="grid gap-4 border-t border-line pt-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {STEPS.map(({ title, text, icon: Icon }) => (
                <li key={title} className="flex gap-2 sm:px-4 sm:first:pl-0 sm:last:pr-0">
                  <Icon className="mt-1 size-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-ink">{title}</p>
                    <p className="mt-1 text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex items-start gap-4 rounded-card border border-ok/30 bg-ok/5 p-4">
            <IconTile icon={LockIcon} tone="bg-ok/15 text-ok" />
            <div>
              <h3 className="font-display text-lg">Com segurança</h3>
              <p className="mt-1 text-muted">
                O assistente só consulta: nunca altera, apaga nem cria nada. Como usa inteligência artificial, ele pode
                errar, então confira os números importantes.
              </p>
            </div>
          </section>
        </div>
      </Modal>
  );
}
