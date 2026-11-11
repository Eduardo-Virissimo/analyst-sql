// Lógica pura do gráfico (separada do componente para ser testada).
import type { Row } from "@/lib/types";

export interface ChartConfig {
  labelColumn: string;
  valueColumn: string;
}

export function isNumeric(value: unknown): boolean {
  return value !== null && value !== "" && !Number.isNaN(Number(value));
}

// descobre qual coluna é rótulo e qual é valor; null se não der gráfico
export function detectChart(rows: Row[]): ChartConfig | null {
  if (rows.length < 2 || rows.length > 30) return null;

  const columns = Object.keys(rows[0]);
  const numeric = columns.filter((c) => rows.every((r) => isNumeric(r[c])));
  const textual = columns.filter((c) => !numeric.includes(c));

  if (textual.length >= 1 && numeric.length >= 1) {
    return { labelColumn: textual[0], valueColumn: numeric[0] };
  }
  if (columns.length === 2 && numeric.length === 2) {
    return { labelColumn: columns[0], valueColumn: columns[1] };
  }
  return null;
}
