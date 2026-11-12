"use client";

// "Dados": o banco montado como um diagrama, para quem nunca viu um. Cada tabela é uma caixa ("assunto"),
// cada coluna é uma linha da caixa ("informação") com um ícone do tipo e uma explicação curta. A chave (o código
// de cada registro) e as ligações entre assuntos aparecem sinalizadas, e uma linha liga a chave de um assunto ao
// campo que aponta para ela no outro, com "1" de um lado e "vários" do outro. Em cima, uma legenda ensina a ler.
// Os dados vêm de GET /api/schema (só nomes e comentários, nunca os dados).
import type { CSSProperties } from "react";
import {
  ArrowRightIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  ContractIcon,
  DatabaseIcon,
  HashIcon,
  IconTile,
  KeyIcon,
  LinkIcon,
  ListIcon,
  TableIcon,
  TextIcon,
  UsersIcon,
} from "./Icons";
import Modal from "./Modal";
import PanelButton from "./PanelButton";
import type { SchemaColumn, SchemaTable } from "@/lib/db/schema";
import type { SchemaState } from "@/hooks/use-schema";
import {
  columnDetail,
  databaseLabel,
  fieldsLabel,
  friendlyType,
  orderBySubject,
  shortColumnText,
  subjectText,
  subjectsLabel,
} from "@/lib/ui/friendly";

// o ícone de cada assunto do banco de exemplo (assunto novo fica com o ícone padrão)
const SUBJECT_ICONS: Record<string, typeof TableIcon> = {
  departments: BuildingIcon,
  employees: UsersIcon,
  employments: ContractIcon,
};

// o ícone de cada tipo de informação (as palavras vêm de friendlyType)
const TYPE_ICONS: Record<string, typeof TableIcon> = {
  texto: TextIcon,
  número: HashIcon,
  data: CalendarIcon,
  "data e hora": CalendarIcon,
  hora: ClockIcon,
  "uma opção": ListIcon,
  "sim ou não": CheckIcon,
};

// as cores dos três tipos de linha: chave, ligação e informação comum
const TONE = {
  key: "bg-warn/15 text-warn",
  link: "bg-brand-strong/40 text-accent",
  field: "bg-surface-2 text-muted",
};

// Medidas fixas (px) do cartão: o cabeçalho e cada linha têm sempre a mesma altura. É isso que deixa a linha de
// ligação sair do meio da chave de um assunto e chegar no meio do campo certo do outro, sem medir nada na tela.
const HEADER = 80; // h-20
const ROW = 40; // h-10
const GAP = 80; // o vão entre dois cartões (5rem), onde a linha passa
const rowCenter = (index: number) => 1 + HEADER + ROW * index + ROW / 2; // 1 = borda do cartão

/** A chave primeiro, depois as ligações, depois as informações comuns: a ordem em que as linhas aparecem. */
function orderedColumns(table: SchemaTable): SchemaColumn[] {
  const rank = (c: SchemaColumn) => (c.isPrimaryKey ? 0 : c.references ? 1 : 2);
  return [...table.columns].sort((a, b) => rank(a) - rank(b));
}

// a linha que liga dois assuntos vizinhos: no computador, um traço da chave até o campo; no celular, uma etiqueta
function Connector({ from, to }: { from: SchemaTable; to: SchemaTable }) {
  const y1 = rowCenter(Math.max(orderedColumns(from).findIndex((c) => c.isPrimaryKey), 0));
  const y2 = rowCenter(Math.max(orderedColumns(to).findIndex((c) => c.references?.table === from.name), 0));
  const mid = GAP / 2;
  const bend = y2 === y1 ? "" : `Q${mid} ${y1} ${mid} ${y1 + 8} V${y2 - 8} Q${mid} ${y2} ${mid + 8} ${y2}`;

  return (
    <div aria-hidden="true">
      <svg width={GAP} height={Math.max(y1, y2) + 24} className="hidden md:block" fill="none">
        <path d={`M4 ${y1} H${mid - 8} ${bend} H${GAP - 4}`} stroke="var(--brand)" strokeWidth="1.5" />
        <circle cx="4" cy={y1} r="3.5" fill="var(--warn)" />
        <circle cx={GAP - 4} cy={y2} r="3.5" fill="var(--brand)" />
        <text x="12" y={y1 - 8} className="fill-muted text-xs">
          1
        </text>
        <text x={GAP - 8} y={y2 + 20} textAnchor="end" className="fill-muted text-xs">
          vários
        </text>
      </svg>
      <div className="flex flex-col items-center md:hidden">
        <span className="h-4 w-px bg-brand" />
        <span className="badge">1 ↓ vários</span>
        <span className="h-4 w-px bg-brand" />
      </div>
    </div>
  );
}

interface SubjectProps {
  table: SchemaTable;
  titles: Map<string, string>;
}

