"use client";

import { useState } from "react";
import { formatSql, tokenizeSql, type SqlTokenKind } from "@/lib/ui/sql-highlight";
import { CheckIcon, CopyIcon } from "./Icons";

const KIND_CLASS: Record<SqlTokenKind, string> = {
  keyword: "text-sql-kw font-medium",
  function: "text-warn",
  string: "text-sql-str",
  number: "text-sql-num",
  plain: "text-ink",
};

export default function SqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // navegador bloqueou a área de transferência: ignora
    }
  }

  // elementos React (não HTML cru): o texto da IA nunca é interpretado como HTML
  const tokens = tokenizeSql(formatSql(sql));

  return (
    <div className="relative">
      <pre className="scrollbar overflow-x-auto rounded-control bg-sunken p-4 pr-12 font-mono text-[13px] leading-6">
        <code>
          {tokens.map((token, i) => (
            <span key={i} className={KIND_CLASS[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label={copied ? "SQL copiado" : "Copiar SQL"}
        className="press absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-control text-muted hover:bg-line/60 hover:text-ink"
      >
        {copied ? <CheckIcon className="size-4 text-ok" /> : <CopyIcon className="size-4" />}
      </button>
    </div>
  );
}
