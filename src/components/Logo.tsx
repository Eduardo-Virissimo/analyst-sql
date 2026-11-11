// Identidade do analyst-sql.
// A marca: um quadrado com o gradiente #0A0A0A → #2B0F6B e três barras de comprimentos
// diferentes (as linhas de um resultado, ou um gráfico de barras visto de lado).
// O nome é sempre em minúsculas e em mono; "-sql" leva a cor do acento.

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-[28%] bg-[linear-gradient(135deg,#0a0a0a,#2b0f6b)] ring-1 ring-inset ring-white/20"
    >
      <svg viewBox="0 0 32 32" style={{ width: size, height: size }} fill="none">
        <rect x="7" y="9" width="8" height="3" rx="1.5" fill="#fff" fillOpacity="0.55" />
        <rect x="7" y="14.5" width="13" height="3" rx="1.5" fill="#fff" fillOpacity="0.8" />
        <rect x="7" y="20" width="18" height="3" rx="1.5" fill="#b36bff" />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-semibold tracking-tight ${className}`}>
      analyst<span className="text-accent">-sql</span>
    </span>
  );
}