function Subject({ table, titles }: SubjectProps) {
  const { title, description } = subjectText(table);
  const columns = orderedColumns(table);

  return (
    <article className="card min-w-0 overflow-hidden">
      <header className="flex h-20 items-center gap-4 border-b border-line bg-white/[0.04] px-4">
        <IconTile icon={SUBJECT_ICONS[table.name] ?? TableIcon} size="size-10" tone="bg-brand-strong/40 text-accent" />
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-serif text-lg leading-6">{title}</h3>
          <p className="line-clamp-2 text-xs leading-4 text-muted">{description || fieldsLabel(columns.length)}</p>
        </div>
      </header>

      <ul className="divide-y divide-line/60">
        {columns.map((column) => {
          const kind = column.isPrimaryKey ? "key" : column.references ? "link" : "field";
          const target = column.references ? (titles.get(column.references.table) ?? column.references.table) : "";
          // ligação sem descrição no banco: mostra o assunto para onde aponta, não o nome técnico da coluna
          const name = kind === "key" ? "Código" : kind === "link" && !column.comment.trim() ? target : shortColumnText(column);
          const detail =
            kind === "key"
              ? "Número único de cada registro"
              : kind === "link"
                ? `Liga a ${target}`
                : columnDetail(column);
          const icon = kind === "key" ? KeyIcon : kind === "link" ? LinkIcon : (TYPE_ICONS[friendlyType(column.type)] ?? TextIcon);
          return (
            <li key={column.name} className="flex h-10 items-center gap-2 px-4" title={`${name}: ${detail}`}>
              <IconTile icon={icon} tone={TONE[kind]} />
              <div className="min-w-0">
                <p className="truncate text-sm leading-5">{name}</p>
                <p className="truncate text-xs leading-4 text-muted">{detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

// a legenda: ensina a ler o desenho, numa faixa só, com as mesmas formas e cores que aparecem nele
function Legend() {
  const items = [
    { icon: TableIcon, tone: "bg-brand-strong/40 text-accent", title: "Caixa", text: "Um assunto. No banco, chama-se tabela." },
    { icon: KeyIcon, tone: TONE.key, title: "Código", text: "Identifica cada registro. Nunca se repete." },
    { icon: LinkIcon, tone: TONE.link, title: "Ligação", text: "Aponta para o código de outro assunto." },
    { icon: TextIcon, tone: TONE.field, title: "Informação", text: "Um dado guardado: texto, número ou data." },
    { icon: ArrowRightIcon, tone: "bg-brand-strong/40 text-accent", title: "1 → vários", text: "Um registro de um lado, vários do outro." },
  ];
  return (
    <ul className="mb-6 grid gap-4 rounded-control bg-sunken p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Como ler o desenho">
      {items.map(({ icon, tone, title, text }) => (
        <li key={title} className="flex items-start gap-2">
          <IconTile icon={icon} tone={tone} />
          <p className="text-xs leading-4 text-muted">
            <span className="block text-sm leading-4 text-ink">{title}</span>
            {text}
          </p>
        </li>
      ))}
    </ul>
  );
}

interface DatabasePanelProps {
  state: SchemaState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DatabasePanel({ state, open, onOpenChange }: DatabasePanelProps) {
  const ready = state.status === "ready" ? state.schema : null;
  const tables = ready ? orderBySubject(ready.tables) : [];
  const titles = new Map(tables.map((t) => [t.name, subjectText(t).title]));
  const label = ready ? databaseLabel(ready.database) : "Dados";

  // no computador: um cartão, um vão para a linha, outro cartão...
  const columns = tables.map(() => "minmax(0,1fr)").join(` ${GAP}px `);

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
        intro="O que dá para consultar e como as informações se ligam."
        footer={
          ready && (
            <details className="group">
              <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                <span className="transition-transform group-open:rotate-90" aria-hidden="true">
                  ▸
                </span>
                Nomes técnicos (para quem conhece bancos de dados)
              </summary>
              <div className="mt-2 grid gap-4 font-mono md:grid-cols-3">
                {tables.map((table) => (
                  <ul key={table.name} className="space-y-1">
                    <li className="text-ink">{table.name}</li>
                    {table.columns.map((column) => (
                      <li key={column.name} className="pl-4">
                        {column.name} <span className="opacity-70">({friendlyType(column.type)})</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </details>
          )
        }
      >
        {state.status === "loading" && (
          <div className="grid gap-8 md:grid-cols-3" role="status" aria-label="Carregando os dados">
            {[0, 1, 2].map((i) => (
              <div key={i} className="pulse-dot h-80 rounded-card bg-surface-2" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="text-danger-ink">Não foi possível carregar a lista agora. {state.message}</p>
        )}

        {ready && (
          <>
            <Legend />
            <div className="grid md:grid-cols-(--cols) md:items-start" style={{ "--cols": columns } as CSSProperties}>
              {tables.map((table, index) => {
                const next = tables[index + 1];
                // a linha só aparece quando o assunto seguinte aponta para este
                const linked = !!next && next.columns.some((c) => c.references?.table === table.name);
                return (
                  <div key={table.name} className="contents">
                    <Subject table={table} titles={titles} />
                    {next && (linked ? <Connector from={table} to={next} /> : <div className="h-6 md:h-0" />)}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
