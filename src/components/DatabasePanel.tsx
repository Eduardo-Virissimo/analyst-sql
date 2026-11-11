"use client";

// "Dados de RH": um diagrama das informações, como nas ferramentas de banco de dados. Cada assunto é uma tabelinha
// (Setores, Colaboradores, Vínculos) com suas informações e o tipo de cada uma, ligadas por linhas que correm.
// Fala português: cada tabela é um "assunto" e cada coluna uma "informação". Os nomes técnicos ficam em segundo
// plano ("Nomes técnicos"). Os dados vêm de GET /api/schema (só nomes e comentários, nunca os dados).
import { DatabaseIcon } from "./Icons";
import Modal from "./Modal";
import PanelButton from "./PanelButton";
import type { SchemaTable } from "@/lib/db/schema";
import type { SchemaState } from "@/hooks/use-schema";
import {
  columnDetail,
  databaseLabel,
  friendlyType,
  orderBySubject,
  shortColumnText,
  subjectText,
  subjectsLabel,
  typeMark,
} from "@/lib/ui/friendly";

// perguntas de exemplo de cada assunto do banco de exemplo (assunto novo fica sem exemplos)
const EXAMPLES: Record<string, string[]> = {
  departments: ["Quantos setores existem?", "Quais setores têm mais de 5 colaboradores?"],
  employees: ["Quantos colaboradores existem no total?", "Qual o cargo mais comum entre os colaboradores?"],
  employments: ["Quantos vínculos existem de cada tipo?", "Qual o ano com mais encerramentos?"],
};

// um tom da paleta para cada tabelinha (só a bolinha do título muda)
const DOTS = ["bg-accent", "bg-brand", "bg-brand-strong"];

