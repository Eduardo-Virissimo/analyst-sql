import type { SVGProps } from "react";

// Só os glifos usados. Traço fino, herdam a cor do texto.
const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

type IconProps = SVGProps<SVGSVGElement>;

export const ArrowUpIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
  </svg>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 17L17 7M8.5 7H17v8.5" />
  </svg>
);

export const ChevronIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6.5A2.5 2.5 0 017.5 4H16" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export const DatabaseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
    <path d="M4.5 5.5v13c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
    <path d="M4.5 12c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const LockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" />
  </svg>
);

export const BuildingIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 20V5.5A1.5 1.5 0 016.5 4h7A1.5 1.5 0 0115 5.5V20M15 9h2.5A1.5 1.5 0 0119 10.5V20M3 20h18" />
    <path d="M8.5 8h3M8.5 12h3M8.5 16h3" />
  </svg>
);

export const GraduationIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z" />
    <path d="M6.5 11.8V16c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.2M21.5 9.5V15" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const ExitIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M14 4.5H7A2 2 0 005 6.5v11a2 2 0 002 2h7" />
    <path d="M10 12h10M16.5 8.5L20 12l-3.5 3.5" />
  </svg>
);

export const HelpIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.4a2.5 2.5 0 114 2c-.8.6-1.6 1-1.6 2.1M12 16.6v.01" />
  </svg>
);

export const ChatIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 5.5h14a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0119 16.5h-7l-4.5 3.5v-3.5H5A1.5 1.5 0 013.5 15V7A1.5 1.5 0 015 5.5z" />
  </svg>
);

export const ChartIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-5M12.5 16V8M17 16v-3" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SparkIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5z" />
    <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
  </svg>
);

export const InfoIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.6v.01" />
  </svg>
);

export const UsersIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19c.4-3 2.6-4.8 5.5-4.8s5.1 1.8 5.5 4.8" />
    <path d="M15.5 5.6a3 3 0 010 5.8M17 14.5c2 .5 3.2 2 3.5 4.5" />
  </svg>
);

export const ContractIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 3.5h7l4 4V19a1.5 1.5 0 01-1.5 1.5h-9.5A1.5 1.5 0 015.5 19V5A1.5 1.5 0 017 3.5z" />
    <path d="M14 3.5V8h4M8.5 12.5h7M8.5 16h5" />
  </svg>
);

export const ShuffleIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h3.5c2 0 3 .9 4.2 2.6l1.6 2.8c1.2 1.7 2.2 2.6 4.2 2.6H20M4 17h3.5c2 0 3-.9 4.2-2.6M13.3 9.6c1.2-1.7 2.2-2.6 4.2-2.6H20M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6.5L18.5 12 13 17.5" />
  </svg>
);
