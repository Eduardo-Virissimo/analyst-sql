---
name: analyst-sql
description: A Portuguese-speaking data analyst drawn from its own cat icon, with a lilac sky, black "night" parts and white glossy surfaces.
colors:
  # Day (the lilac tile): :root in src/app/globals.css
  bg: "#f4efff"
  sidebar: "#0e0b14"
  surface: "#ffffff"
  surface-2: "#efe8ff"
  sunken: "#ebe3ff"
  popover: "#ffffff"
  ink: "#14101c"
  muted: "#4f4862"
  faint: "#645d77"
  line: "rgb(64 32 160 / 0.12)"
  line-strong: "rgb(64 32 160 / 0.22)"
  accent: "#6a3cf5"
  brand: "#7349f8"
  brand-strong: "#5a2ee6"
  brand-highlight: "#9a7cff"
  lilac: "#cdbcfd"
  on-brand: "#ffffff"
  ok: "#1e8556"
  warn: "#946000"
  danger: "#d93f33"
  danger-ink: "#b42318"
  sql-kw: "#c4b0ff"
  sql-fn: "#f2cf7a"
  sql-str: "#9fdc8a"
  sql-num: "#f5a58a"
  # Night (the cat's head): the .night scope
  night-bg: "#0e0b14"
  night-surface: "rgb(255 255 255 / 0.06)"
  night-surface-2: "rgb(255 255 255 / 0.11)"
  night-sunken: "#08060c"
  night-ink: "#f4f0ff"
  night-muted: "#b9b1cf"
  night-faint: "#9890ae"
  night-line: "rgb(255 255 255 / 0.08)"
  night-line-strong: "rgb(255 255 255 / 0.16)"
  night-accent: "#c4b0ff"
  night-ok: "#7fdcab"
  night-ok-halo: "rgb(127 220 171 / 0.15)"
  night-warn: "#f2cf7a"
  night-danger: "#ff7a6e"
  night-danger-ink: "#ffb4ab"
  # Sky (the ground behind the conversation)
  sky-top: "#fbf8ff"
  sky-middle: "#f1eaff"
  sky-base: "#ddd0ff"
  sky-blob-violet: "#8255fd"
  sky-blob-lilac: "#aa89fc"
  sky-dot: "rgb(106 60 245 / 0.14)"
  sky-pointer-glow: "rgb(255 255 255 / 0.6)"
  # Gloss, tints and overlays
  gloss-hairline: "rgb(255 255 255 / 0.9)"
  gloss-button: "rgb(255 255 255 / 0.45)"
  shadow-violet: "rgb(76 40 180 / 0.28)"
  shadow-violet-deep: "rgb(76 40 180 / 0.45)"
  shadow-indigo: "rgb(40 18 110 / 0.4)"
  shadow-indigo-soft: "rgb(40 18 110 / 0.2)"
  shadow-brand: "rgb(90 46 230 / 0.6)"
  shadow-brand-hover: "rgb(90 46 230 / 0.5)"
  shadow-brand-mark: "rgb(90 46 230 / 0.55)"
  shadow-night: "rgb(20 10 40 / 0.5)"
  focus-halo: "rgb(115 73 248 / 0.2)"
  selection: "rgb(115 73 248 / 0.25)"
  scrim: "rgb(244 239 255 / 0.6)"
  scrim-clear: "rgb(244 239 255 / 0)"
  mask-solid: "#000000"
  # The cat mark (Logo.tsx, icon.svg)
  cat-head: "#060408"
  cat-head-sheen: "#4a4652"
typography:
  display:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fredoka, ui-rounded, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Rubik, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.75rem"
    fontFeature: "\"ss01\", \"cv11\""
  body-sm:
    fontFamily: "Rubik, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label:
    fontFamily: "Rubik, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1rem"
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
rounded:
  control: "16px"
  card: "24px"
  pill: "999px"
  mark: "28%"
spacing:
  half: "4px"
  "1": "8px"
  "2": "16px"
  "3": "24px"
  "4": "32px"
  "6": "48px"
  "8": "64px"
