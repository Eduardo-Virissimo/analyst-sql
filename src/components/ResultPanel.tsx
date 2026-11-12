"use client";

// Os dados da resposta, num cartão discreto: número grande (quando a resposta é um número só),
// gráfico (quando faz sentido), tabela e SQL. Embaixo, quanto tempo a resposta levou.
import { useState } from "react";
import BarChart from "./BarChart";
import ResultTable from "./ResultTable";
import SqlBlock from "./SqlBlock";
import { detectChart, detectSingleValue } from "@/lib/ui/chart";
import { answerMeta, columnLabel } from "@/lib/ui/friendly";
import type { AgentResult } from "@/lib/types";

type Tab = "number" | "chart" | "table" | "sql";

// uma frase, em português simples, sobre o que cada aba mostra
const EXPLANATION: Record<Tab, string> = {
  number: "A resposta é um número só. Ele veio direto dos dados.",
  chart: "Os mesmos números da tabela, em barras, para comparar de relance.",
  table: "Os dados encontrados, em linhas e colunas. Cada linha é um registro, como uma pessoa ou um contrato.",
  sql: "A busca que o assistente fez nos dados, escrita em SQL (a língua dos bancos de dados). Você não precisa entender: serve para conferir ou repetir a busca.",
};

export default function ResultPanel({ result }: { result: AgentResult }) {
  const single = detectSingleValue(result.rows);
  const chart = detectChart(result.rows);

  const tabs: { id: Tab; label: string }[] = [];
  if (single) tabs.push({ id: "number", label: "Número" });
  if (chart) tabs.push({ id: "chart", label: "Gráfico" });
  tabs.push({ id: "table", label: "Tabela" });
  if (result.sql) tabs.push({ id: "sql", label: "Busca (SQL)" });

  const [selected, setSelected] = useState<Tab | null>(null);
  const active = selected ?? tabs[0].id;

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <div role="tablist" aria-label="Formato dos dados" className="flex rounded-control bg-sunken p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === active}
              onClick={() => setSelected(tab.id)}
              className={`press min-h-8 rounded-[calc(var(--r-control)-var(--space-1))] px-4 text-sm ${tab.id === active ? "bg-surface-2 text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">
          {result.rows.length} {result.rows.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div role="tabpanel" className="p-4">
        <p className="mb-4 text-sm text-muted">{EXPLANATION[active]}</p>
        {active === "number" && single && (
          <p className="py-4">
            <span className="block font-serif text-6xl leading-none tracking-tight text-accent tabular-nums">
              {single.value.toLocaleString("pt-BR")}
            </span>
            <span className="mt-2 block text-sm text-muted">{columnLabel(single.label)}</span>
          </p>
        )}
        {active === "chart" && chart && (
          <BarChart rows={result.rows} labelColumn={chart.labelColumn} valueColumn={chart.valueColumn} />
        )}
        {active === "table" && <ResultTable rows={result.rows} />}
        {active === "sql" && result.sql && <SqlBlock sql={result.sql} />}
      </div>

      <p className="border-t border-line/60 px-4 py-2 text-xs text-muted">
        {answerMeta(result.durationMs, result.attempts.length)}
      </p>
    </div>
  );
}
