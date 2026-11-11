"use client";

// A ajuda, em português simples: como perguntar bem, o que o assistente não faz e o significado
// das poucas palavras técnicas que aparecem na tela. (O que é o programa fica em "Sobre".)
import HeaderPanel from "./HeaderPanel";
import { HelpIcon } from "./Icons";

const TERMS: { term: string; meaning: string }[] = [
  { term: "Dados", meaning: "As informações da organização, guardadas de forma organizada (em um “banco de dados”)." },
  { term: "Busca (SQL)", meaning: "O pedido que o assistente faz aos dados para achar a resposta. SQL é a língua dos bancos de dados; você não precisa entender." },
  { term: "Somente leitura", meaning: "O assistente só olha os dados. Ele nunca altera, apaga nem cria nada." },
  { term: "Vínculo", meaning: "O contrato de trabalho de uma pessoa: efetivo, estágio, temporário ou terceirizado." },
  { term: "Registro", meaning: "Cada linha de uma tabela. Por exemplo, uma pessoa ou um contrato." },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">{title}</h3>
      {children}
    </section>
  );
}

interface HelpPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpPanel({ open, onOpenChange }: HelpPanelProps) {
  return (
    <HeaderPanel
      id="painel-ajuda"
      label="Ajuda"
      icon={HelpIcon}
      placement="above"
      open={open}
      onOpenChange={onOpenChange}
      title="Ajuda"
      intro="Dicas para perguntar bem e o significado das palavras técnicas."
    >
      <div className="space-y-5 px-5 py-4 text-sm leading-relaxed">
        <Block title="Como perguntar bem">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
            <li>Seja específico: “Quantos estagiários estão ativos?” funciona melhor que “fale dos estagiários”.</li>
            <li>Faça uma pergunta de cada vez.</li>
            <li>Quando o tempo importar, diga o período: “em 2025” ou “nos últimos 12 meses”.</li>
            <li>Não sabe o que perguntar? Abra “Perguntas prontas” ou veja os assuntos em “Dados de RH”.</li>
          </ul>
        </Block>

        <Block title="O que ele não faz">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
            <li>Não altera, apaga nem cria dados. Só consulta.</li>
            <li>Não responde o que não está nos dados (por exemplo, salários).</li>
            <li>Não lembra da pergunta anterior: cada pergunta precisa fazer sentido sozinha.</li>
            <li>
              <strong className="font-semibold text-ink">Pode errar.</strong> Para números importantes, veja a aba “Busca
              (SQL)” do resultado e confira.
            </li>
          </ul>
        </Block>

        <Block title="Palavras que você pode ver">
          <dl className="space-y-2.5">
            {TERMS.map((t) => (
              <div key={t.term}>
                <dt className="font-medium text-ink">{t.term}</dt>
                <dd className="text-muted">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>
    </HeaderPanel>
  );
}
