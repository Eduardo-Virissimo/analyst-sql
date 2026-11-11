// Barras horizontais feitas só com divs. Sem moldura nem legenda: rótulo, barra e valor.
// A lógica de escolha das colunas fica em lib/ui/chart.ts.
import type { ChartConfig } from "@/lib/ui/chart";
import type { Row } from "@/lib/types";

export default function BarChart({
  rows,
  labelColumn,
  valueColumn,
}: { rows: Row[] } & ChartConfig) {
  const values = rows.map((r) => Number(r[valueColumn]));
  const max = Math.max(...values, 0) || 1;

  return (
    <figure
      className="space-y-3"
      aria-label={`${valueColumn.replaceAll("_", " ")} por ${labelColumn.replaceAll("_", " ")}`}
    >
      {rows.map((row, i) => {
        const width = Math.max((values[i] / max) * 100, 1.5);
        return (
          <div
            key={i}
            className="grid grid-cols-[5rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]"
          >
            <span className="truncate text-muted" title={String(row[labelColumn] ?? "")}>
              {String(row[labelColumn] ?? "—")}
            </span>
            <div className="h-2 rounded-pill bg-white/10">
              <div className="h-full rounded-pill bg-brand" style={{ width: `${width}%` }} />
            </div>
            <span className="text-right tabular-nums">{values[i].toLocaleString("pt-BR")}</span>
          </div>
        );
      })}
    </figure>
  );
}
