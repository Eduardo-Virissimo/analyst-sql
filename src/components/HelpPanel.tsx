"use client";

// A ajuda, em português simples: de um lado o que funciona bem (com um visto), do outro o que o assistente
// não faz (com um x), e embaixo o significado das poucas palavras técnicas que aparecem na tela.
// (O que é o programa fica em "Sobre".)
import { CheckIcon, CloseIcon } from "./Icons";
import Modal from "./Modal";

const DO = [
  "Seja específico: “Quantos estagiários estão ativos?” funciona melhor que “fale dos estagiários”.",
  "Faça uma pergunta de cada vez.",
  "Quando o tempo importar, diga o período: “em 2025” ou “nos últimos 12 meses”.",
  "Sem ideia? Abra “Perguntas prontas” ou veja os assuntos em “Dados”.",
];

const DONT = [
  "Não altera, apaga nem cria dados. Só consulta.",
  "Não responde o que não está nos dados (por exemplo, salários).",
  "Não lembra da pergunta anterior: cada pergunta precisa fazer sentido sozinha.",
  "Pode errar. Para números importantes, confira na aba “Busca (SQL)” do resultado.",
];

const TERMS: { term: string; meaning: string }[] = [
  { term: "Dados", meaning: "As informações da organização, guardadas de forma organizada (em um “banco de dados”)." },
  { term: "Busca (SQL)", meaning: "O pedido que o assistente faz aos dados. SQL é a língua dos bancos de dados; você não precisa entender." },
  { term: "Somente leitura", meaning: "O assistente só olha os dados. Ele nunca altera, apaga nem cria nada." },
  { term: "Vínculo", meaning: "O contrato de trabalho de uma pessoa: efetivo, estágio, temporário ou terceirizado." },
  { term: "Registro", meaning: "Cada linha de uma tabela. Por exemplo, uma pessoa ou um contrato." },
];

// uma coluna com título e uma lista em que cada item leva a mesma marca (visto ou x), separada por fios
function Checklist({ title, items, icon: Mark, mark }: { title: string; items: string[]; icon: typeof CheckIcon; mark: string }) {
  return (
    <section className="lg:px-4 lg:first:pl-0 lg:last:pr-0">
      <h3 className="pb-2 font-display text-lg">{title}</h3>
      <ul className="divide-y divide-line border-t border-line">
        {items.map((item) => (
          <li key={item} className="flex gap-2 py-2 text-muted">
            <Mark className={`mt-1 size-4 shrink-0 ${mark}`} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpPanel({ open, onClose }: HelpPanelProps) {
  return (
    <Modal
      id="janela-ajuda"
      open={open}
      onClose={onClose}
      size="lg"
      title="Ajuda"
      intro="Dicas para perguntar bem e o significado das palavras técnicas."
    >
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-0 lg:divide-x lg:divide-line">
        <Checklist title="Como perguntar bem" items={DO} icon={CheckIcon} mark="text-ok" />
        <Checklist title="O que ele não faz" items={DONT} icon={CloseIcon} mark="text-danger" />

        <section className="lg:pl-4">
          <h3 className="pb-2 font-display text-lg">Palavras que você pode ver</h3>
          <dl className="divide-y divide-line border-t border-line">
            {TERMS.map((t) => (
              <div key={t.term} className="py-2">
                <dt className="text-ink">{t.term}</dt>
                <dd className="text-muted">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Modal>
  );
}
