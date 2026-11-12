import type { ReactNode } from "react";
import { isNumeric } from "@/lib/ui/chart";
import { columnLabel } from "@/lib/ui/friendly";
import type { Row } from "@/lib/types";

function formatValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return <span className="text-muted">—</span>;
  if (isNumeric(value)) return Number(value).toLocaleString("pt-BR");
  return String(value);
}

export default function ResultTable({ rows }: { rows: Row[] }) {
  if (!rows.length) {
    return <p className="py-4 text-center text-sm text-muted">Nenhum registro encontrado.</p>;
  }

  const columns = Object.keys(rows[0]);
  // colunas só com números ficam à direita, como numa planilha
  // (com uma coluna só, fica à esquerda: à direita sobraria um buraco vazio)
  const numericColumns = new Set(
    columns.length > 1
      ? columns.filter((c) => rows.every((r) => r[c] === null || isNumeric(r[c])))
      : [],
  );

  return (
    <div className="scrollbar -mx-4 -mb-4 max-h-96 overflow-auto border-t border-line">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-popover">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={`border-b border-line px-4 py-2 text-xs font-medium text-muted ${numericColumns.has(column) ? "text-right" : "text-left"}`}
              >
                {columnLabel(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/60 last:border-0">
              {columns.map((column) => (
                <td
                  key={column}
                  className={`px-4 py-2 ${numericColumns.has(column) ? "text-right tabular-nums" : ""}`}
                >
                  {formatValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
