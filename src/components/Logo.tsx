"use client";

// Identidade do analyst-sql: o gato. Um quadrado lilás (claro em cima, violeta embaixo) com a cabeça de um gato
// preto e dois olhos brancos, redesenhado em SVG a partir de docs/img/cat-icon.png.
// Os olhos são a parte viva: piscam de vez em quando; enquanto o agente trabalha (`working`), olham de um lado para
// o outro, como quem lê os dados; com `follow`, seguem o ponteiro. Com "reduzir movimento", ficam parados.
// O nome é sempre em minúsculas, na fonte dos títulos; "-sql" leva a cor do acento.
import { useEffect, useId, useRef } from "react";

interface LogoMarkProps {
  size?: number;
  /** olhos lendo de um lado para o outro (o agente está trabalhando) */
  working?: boolean;
  /** olhos seguem o ponteiro (a tela inicial) */
  follow?: boolean;
}

// o contorno da cabeça e o centro de cada olho, numa caixa de 200 × 200
const HEAD =
  "M54 46C57 38 61 31 66 30C71 29 75 40 86 48L122 47C131 40 135 30 140 29C145 28 149 37 153 47C161 66 167 94 165 124C163 156 136 175 92 175C58 175 38 166 34 144C30 120 37 76 54 46Z";
const EYES = [
  { cx: 66, cy: 112 },
  { cx: 108, cy: 109 },
];

export function LogoMark({ size = 32, working = false, follow = false }: LogoMarkProps) {
  const id = useId().replace(/:/g, "");
  const eyes = useRef<SVGGElement>(null);

  // seguir o ponteiro: calcula a direção do centro do gato até o ponteiro e desloca os olhos (no máximo 14 de 200)
  useEffect(() => {
    if (!follow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    function look(event: PointerEvent) {
      const g = eyes.current;
      const svg = g?.ownerSVGElement;
      if (!g || !svg) return;
      const box = svg.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const length = Math.hypot(dx, dy) || 1;
      const reach = Math.min(length / 240, 1) * 14;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        g.style.transform = `translate(${(dx / length) * reach}px, ${(dy / length) * reach * 0.7}px)`;
      });
    }
    window.addEventListener("pointermove", look);
    return () => {
      window.removeEventListener("pointermove", look);
      cancelAnimationFrame(frame);
    };
  }, [follow]);

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${working ? "cat-working" : ""}`}
    >
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf8ff" />
          <stop offset="0.5" stopColor="#cdbcfd" />
          <stop offset="1" stopColor="#8255fd" />
        </linearGradient>
        <radialGradient id={`${id}-head`} cx="0.5" cy="0.95" r="0.7">
          <stop offset="0" stopColor="#4a4652" />
          <stop offset="0.55" stopColor="#060408" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" rx="56" fill={`url(#${id}-tile)`} />
      {/* um fio branco por dentro (o brilho) e um fio violeta por fora, para a borda aparecer no fundo claro */}
      <rect x="3" y="3" width="194" height="194" rx="53" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="0.5" y="0.5" width="199" height="199" rx="55.5" fill="none" stroke="#5a2ee6" strokeOpacity="0.25" />
      <path d={HEAD} fill={`url(#${id}-head)`} />
      <g ref={eyes} className="cat-look">
        <g className="cat-eyes">
          {EYES.map(({ cx, cy }) => (
            <ellipse key={cx} cx={cx} cy={cy} rx="11" ry="20" fill="#fff" transform={`rotate(-8 ${cx} ${cy})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display tracking-tight ${className}`}>
      analyst<span className="text-accent">-sql</span>
    </span>
  );
}
