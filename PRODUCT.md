# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** people in HR / people management who do not know SQL or databases. They ask everyday
  questions about the workforce ("Quantos colaboradores trabalham em cada setor?") and need a trustworthy
  answer in plain Portuguese, usually at a desk, between other tasks.
- **Evaluators:** the Softplan Futures program panel, who review the project as a portfolio piece. They
  care that it works, that it is safe, and that the craft is visible.

## Product Purpose

analyst-sql is a Text-to-SQL agent: the person writes a question in Portuguese, an AI writes a SQL query,
a validator checks it, it runs read-only on MySQL, and the AI explains the result in plain language with a
table, a chart or a single big number. Success: a non-technical person gets a correct, checkable answer
without learning SQL, and never fears breaking anything.

## Positioning

Safety in layers made visible: prompt rules, a SQL validator (SELECT only, table allowlist, row limit), a
read-only database user and a READ ONLY transaction. The interface shows each step of the agent live and
always exposes the exact query that ran, so the answer can be verified.

## Operating Context

- Single-page chat: a sidebar with past conversations (saved in the browser) and shortcuts to the four windows; a
  greeting with the question field and example chips, then a conversation of turns.
- Each turn streams progress (writing the query, checking, querying, explaining), then the answer with
  tabs (Número / Gráfico / Tabela / Busca (SQL)) and a footer with duration and retry attempt.
- Four windows: Perguntas prontas, Ajuda, Dados (diagram of the database), Sobre.
- Sample database: HR data (colaboradores, setores, vínculos).

## Capabilities and Constraints

- Next.js 16 + React 19 + TypeScript + Tailwind 4. No extra UI libraries.
- Interface copy in Portuguese, written for people who do not know SQL or AI ("busca", "assuntos",
  "informações", "registros"; technical words explained; translations in `src/lib/ui/friendly.ts`).
- The page itself does not scroll; only the message area scrolls.
- Keep the code simple and easy to learn from ("arroz com feijão bem feito").
- Nothing may weaken the security layers.

## Brand Commitments

- Name: `analyst-sql`, always lowercase.
- Brand mark and visual world: the **cat** in `docs/img/cat-icon.png` (black cat head, white eyes, lilac tile),
  provided by the user on 2026-11-17 and redrawn as SVG. The whole interface follows it: lilac ground, black parts
  like the head, white surfaces like the eyes, the icon violet for actions; Fredoka for headings, Rubik for text.
- Rejected looks: the ASCII jellyfish background and the neutral dark charcoal chat; do not bring them back.

## Evidence on Hand

- Real screenshots of the current UI in `docs/img/`.
- Evaluation set in `eval/questions.json`.
- No users, testimonials or metrics exist; do not invent them.

## Product Principles

1. The answer is checkable: the query that ran is always one click away.
2. Plain Portuguese first; jargon only in parentheses, always explained.
3. Safety is shown, not claimed: each layer is visible in the progress and the Sobre window.
4. Calm over clever: the person should feel safe asking anything.

## Accessibility & Inclusion

WCAG AA contrast (4.5:1) for all text, 40 px minimum touch targets, keyboard and screen-reader access, and
no motion when the user asks for reduced motion.
