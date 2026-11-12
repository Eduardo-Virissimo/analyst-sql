"use client";

// A ajuda, em português simples: de um lado o que funciona bem (com um visto), do outro o que o assistente
// não faz (com um x), e embaixo o significado das poucas palavras técnicas que aparecem na tela.
// (O que é o programa fica em "Sobre".)
import { CheckIcon, CloseIcon, HelpIcon, IconTile } from "./Icons";
import Modal from "./Modal";
import PanelButton from "./PanelButton";

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

// um cartão com título, ícone e uma lista em que cada item leva a mesma marca (visto ou x)
function Checklist({ title, items, icon, tone, mark }: { title: string; items: string[]; icon: typeof CheckIcon; tone: string; mark: string }) {
  const Mark = icon;
  return (
    <section className="card overflow-hidden">
      <header className="flex items-center gap-4 border-b border-line bg-white/[0.04] px-4 py-2">
        <IconTile icon={icon} tone={tone} />
        <h3 className="font-serif text-base">{title}</h3>
      </header>
      <ul className="divide-y divide-line/60 px-4">
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
  onOpenChange: (open: boolean) => void;
}

export default function HelpPanel({ open, onOpenChange }: HelpPanelProps) {
  return (
    <>
      <PanelButton
        icon={HelpIcon}
        label="Ajuda"
        open={open}
        controls="janela-ajuda"
        onClick={() => onOpenChange(!open)}
        labelOnMobile
      />

      <Modal
        id="janela-ajuda"
        open={open}
        onClose={() => onOpenChange(false)}
        size="lg"
        title="Ajuda"
        intro="Dicas para perguntar bem e o significado das palavras técnicas."
      >
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
            <Checklist title="Como perguntar bem" items={DO} icon={CheckIcon} tone="bg-ok/15 text-ok" mark="text-ok" />
            <Checklist title="O que ele não faz" items={DONT} icon={CloseIcon} tone="bg-danger/15 text-danger-ink" mark="text-danger" />

          <section className="card overflow-hidden">
            <header className="flex items-center gap-4 border-b border-line bg-white/[0.04] px-4 py-2">
              <IconTile icon={HelpIcon} tone="bg-brand-strong/40 text-accent" />
              <h3 className="font-serif text-base">Palavras que você pode ver</h3>
            </header>
            <dl className="divide-y divide-line/60 px-4">
              {TERMS.map((t) => (
                <div key={t.term} className="space-y-1 py-2">
                  <dt>
                    <span className="badge text-ink">{t.term}</span>
                  </dt>
                  <dd className="text-muted">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </Modal>
    </>
  );
}