components:
  button-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    size: "40px"
  button-brand-disabled:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.faint}"
    rounded: "{rounded.pill}"
    size: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    height: "40px"
    padding: "0 8px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  sidebar-row-active:
    backgroundColor: "{colors.night-surface-2}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.control}"
    height: "40px"
  composer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "16px 16px 8px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  user-bubble:
    backgroundColor: "{colors.night-bg}"
    textColor: "{colors.night-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "8px 16px"
  sql-block:
    backgroundColor: "{colors.night-bg}"
    textColor: "{colors.night-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
    padding: "16px 48px 16px 16px"
  badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
  tab:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    height: "48px"
    padding: "0 16px"
  tab-active:
    textColor: "{colors.ink}"
  modal:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 16px 24px 24px"
  question-row:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "8px"
    height: "48px"
  bar-top:
    backgroundColor: "{colors.brand}"
    rounded: "{rounded.control}"
    height: "24px"
  bar:
    backgroundColor: "{colors.lilac}"
    rounded: "{rounded.control}"
    height: "24px"
---

# Design System: analyst-sql

## Overview

**Creative North Star: "The Cat Icon, Unfolded"**

The whole interface is the app icon opened out into a workspace. The icon is a lilac tile, white at the top and violet at the base, with a black cat head and two white eyes. Each part of it has a job on screen. The lilac tile is the ground: a light sky that runs from near-white to soft violet behind the conversation. The black head is the "night": the sidebar, the person's own question bubble and the SQL block are black islands that flip every colour token inside them. The white eyes are the surfaces: cards, the composer and windows are white and glossy, with a white hairline along the top edge and a violet-tinted shadow underneath. The violet at the base of the tile is the action colour, and action buttons use the icon's own violet gradient.

The layout itself stays familiar on purpose. The people using it are HR staff who do not know SQL, so they get the chat they already know: a left rail of past conversations (288px, black), one centred column (768px max), and a composer at the foot. The character comes from the material (lilac sky, black parts, glossy white) and from the cat. The page never scrolls. Only the messages area scrolls, and it fades out over its last 24px instead of being cut off by the composer.

The motion grammar is soft and short, and it always has a reason. Entrances rise 8px out of a slight blur. The cat's eyes blink every 6s, follow the pointer on the greeting, and scan left to right while the agent works. A light runs around the composer's border while an answer is on its way. Answers then appear word by word, the data card unfolds and bars grow. While there is no conversation the sky moves, with blobs orbiting slowly. Once a conversation starts the sky goes quiet, so nothing moves behind the data. With reduced motion turned on, nothing moves at all. The neutral grey chat with a single accent, the dark neon look and the previous dark-charcoal canon are all superseded and rejected for this system.