// a linha que liga duas tabelinhas: horizontal no computador, vertical no celular
function Connector({ active }: { active: boolean }) {
  if (!active) return <div className="hidden md:block" />;
  return (
    <div aria-hidden="true" className="flex justify-center py-1 md:items-start md:pt-7">
      <svg viewBox="0 0 48 12" className="hidden h-3 w-12 md:block" fill="none">
        <circle cx="4" cy="6" r="3" fill="#B36BFF" />
        <line x1="8" y1="6" x2="40" y2="6" stroke="#B36BFF" strokeWidth="1.5" className="flow-line" />
        <path d="M38 2l6 4-6 4" stroke="#B36BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 12 28" className="h-7 w-3 md:hidden" fill="none">
        <circle cx="6" cy="4" r="3" fill="#B36BFF" />
        <line x1="6" y1="8" x2="6" y2="20" stroke="#B36BFF" strokeWidth="1.5" className="flow-line" />
        <path d="M2 18l4 6 4-6" stroke="#B36BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

interface SubjectProps {
  table: SchemaTable;
  dot: string;
  titles: Map<string, string>;
  onAsk: (question: string) => void;
  disabled: boolean;
}

function Subject({ table, dot, titles, onAsk, disabled }: SubjectProps) {
  const { title, description } = subjectText(table);

  // as informações que a pessoa entende (a chave e as ligações com outros assuntos ficam de fora)
  const fields = table.columns.filter((c) => !c.isPrimaryKey && !c.references);
  const links = [...new Set(table.columns.flatMap((c) => (c.references ? [c.references.table] : [])))];
  const examples = EXAMPLES[table.name] ?? [];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-gradient-to-b from-white/[0.09] to-white/[0.025] shadow-card">
      <header className="border-b border-line px-4 py-3.5">
        <h3 className="flex items-center gap-2.5 font-serif text-lg leading-tight">
          <span className={`size-2.5 shrink-0 rounded-pill ${dot}`} aria-hidden="true" />
          {title}
        </h3>
        {description && <p className="mt-1.5 text-xs leading-snug text-muted">{description}</p>}
      </header>

      <ul className="flex-1 px-2 py-2">
        {fields.map((field) => (
          <li
            key={field.name}
            title={columnDetail(field)}
            className="flex items-center justify-between gap-3 rounded-control px-2 py-1.5 text-sm hover:bg-white/5"
          >
            <span>{shortColumnText(field)}</span>
            <span className="shrink-0 rounded-control bg-black/35 px-1.5 py-0.5 font-mono text-[11px] text-accent">
              {typeMark(field.type)}
            </span>
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <p className="mx-4 mb-3 rounded-control border border-dashed border-brand/50 px-3 py-1.5 text-xs text-muted">
          Ligado a <span className="text-ink">{links.map((name) => titles.get(name) ?? name).join(" e ")}</span>
        </p>
      )}

      {examples.length > 0 && (
        <div className="border-t border-line px-2 py-2">
          {examples.map((question) => (
            <button
              key={question}
              type="button"
              disabled={disabled}
              onClick={() => onAsk(question)}
              className="press block min-h-10 w-full rounded-control px-2 py-2 text-left text-xs leading-snug text-muted hover:bg-white/5 hover:text-ink disabled:opacity-50"
            >
              <span className="text-accent">“</span>
              {question}
              <span className="text-accent">”</span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

interface DatabasePanelProps {
  state: SchemaState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAsk: (question: string) => void;
  /** true enquanto uma resposta está a caminho */
  disabled: boolean;
}

export default function DatabasePanel({ state, open, onOpenChange, onAsk, disabled }: DatabasePanelProps) {
  const ready = state.status === "ready" ? state.schema : null;
  const tables = ready ? orderBySubject(ready.tables) : [];
  const titles = new Map(tables.map((t) => [t.name, subjectText(t).title]));
  const label = ready ? databaseLabel(ready.database) : "Dados";

  function ask(question: string) {
    onOpenChange(false);
    onAsk(question);
  }

  return (
    <>
      <PanelButton
        icon={DatabaseIcon}
        label={label}
        badge={ready ? subjectsLabel(ready.tables.length) : undefined}
        open={open}
        controls="janela-dados"
        onClick={() => onOpenChange(!open)}
      />

      <Modal
        id="janela-dados"
        open={open}
        onClose={() => onOpenChange(false)}
        size="lg"
        title={label}
        intro="O que o sistema sabe e como as informações se ligam. Toque numa pergunta de exemplo para experimentar."
      >
        {state.status === "loading" && (
          <div className="grid gap-4 md:grid-cols-3" role="status" aria-label="Carregando os dados">
            {[0, 1, 2].map((i) => (
              <div key={i} className="pulse-dot h-64 rounded-card bg-surface-2" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="text-sm text-danger-ink">Não foi possível carregar a lista agora. {state.message}</p>
        )}

        {ready && (
          <>
            {/* o "palco" do diagrama: um fundo de pontinhos, como numa lousa de projeto */}
            <div className="grid rounded-card border border-line/60 bg-black/20 bg-[radial-gradient(rgb(224_179_255/0.14)_1px,transparent_1px)] [background-size:18px_18px] p-3 sm:p-5 md:grid-cols-[1fr_3rem_1fr_3rem_1fr]">
              {tables.map((table, index) => {
                // a linha liga este assunto ao próximo quando o próximo está ligado a ele
                const next = tables[index + 1];
                const linked = !!next && next.columns.some((c) => c.references?.table === table.name);
                return (
                  <div key={table.name} className="contents">
                    <Subject table={table} dot={DOTS[index % DOTS.length]} titles={titles} onAsk={ask} disabled={disabled} />
                    {next && <Connector active={linked} />}
                  </div>
                );
              })}
            </div>

            <details className="group mt-6 text-xs text-muted">
              <summary className="min-h-8 cursor-pointer list-none py-1.5 hover:text-ink [&::-webkit-details-marker]:hidden">
                <span className="inline-block transition-transform group-open:rotate-90">▸</span> Nomes técnicos
              </summary>
              <div className="grid gap-4 font-mono md:grid-cols-3">
                {tables.map((table) => (
                  <ul key={table.name} className="space-y-0.5">
                    <li className="text-ink">{table.name}</li>
                    {table.columns.map((column) => (
                      <li key={column.name} className="pl-3">
                        {column.name} <span className="opacity-70">({friendlyType(column.type)})</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </details>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Aa texto · 123 número · dd/mm data · A | B uma opção. Perguntas sobre outros assuntos não podem ser respondidas.
              Base: <span className="font-mono">{ready.database}</span>.
            </p>
          </>
        )}
      </Modal>
    </>
  );
}
