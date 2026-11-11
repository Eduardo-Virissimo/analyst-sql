"use client";

// Os dados da resposta, num cartão discreto: gráfico (quando faz sentido), tabela e SQL.
import { useState } from "react";
import BarChart from "./BarChart";
import ResultTable from "./ResultTable";
import SqlBlock from "./SqlBlock";
import { detectChart } from "@/lib/ui/chart";
import type { AgentResult } from "@/lib/types";

type Tab = "chart" | "table" | "sql";

// uma frase, em português simples, sobre o que cada aba mostra
const EXPLANATION: Record<Tab, string> = {
  chart: "Os mesmos números da tabela, em barras, para comparar de relance.",
  table: "Os dados encontrados, em linhas e colunas. Cada linha é um registro, como uma pessoa ou um contrato.",
  sql: "A busca que o assistente fez nos dados, escrita em SQL (a língua dos bancos de dados). Você não precisa entender: serve para conferir ou repetir a busca.",
};

export default function ResultPanel({ result }: { result: AgentResult }) {
  const chart = detectChart(result.rows);

  const tabs: { id: Tab; label: string }[] = [];
  if (chart) tabs.push({ id: "chart", label: "Gráfico" });
  tabs.push({ id: "table", label: "Tabela" });
  if (result.sql) tabs.push({ id: "sql", label: "Busca (SQL)" });

  const [selected, setSelected] = useState<Tab | null>(null);
  const active = selected ?? tabs[0].id;

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 px-3 pt-3">
        <div role="tablist" aria-label="Formato dos dados" className="flex rounded-control bg-sunken p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === active}
              onClick={() => setSelected(tab.id)}
              className={`press min-h-9 rounded-[calc(var(--r-control)-2px)] px-3.5 text-sm ${tab.id === active ? "bg-surface-2 text-ink shadow-sm" : "text-muted hover:text-ink"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="pr-1 text-xs text-muted">
          {result.rows.length} {result.rows.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div className="p-4">
        <p className="mb-3 text-sm text-muted">{EXPLANATION[active]}</p>
        {active === "chart" && chart && (
          <BarChart rows={result.rows} labelColumn={chart.labelColumn} valueColumn={chart.valueColumn} />
        )}
        {active === "table" && <ResultTable rows={result.rows} />}
        {active === "sql" && result.sql && <SqlBlock sql={result.sql} />}
      </div>
    </div>
  );
}