**Key Characteristics:**
- Light lilac ground (the icon tile); black "night" islands (the cat's head); white glossy surfaces (the eyes).
- The icon's violet gradient on action buttons only, with a white inner highlight.
- Soft radii: 16 / 24 / pill, matching the icon's rounded corners.
- Shadows are always offset downward, blurred and tinted violet or indigo. They are never black.
- Fredoka 600 for headings and the wordmark, Rubik for the interface, Geist Mono for SQL and numbers.
- The cat is the living signature: it blinks, it watches and it reads.

## Colors

The palette is taken from the cat icon, with light lilac neutrals, one violet action family and a black night scope that inverts the neutrals.

### Primary
- **Icon Violet** (brand): fills only. Used on the send button, the "Nova conversa" plus, the current progress step, the active tab underline, the largest bar and the caret. White text on it measures 5.0:1.
- **Deep Icon Violet** (brand-strong): the dark end of the button gradient, and the source of every brand-tinted shadow (shadow-brand*).
- **Gloss Violet** (brand-highlight): the light top of the button gradient (`brand-highlight → brand at 55% → brand-strong`), and the left end of the top bar's gradient.
- **Ink Violet** (accent): violet text and icons on light ground, such as links, the time-of-day greeting, the "-sql" of the wordmark and arrows on question rows. Inside the night it becomes **Night Lilac** (night-accent).

### Secondary
- **Icon Lilac** (lilac): the mid-tone of the icon tile. Used for the non-top chart bars and for the travelling light on the working composer.

### Tertiary
- **SQL inks** (sql-kw, sql-fn, sql-str, sql-num): syntax colours that only ever appear on the night SQL block.
- **Status** (ok, warn, danger, danger-ink, plus their night-* light versions): ok means safe or done, warn marks a key or code, danger-ink marks errors. Each one exists in a dark form for day and a light form for the night.

### Neutral
- **Lilac Ground** (bg): the page and html background, plus the viewport theme colour. The sky paints over it.
- **Sky stops** (sky-top → sky-middle → sky-base): the 180° ground gradient behind the conversation, at 0%, 45% and 100%.
- **Sky blobs** (sky-blob-violet at 0.4 opacity, sky-blob-lilac at 0.35, plus a white blob at 0.9): blurred 96px. These are the icon's violet, the icon's lilac and its shine.
- **Dot grid** (sky-dot): a 1px dot on a 24px grid, masked to an ellipse at the top centre, shown on the greeting only.
- **Pointer glow** (sky-pointer-glow): a 32rem white radial that follows the pointer on the greeting.
- **Eye White** (surface, popover): cards, the composer, windows and the table header.
- **Pale Lilac** (surface-2): active and hover fills, badges, the disabled send button and modal footers (at 60%).
- **Sunken Lilac** (sunken): bar tracks and the example-card preview wells.
- **Ink / Muted / Faint** (ink, muted, faint): text, supporting text, and captions/placeholders. All three pass AA on both bg and surface.
- **Violet hairlines** (line, line-strong): every border and divider is violet-tinted, never grey.
- **Cat Black** (sidebar = night-bg): the night ground. **Night Sunken** (night-sunken) sits below it. Night surfaces are white at 6% and 11% over the black.
- **Overlays**: selection highlight (selection), focus halo (focus-halo, 4px), and the window and mobile-sidebar scrim (scrim, a lilac veil from the tile, with an 8px backdrop blur on windows). Windows fade the scrim in from scrim-clear.
- **Mask channel** (mask-solid): the opaque stop in the dot-grid and messages-fade masks. It is an alpha channel and is never painted as a colour.
- **Cat mark only** (cat-head, cat-head-sheen): the radial fill of the head in the logo and favicon. These colours never appear in the interface.

### Named Rules
**The Icon Mapping Rule.** Every colour role comes from a part of the icon: tile → ground, head → night, eyes → surfaces, base violet → action. A colour that cannot be traced to the icon does not belong in the system.

**The Night Island Rule.** Black appears only through the `.night` scope: the sidebar, the user's question bubble and the SQL block. Inside it, components keep using the same tokens (ink, surface, accent) and the scope swaps their values. Never hand-pick a dark colour for a component.

**The Fill-Not-Text Rule.** brand is for fills. Violet text uses accent (night-accent inside the night), because brand on the lilac ground falls just under 4.5:1 while accent measures 5.4:1.

**The No Stray Hex Rule.** Every literal colour in the CSS or components is a named token above. A new colour must be added to globals.css and here first, with its contrast checked (AA, 4.5:1).

## Typography

**Display Font:** Fredoka (with ui-rounded, system-ui)
**Body Font:** Rubik (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (with ui-monospace)

**Character:** A heavy, rounded display face that is as soft as the cat's silhouette, paired with a precise, neutral interface sans. The mono face is used where exactness matters: SQL, table numbers and chart values.

### Hierarchy
- **Display** (800, 36px on phones / 48px from sm, leading-tight): the greeting only. The violet time-of-day line sits above "O que você quer saber?", balanced and centred.
- **Numeral** (800, 60px, line-height 1, tabular): the big single-value answer, which counts up from 0.
- **Headline** (800, 24px / 32px): window titles.
- **Title** (800, 18px): card titles inside windows.
- **Body** (400, 16px / 28px): the question bubble and the assistant's answer. Composer and subtitle use 24px lines.
- **Body small** (400, 14px / 24px): panels, table, buttons, tabs, progress steps.
- **Label** (400–500, 12px / 16px): badges, captions, timings, record counts, sidebar group names. Sentence case, never uppercase.
- **Code** (Geist Mono 400, 14px / 24px): the SQL block. Tabular figures are used for table numbers and chart values. The wordmark "analyst-sql" is set in the display face (Fredoka 600) in lowercase, with "-sql" in accent.

### Named Rules
**The Heavy Rounded Heading Rule.** Every Fredoka use is weight 600 with -0.01em tracking (`.font-display`). Do not use a lighter Fredoka, and never set running text in it.

**The Scale-Only Rule.** Sizes come only from the Tailwind scale (12, 14, 16, 18, 24, 36, 48, 60). Line heights are multiples of 4. No `text-[15px]`.

## Layout

The page is full-height with no page scroll (`h-dvh`). The sidebar is 288px and black. On desktop it collapses to zero width with a 300ms transition. Below `md` (768px) it becomes an overlay that slides in from the left over a lilac scrim. The main area holds the sky, a scrolling messages region and a fixed composer strip. The conversation column has a 768px max width with 16px side padding, and turns are separated by 48px. Inside a turn, question and answer sit 24px apart. The answer uses a 32px grid gutter for the cat avatar plus a 16px gap. The greeting centres vertically in the same column.

Spacing follows the rule of 8 (spacing tokens): 8, 16, 24, 32, 48 and 64, with 4 allowed only as a half step inside small pieces. Control heights are 32 (only inside a group), 40 (the default and the minimum touch target) or 48. Icons are 16px in text and 20px in buttons. Top strips are 64px. Padding is either equal on all sides or smaller vertically than horizontally. Within one panel, the header, body and footer share the same horizontal padding (24px in windows, 16px in the composer and the result card).

Breakpoints: `sm` 640px (the example cards become three columns, the display steps up, the tag badges appear) and `md` 768px (the sidebar docks).

## Elevation & Depth

Depth here is glossy and lifted. Surfaces sit above the lilac sky on soft shadows that are offset downward with a negative spread and always tinted violet or indigo. Each white surface also carries a white 1px inset hairline at the top edge, which is the shine on the icon. Night pieces keep their own darker shadow. Windows add a scrim and a backdrop blur instead of a stronger edge. The full shadow values are in the sidecar.

### Shadow Vocabulary
- **Card** (inset gloss-hairline + 0 12px 32px -16px shadow-violet): every card, the result card and the example cards.
- **Composer** (inset gloss-hairline + 0 24px 48px -24px shadow-violet-deep): the composer, which is the most lifted object on the ground. On focus it adds the focus halo.
- **Pop** (0 40px 80px -24px shadow-indigo, 0 8px 24px -12px shadow-indigo-soft): windows.
- **Brand button** (inset 0 1px 0 gloss-button + 0 8px 20px -8px shadow-brand): `.btn-brand`.
- **Card hover** (0 20px 40px -20px shadow-brand-hover): the example cards on hover.
- **Mark lift** (0 24px 48px -16px shadow-brand-mark): the 88px cat tile on the greeting.
- **Night bubble** (0 12px 24px -12px shadow-night): the user's question bubble.
- **Status halo** (0 0 0 4px focus-halo / night-ok-halo): the current progress dot, and the read-only dot in the sidebar.

### Named Rules
**The Tinted Shadow Rule.** Shadows are always tinted violet or indigo and offset downward. Never use a black or neutral grey shadow.

**The Gloss Rule.** A white surface that floats on the sky gets the top hairline (inset 0 1px 0 gloss-hairline). This is the icon's shine and the reason the surfaces look like the cat's eyes.

## Shapes

There are three radii, soft like the icon's corners: control (16px) for buttons, rows, the SQL block, bars and wells; card (24px) for cards, the composer, windows and the question bubble; pill for send, badges and status dots. A piece nested inside another takes the outer radius minus the gap between them. The question bubble breaks one corner (bottom-right at 16px) to point at its speaker. The cat mark alone uses 28% corners (mark), because it is a drawing and not an interface piece. Borders are 1px violet hairlines. The active tab is marked by a 2px brand underline.

## Components

### Buttons
- **Shape:** a pill for the primary action (rounded.pill, 40px round); controls use 16px.
- **Primary (`.btn-brand`):** the icon's violet gradient top to bottom (brand-highlight → brand → brand-strong), white icon, white inner highlight and brand shadow. Used on send and on the "Nova conversa" plus. Its arrow lifts 4px on hover. The plus rotates 90°.
- **Hover / Focus:** brightness 1.08 on hover. Every button shrinks to 0.97 on press (`.press`, 150ms). Focus shows a 2px accent outline offset by 2px.
- **Disabled:** pale lilac fill, faint icon, no shadow.
- **Ghost:** transparent with muted text. On hover it fills with surface and the text turns ink (in the night, surface is white at 6%). Small ghost buttons under an answer are 32px high.

### Chips
- **Badge:** a pale lilac pill with 12px muted text and 4px × 8px padding. Used for "3 assuntos" and answer-type tags.

### Cards / Containers
- **Corner Style:** 24px.
- **Background:** surface (example cards use surface at 80%, which becomes solid on hover).
- **Shadow Strategy:** Card shadow, as described in Elevation.
- **Border:** 1px line. On hover, example cards switch to a brand border at 40%.
- **Internal Padding:** 16px. Window cards have a title strip on surface-2/60 and rows divided by hairlines. Nesting stops at two levels, and a card never sits inside another card.

### Inputs / Fields
- **Composer:** a white card with 24px radius, line-strong border and the Composer shadow. The text is 16/24 on 16px padding. Below it sit the "Só consulta" note and the round send button.
- **Focus:** the border becomes brand at 60% and the focus halo joins the shadow.
- **Working:** a conic light (brand, then lilac) travels around the border every 2.4s. With reduced motion, the border is a static brand line instead.
- **Hints:** example questions cycle every 4s in the empty field and rise into place.

### Navigation
- **Sidebar:** the black night island, 288px wide. At the top sit the cat mark (32px) and the wordmark. Rows are 40px with 16px radius and muted text. Hover fills with night-surface and the text turns night-ink. The active conversation uses night-surface-2. Groups are labelled Hoje, Ontem and Antes in 12px faint text. A read-only status with a green dot sits at the foot.
- **Mobile:** an overlay sidebar over the scrim, opened from a 64px top strip.

### Result card
A white card that unfolds from the top (clip-path, 500ms). Tabs at the top are 48px, underlined in brand when active, with the record count on the right. The order is Número, Gráfico, Tabela, and then Busca (SQL), which always comes last. Every tab opens with a one-sentence plain-language explanation.

### Bar chart
Bars are 24px with 16px radius, on a sunken track. The largest bar takes the gradient brand-highlight → brand, and the others are lilac. Bars grow from the left over 600ms, 40ms apart. Values are in mono, tabular, right-aligned.

### SQL block
A night island with 16px radius, Geist Mono 14/24 and syntax colours from the sql-* tokens. A 32px copy button sits in the corner.

### Windows (Modal)
A native dialog with 24px radius, popover background and the Pop shadow. The header holds a Fredoka headline, a one-line intro and a close button. The body scrolls and the footer is optional. Three widths: sm, md and lg. A window opens by scaling up from 96% (300ms) while the backdrop blurs to 8px over the scrim, and closes faster (200ms).

### The cat (signature)
The logo mark and favicon: a lilac tile (sky-top → lilac → sky-blob-violet), the black head and two white eyes. It appears at 88px on the greeting, 32px in the sidebar and beside answers, and 24px in the mobile top strip. The eyes blink every 6s, follow the pointer on the greeting (up to 14/200 of the tile's width) and scan ±14 while the agent works. With reduced motion they stay still.

## Do's and Don'ts

### Do:
- **Do** trace every colour back to the icon (tile, head, eyes, base violet) and name it in globals.css.
- **Do** put dark pieces inside `.night` and keep using the ordinary tokens inside them.
- **Do** give floating white surfaces the top gloss hairline and a violet-tinted, downward shadow.
- **Do** keep spacing on the rule of 8 (4 only as a half step) and radii to 16 / 24 / pill.
- **Do** use `.btn-brand` for the primary action and nowhere else as decoration.
- **Do** quiet the sky once a conversation starts (blobs pause and fade to 0.2, the grid and pointer glow disappear), so nothing moves behind data.
- **Do** keep entrances to an 8px rise out of a blur on `--ease-out`, and state changes to 150ms on `--ease`. Make every animation stop under reduced motion.

### Don't:
- **Don't** use a black, neutral grey or untinted shadow.
- **Don't** add a fourth radius, `rounded-lg`/`xl`/`2xl`, or a loose `[13px]` value (the 28% cat tile is the only exception).
- **Don't** use brand as text colour on the lilac ground. Use accent.
- **Don't** hand-pick a dark hex for a component. Use the night scope.
- **Don't** let anything move because of scroll, or loop an animation behind the data after the conversation starts.
- **Don't** use gradients or coloured glows inside window cards. Every shape in a window must carry information.
- **Don't** bring back the dark charcoal theme or a dark neon look.
