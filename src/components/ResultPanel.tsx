"use client";

// Os dados da resposta, num cartão: número grande (quando a resposta é um número só), gráfico (quando faz
// sentido), tabela e a busca (SQL). As abas ficam no topo; a busca é sempre a última.
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import ResultTable from "./ResultTable";
import SqlBlock from "./SqlBlock";
import { detectChart, detectSingleValue } from "@/lib/ui/chart";
import { columnLabel } from "@/lib/ui/friendly";
import type { AgentResult } from "@/lib/types";

type Tab = "number" | "chart" | "table" | "sql";

// uma frase, em português simples, sobre o que cada aba mostra
const EXPLANATION: Record<Tab, string> = {
  number: "A resposta é um número só. Ele veio direto dos dados.",
  chart: "Os mesmos números da tabela, em barras, para comparar de relance.",
  table: "Os dados encontrados, em linhas e colunas. Cada linha é um registro, como uma pessoa ou um contrato.",
  sql: "A busca que o assistente fez nos dados, escrita em SQL (a língua dos bancos de dados). Você não precisa entender: serve para conferir ou repetir a busca.",
};

const isStill = (target: number) =>
  !Number.isFinite(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** O número sobe de 0 até o valor em menos de um segundo (parado, com "reduzir movimento"). */
function useCountUp(target: number, delay = 0): number {
  // a resposta só aparece no navegador (nunca vem pronta do servidor), então dá para olhar a janela aqui
  const [value, setValue] = useState(() => (isStill(target) ? target : 0));
  useEffect(() => {
    if (isStill(target)) return;
    const start = performance.now() + delay;
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(Math.max(now - start, 0) / 700, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Number.isInteger(target) ? Math.round(target * eased) : target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, delay]);
  return value;
}

function BigNumber({ value, label, delay }: { value: number; label: string; delay: number }) {
  const shown = useCountUp(value, delay);
  return (
    <p className="py-4">
      <span className="block font-display text-6xl leading-none tracking-tight text-ink tabular-nums">
        {shown.toLocaleString("pt-BR")}
      </span>
      <span className="mt-2 block text-sm text-muted">{columnLabel(label)}</span>
    </p>
  );
}

export default function ResultPanel({ result, delay = 0 }: { result: AgentResult; /** ms até o cartão se desdobrar */ delay?: number }) {
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
    <div className="unfold overflow-hidden rounded-card border border-line bg-surface shadow-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4">
        <div role="tablist" aria-label="Formato dos dados" className="scrollbar -mb-px flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === active}
              onClick={() => setSelected(tab.id)}
              className={`press h-12 shrink-0 border-b-2 px-2 text-sm sm:px-4 ${tab.id === active ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="hidden shrink-0 text-xs text-faint sm:inline">
          {result.rows.length} {result.rows.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div role="tabpanel" key={active} className="fade-in p-4">
        <p className="mb-4 text-sm text-muted">{EXPLANATION[active]}</p>
        {active === "number" && single && <BigNumber value={single.value} label={single.label} delay={selected ? 0 : delay} />}
        {active === "chart" && chart && (
          <BarChart rows={result.rows} labelColumn={chart.labelColumn} valueColumn={chart.valueColumn} delay={selected ? 0 : delay} />
        )}
        {active === "table" && <ResultTable rows={result.rows} />}
        {active === "sql" && result.sql && <SqlBlock sql={result.sql} />}
      </div>
    </div>
  );
}
