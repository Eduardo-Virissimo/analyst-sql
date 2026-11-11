// Comparação de resultados usada pela avaliação (execution accuracy).
import type { Row } from "@/lib/types";

// ignora o nome das colunas e normaliza números ("33.80" == 33.8)
export function normalizeRows(rows: Row[], orderMatters = false): string[] {
  const normalized = rows.map((row) =>
    JSON.stringify(
      Object.values(row).map((value) => {
        if (value === null) return null;
        const n = Number(value);
        return Number.isFinite(n) && String(value).trim() !== ""
          ? Math.round(n * 100) / 100
          : String(value);
      }),
    ),
  );
  return orderMatters ? normalized : normalized.sort();
}

export function sameRows(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}
