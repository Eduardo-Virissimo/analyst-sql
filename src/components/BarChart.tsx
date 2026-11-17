// Barras horizontais feitas só com divs: rótulo, barra e valor. A maior barra leva o degradê violeta do ícone; as
// outras, o lilás do ícone, para o olho achar o destaque. Ao aparecer, cada barra cresce da esquerda, uma depois da outra.
// Uma grade só para todas as linhas: a coluna dos rótulos tem a largura do maior rótulo (até um limite).
// A lógica de escolha das colunas fica em lib/ui/chart.ts.
import type { ChartConfig } from "@/lib/ui/chart";
import type { Row } from "@/lib/types";

export default function BarChart({
  rows,
  labelColumn,
  valueColumn,
  delay = 0,
}: { rows: Row[]; /** ms antes de a primeira barra crescer */ delay?: number } & ChartConfig) {
  const values = rows.map((r) => Number(r[valueColumn]));
  const max = Math.max(...values, 0) || 1;

  return (
    <figure
      className="grid grid-cols-[fit-content(40%)_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 text-sm"
      aria-label={`${valueColumn.replaceAll("_", " ")} por ${labelColumn.replaceAll("_", " ")}`}
    >
      {rows.map((row, i) => {
        const width = Math.max((values[i] / max) * 100, 1.5);
        const top = values[i] === max;
        return (
          <div key={i} className="contents">
            <span className="truncate text-muted" title={String(row[labelColumn] ?? "")}>
              {String(row[labelColumn] ?? "—")}
            </span>
            <div className="h-6 rounded-control bg-sunken">
              <div
                className={`grow h-full rounded-control ${top ? "bg-[linear-gradient(90deg,#9a7cff,var(--brand))]" : "bg-lilac"}`}
                style={{ width: `${width}%`, animationDelay: `${delay + 150 + i * 40}ms` }}
              />
            </div>
            <span className={`text-right font-mono tabular-nums ${top ? "text-ink" : "text-muted"}`}>
              {values[i].toLocaleString("pt-BR")}
            </span>
          </div>
        );
      })}
    </figure>
  );
}
