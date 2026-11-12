// Barras horizontais feitas só com divs. Sem moldura nem legenda: rótulo, barra e valor.
// Uma grade só para todas as linhas: a coluna dos rótulos tem a largura do maior rótulo (até um limite),
// então nomes como "Tecnologia da Informação" aparecem inteiros.
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
      className="grid grid-cols-[fit-content(40%)_minmax(0,1fr)_auto] items-center gap-4 text-sm"
      aria-label={`${valueColumn.replaceAll("_", " ")} por ${labelColumn.replaceAll("_", " ")}`}
    >
      {rows.map((row, i) => {
        const width = Math.max((values[i] / max) * 100, 1.5);
        return (
          <div key={i} className="contents">
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
