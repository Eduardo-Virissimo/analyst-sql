---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components"]
---

# Surface: the chat (src/app/page.tsx and every component it renders)

Mode: Operate. Audience: HR people who do not know SQL; Futures panel as evaluators. Job: ask in Portuguese,
watch the agent work, read and verify the answer, come back to earlier conversations. Constraint: the page
never scrolls, only the messages area. The ASCII jellyfish and the dark charcoal canon were both superseded by
the user (2026-11-17): the user supplied docs/img/cat-icon.png and asked for the whole system to match it.

## Direction contract

THESIS: The interface is the cat icon unfolded into a workspace: the lilac tile becomes the ground, the black head becomes the dark parts, the white eyes become the surfaces. Refuses the neutral grey chat with one accent and the dark neon look.

OWN-WORLD: Light, from the icon. Ground gradient #fbf8ff → #f1eaff → #ddd0ff with blurred blobs of the icon violet #8255fd and lilac #aa89fc plus a white glow; ink #14101c, muted #4f4862, faint #645d77. "Night" scope (#0e0b14, the cat's head) for the sidebar, the user's question bubble and the SQL block. White glossy surfaces with a white top hairline and violet-tinted offset shadows. Action buttons carry the icon's violet gradient (#9a7cff → #7349f8 → #5a2ee6) with a white inner highlight. Accent text #6a3cf5; secondary bars lilac #cdbcfd. Soft radii 16/24/pill. Fredoka 600 for display and the wordmark, Rubik for interface, Geist Mono for SQL and numbers (user asked for two livelier faces on 2026-11-17).

STORY: The visitor meets the cat, which watches the pointer, asks in plain Portuguese, sees the cat read while four safety steps tick off, then reads an answer with a plain-language "Como cheguei aqui" trail and its query one tab away in a black block, and continues with one-tap related questions.

FIRST VIEWPORT: Black sidebar 288px (cat mark + wordmark, Nova conversa with a violet glossy plus, the four window shortcuts, the Hoje/Ontem/Antes list, a "somente leitura" status at the foot). Main area on the lilac sky, column 768px, vertically centred: the 88px cat tile with a violet shadow, a two-line Fredoka heading (violet time-of-day greeting over "O que você quer saber?"), one-line subtitle on desktop (may wrap on phones), a white composer (24 radius) with a glossy violet round send button and cycling example questions, three white example cards with animated mini previews, and a "Ver todas as perguntas prontas" link.

FORM: replacement world pinned by the user's own asset, seed: none (pinned) — "eu botei um cat-icon no img, analisa ele e faz o sistema combinar com ele" / "eu quero q mude tudo". Signature move: the cat's eyes (blink every 6s, follow the pointer on the greeting, scan left-right while the agent works); motion grammar: blur-rise entrances, word-by-word answer, card unfold, bars that grow, modals that scale in from 96%.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
