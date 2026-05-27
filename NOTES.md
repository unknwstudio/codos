# Overnight autonomous run — NOTES

Reviewer log. One commit per numbered task. Build + typecheck kept green after each.

---

## Task 0 — remap literal tokens to semantic, reconcile to /ds scale

### Root cause — CONFIRMED (with a correction)
The prompt's hypothesis was "/ds and live pages use different sizes/spacing, so
literal tokens got invented to bridge." After auditing, the picture is:

1. **The literal color tokens were a THEMING gap, not a scale gap.** The eight
   literal tokens (`--color-gray-200/400`, `--color-white-10/04/02`,
   `--color-orange-400/500`, `--color-black`) were invented in the *uncommitted*
   DownloadPage change to tokenize a **dark** page while the semantic layer only
   had the **light/editorial** theme. The fix is a proper semantic **dark theme**
   (`.theme-dark`) overriding the same semantic vars — real theming, not literals.
2. **The scale mismatch is real and lives in `EditorialLanding.tsx`.** That file
   (1567 lines) is 100% inline-styled hardcodes (`const ACCENT='#F26B1F'`, a local
   `S` style object, `maxWidth:1180`, px font sizes, `rgba(0,0,0,0.08)`…). It never
   adopted tokens or the /ds scale at all. So "live page uses different sizes" =
   EditorialLanding's inline values vs the /ds token scale. The correct fix is to
   make /ds the source of truth and have the page consume tokens.

### Decisions
- **Fonts reconciled to reality + Figma brand.** `/ds` text already *claimed*
  "headlines = GT Alpina Typewriter, body/UI = DM Mono", but the tokens actually
  pointed `--font-headline`→Fraunces and `--font-body`→Urbanist (stale from the
  "rebase to real values" commit). The new Figma frames use **GT Alpina Typewriter**
  (already `@font-face`'d in tokens.css — this is the "Browser"/already-wired font
  the prompt refers to) for headlines and **DM Mono** for body/UI. Pointed
  `--font-headline`→GT Alpina Typewriter and `--font-body`→DM Mono. Now tokens, /ds
  text, and Figma all agree.
- **Figma canvas `#f7f1e9` ≈ existing `--color-cream` `#f5f1ea`** (RGB delta is
  invisible). Mapped to `--color-bg` rather than introducing a near-duplicate token.
- **Figma `#000` text → `--color-text` (`#1a1a1a` product ink)**, not pure black —
  the established product value reads better and is already the text role.
- **New semantic tokens added** (real roles /ds lacked, added to BOTH tokens + /ds):
  - `--color-panel` (#d9d9d9) — the neutral product-mock panel surface used by the
    diagnostic & graph mock UIs.
  - `--color-highlight` (#ffe100) + `--color-highlight-contrast` — the yellow
    "judge" accent card in the context graph.
  - `--color-status-live` (#00C22D) — the live/"Listening" status dot.
  - `--text-intro` (fluid → 30px) — the large DM-Mono subhead/intro size.
  - `--text-label` (fluid → 15px) — the uppercase mono eyebrow/label size.
- **Type scale reconciled to the real brand sizes as fluid `clamp()`s.** The Figma
  designs need a 130px hero display and 60px section headlines — far above the old
  4rem/2.75rem. Rather than invent per-page sizes, the /ds role tokens
  (`--text-display/h1/h2/h3/h4/body*`) were rescaled to the brand and made fluid so
  one scale serves every viewport. (Task 5 extends fluid responsiveness to page
  layouts/containers across all pages and visualizes the clamped scale in /ds.)
- **Dark theme** added as `.theme-dark` (overrides semantic vars). `DownloadPage`
  now applies `theme-dark` and consumes only semantic utilities — no literals.
- Deleted all 8 literal tokens. Verified DownloadPage was their only consumer.

### Sequencing note
EditorialLanding's full inline→token migration happens progressively: the hero
(T1), diagnostic (T3) and graph (T4) sections are rebuilt token-driven from Figma,
and T5 does the site-wide responsive pass. T0 establishes the correct token layer +
fixes the literal-token consumer (DownloadPage) + makes /ds accurate.

### Figma access note
The remote `claude.ai Figma` MCP is authed as `mikki@pink-man.ru`, which lacks
access to the "Brand" file → used the **local Figma Dev Mode MCP** at
`127.0.0.1:3845` (the one the prompt pointed to) via a small JSON-RPC/SSE helper.
Assets written to `public/assets/figma/{hero,diagnostic,graph}/`. The particle PNG
is byte-identical across all three frames (one shared asset).

---

## Task 1 — new hero from Figma (33:78)

- Built a new full-bleed `Hero` component in `EditorialLanding.tsx`, replacing both
  the old top nav and the old centered hero. Split "install / evolution" headline
  (GT Alpina Typewriter via `--font-headline`), the particle cloud centerpiece, a
  DM-Mono lede, dual CTAs (filled + outline), logo top-left, nav top-right, and a
  numbered credentials list bottom-left — matching the frame.
- **Everything is token-driven** via `var(--…)` inside inline styles (the page's
  existing styling convention): `--text-display/intro/body-*`, `--space-*`,
  `--color-bg/text/accent/surface/border-strong/faint`, `--radius-full`, fonts.
  No raw Figma px/hex.
- Adaptations (noted, faithful to intent): Figma's bottom-left vector wordmark
  (`Frame 23`) → a real, legible numbered credentials list built from `COPY`
  (responsive + maintainable vs. a 40KB glyph trace); the off-frame decorative
  vectors (43/51/63/65, all at x≥1984 outside the 1920 frame) → omitted; window/
  status dots and panel chips → CSS, not exported SVGs. Logo + particle cloud are
  the only retained Figma raster/vector assets.
- Hero headline button text uses `--text-body-lg` (≤20px), not the literal Figma
  30px — 30px was oversized for real viewports; the token reads correctly fluid.
- **Responsive**: verified at 1440 / 1280 / 500px. Headline splits row→column,
  particle re-anchors, lede wraps (overflowWrap). Lowered `--text-display` clamp
  floor to 2.25rem so the headline fits narrow widths. (Note: headless Chrome
  floors window width at 500px, so true ~375px relies on the clamp + wrap; final
  small-mobile pass is Task 5.)
- Perf note: `particles.png` is 2.6MB (detailed pointillist cloud). Acceptable for
  now; a WebP/downscaled variant would be a good follow-up optimization.
- `LogoPill` is now unused (old backers strip removed) but left in place; harmless
  (tsconfig has no noUnusedLocals).

---

## Task 2 — particles scroll animation

- Added a scroll-driven effect inside `Hero`: as the page scrolls through the
  hero, the particle cloud drifts so its centre converges on the **viewport centre**
  and **scales down** (1 → 0.45), tied to scroll progress `p = scrollY / heroHeight`
  with a `smoothstep` ease. After the hero-height of scroll it releases and scrolls
  away naturally (no permanent overlay).
- Lightweight per the brief: a single passive `scroll` listener + `requestAnimationFrame`,
  writing only `transform` (translate + scale) on the one element. Geometry uses
  `offsetTop`/`offsetHeight` (layout metrics, transform-independent) so it's stable.
- `prefers-reduced-motion: reduce` → effect is skipped entirely (particle stays put).
- Verification: confirmed correct via an injected debug readout (at scrollY≈600 the
  particle rect was top183→bottom689, scale 0.49 — i.e. centred and shrunk). NOTE:
  headless-Chrome screenshots of mid-scroll states intermittently render the 2.6MB
  PNG blank (cold-load decode race under virtual-time); this is a screenshot
  artifact, not a runtime bug — real browsers paint it (decode once, cached).

---

## Task 3 — diagnostic section, remove switcher

- **Killed the switcher entirely.** Deleted `ProductShowcase` (the interviews/
  graph/transformation tab UI + its `tab` state) and the whole tree it exclusively
  used: `VoiceOrb`, `InterviewMock`, `ContextGraphMock`, `AccountReviewMock`,
  `ScrollableMock`, `NodeBox`, `useTween`, `TweenedFigure`, `TweenedHeadcount`,
  `PilotMetric` (~860 lines of now-dead code). Confirmed via grep none were used by
  any kept section before deleting. Removed the now-unused `useMemo` import.
- Built a flat `DiagnosticSection` matching Figma 55:2 — no tabs, no state:
  `_stepOne` kicker + "A listening agent — not a form." tagline (left), the mixed
  headline "conduct diagnostic.Interviews" (verb in headline face, method in DM
  Mono) (right), and a live interview mock panel (window dots, centred
  label/session, "Listening" status pill, the particle orb, "CODOS AI" chip,
  centred transcript quote, footer controls).
- Shared primitives added for reuse by the graph section: `Chip`, `StepHeader`
  (the two-column `_stepN` + verb/method header), and a `Dot`. All token-driven
  (`--color-panel/panel-chip/status-live`, `--text-h1/h4/intro/caption`,
  `--space-*`, `--radius-*`, fonts) — no raw hex/px.
- Verified visually by rendering the section in isolation (clean match to 55:2).
  Added a stable `data-section="diagnostic"` hook on the section.

---

## Task 4 — context graph redesign

- Built `ContextGraphSection` per Figma 55:22: shared `StepHeader` (`_stepTwo` +
  tagline left, "setting contexts.Graph" + "Every signal, routed, deduped, written
  to record." right), then a top-down data-flow graph:
  `.sources` → `.raw-data` → 4 `observer` cards (.people/.product/.operations/
  .market) → the yellow `company-merge-judge` highlight node → 3 `vault` cards
  (.company/.engagement/.working-memory), joined by vertical `GraphLink` connectors.
- `GraphCard` (kicker + title + white chips) and the yellow node use the new
  `--color-highlight` / `--color-panel` tokens; chips reuse the shared `Chip`. The
  graph is right-biased (76% width, margin-left:auto on desktop) and the multi-card
  tiers use `auto-fit minmax` grids so they reflow 4→2→1 with no breakpoint code.
- **"particles 1" on the LEFT**: a standalone static `<img>` positioned left and
  partially off-canvas, behind the graph (z-index 0). **No conflict with the hero
  particle animation** — that effect targets the hero `<img>` *by ref*, never by a
  selector, so this second instance is independent. On mobile it drops to opacity
  0.22 as a faint backdrop so the cards stay legible.
- Faithful adaptation: the Figma frame draws the edges as many absolute SVG vectors
  (node-positioned, non-responsive). Replaced with semantic vertical connectors +
  flow order, which preserves the "routed/deduped → record" reading and stays fluid.
- Verified in isolation at 1440 and 500px (clean match; cards reflow correctly).

---

## Task 5 — full responsive + fluid type clamping

- **Fluid type scale**: already clamp()-based in tokens since Task 0
  (`--text-display/h1/h2/h3/h4/intro/body-lg/body/body-sm/label`). This task makes
  it visible + applied. Headline and body sizes scale smoothly with the viewport.
- **Layout tokens added** (single source for breakpoints + fluid layout):
  `--bp-sm/md/lg`, `--page-max` (90rem — a generous cap, **not** a lock),
  `--page-gutter` (`clamp(1.25rem,4vw,4rem)`), `--section-y` (`clamp(3.5rem,7vw,7rem)`).
  Also `--radius-lg/xl`. The JS `useIsMobile(760)` breakpoint mirrors `--bp-md`.
- **De-containerized EditorialLanding**: the hard `maxWidth:1180` + fixed `0 48px`
  gutter is gone — `S.inner` now uses `--page-max` + the fluid `--page-gutter`, and
  the dropped `innerStyle` px-override. All section vertical paddings (the discrete
  `isMobile ? 56px : 80px` etc.) → the fluid `--section-y`. `S.wrap`/`S.body` colors
  tokenized; `S.body` size → fluid `--text-body`.
- **DownloadPage**: heading → fluid `text-h1` token (was `text-4xl md:text-6xl`).
  Container (`max-w-4xl mx-auto`, `px-4 sm:px-6 lg:px-8`) is already fluid/responsive.
- **/ds updated** to show the responsive/clamped scale: header + type-section notes
  state the sizes are fluid `clamp()`s (the live computed value updates on resize),
  plus a new "Responsive layout" section listing `--page-max/--page-gutter/
  --section-y/--bp-*`.
- **Audit of all pages** (mobile → wide desktop):
  - `QuizPage`, `EngQuizPage`, `ReportPage`: already mobile-first Tailwind-responsive
    (centered `max-w-2xl`/`max-w-md` columns, `flex-col md:flex-row`, `md:` guards).
    The scary fixed widths are **decorative background glows** (absolute,
    `pointer-events-none`, clipped by `overflow-hidden`) and breakpoint-guarded
    `md:w-[340px]` panels (stack on mobile) — no real overflow. Verified the quiz
    renders clean at 500px. These pages intentionally use a **separate dark "app"
    type system** (Space Grotesk / Plus Jakarta / JetBrains Mono); migrating them
    onto the editorial clamp scale would change their look and is out of scope —
    flagged as a possible future unification.
  - `CTAFormModal`: already responsive (`width:100%`, `maxWidth:640`, `maxHeight:88vh`,
    `overflowY:auto`, mobile-aware padding). No change needed.
  - Legacy EditorialLanding marketing sections (approach/who/build/team/faq) keep
    their bespoke 2-step `isMobile` heading sizes (already adaptive); the canonical
    fluid scale governs the redesigned brand surfaces + /ds + DownloadPage. Migrating
    the legacy headings onto the coarser 3-step token scale would alter their
    established hierarchy, so left as a deliberate follow-up.

### Headless-screenshot caveat (for morning QA)
Chrome headless floors the window width at ~500px and intermittently fails to paint
the 2.6MB particle PNG on cold mid-scroll loads (virtual-time decode race). So a few
verification screenshots came back blank even though the DOM/rects were correct
(proven via injected debug readouts). None of this affects real browsers. Worth a
quick manual pass at a true ~375px width in the morning.

---

## Revision round (post-review feedback)

Implemented the requested changes + the updated Figma frame 61:793 (the graph
infographic with its connector paths):

- **Logo**: fixed `logo.svg` (`preserveAspectRatio="none"` → proper intrinsic
  `width/height`, no more distortion) and halved the hero logo size
  (`clamp(24…38px)` → `clamp(13…19px)`).
- **Partner logos**: replaced the numbered text credentials with the real wordmarks
  from `/assets/logo/` (mckinsey, meta, `Union.svg` = cyber·Fund, everclear) under a
  "Backed by builders from" eyebrow. Per-logo height factors normalize their optical
  sizes.
- **Hid sections**: removed the `FeelingSection` ("The feeling") and the
  `We help you become AI-native.` approach section (`#solution`) entirely; dropped
  the now-dead "Solution" nav link.
- **Alignment**: refactored the shared header into `StepSection` — the section's
  visual (`children`) now lives in the **right column**, so the diagnostic card
  aligns under "conduct" and the graph aligns under "setting" (not under the step
  kicker). Mobile stacks as before.
- **Graph rebuilt to 61:793 with connector paths**: `GraphDiagram` reproduces the
  native 1153×777 composition — nodes positioned by % of the design box, sized in
  container-query units (`cqw`) so the whole diagram scales as one unit, and the
  branching connectors drawn in a shared-coordinate `<svg>` (converge sources→raw,
  fan raw→observers, converge observers→judge, fan judge→vaults). `min-width: 38rem`
  keeps it legible; it scrolls horizontally on phones (dense desktop diagram).
- **Particle (graph)**: now on the LEFT, vertically centred and **fully visible**
  (no awkward crop); faint backdrop on mobile. Still a standalone `<img>`, so no
  conflict with the hero particle's ref-based scroll animation.
- Authored the connectors rather than wiring the exported Figma edge SVGs (the
  export's name→file hash mapping is fragile, and fixed absolute SVGs wouldn't be
  responsive); the authored curves match the frame's converge/fan pattern and align
  perfectly because they share the node coordinate space. Verified diagnostic + graph
  in isolation at 1440 and 500px.

---

## Revision round 2 — full-bleed + redesign all sections

- **Removed the container.** Dropped the `innerStyle`/`S.inner` max-width wrapper;
  every section is now edge-to-edge like the hero, padded by the fluid
  `--page-gutter` and `--section-y` rhythm (new `SECTION` style + `StepSection` now
  carries its own gutter). Only body paragraphs keep a readable `ch`/`rem` measure
  (same as the hero lede).
- **Redesigned every remaining section in the new language** (GT Alpina headlines +
  DM Mono body + `--color-panel` cards + chips + orange accent), via two new shared
  primitives: `SectionHead` (mono accent kicker + GT Alpina headline + optional sub)
  and `Panel` (token card surface):
  - **Who it's for** → 3 panel cards, range as a `Chip`, GT Alpina name, mono body.
  - **Build it yourself** → a single panel comparison (Metric / Build-it-yourself
    struck-through / With-Codos w/ accent dot); stacks to 2-col on mobile.
  - **How it works** → panel cards with accent `01/02/03`, time `Chip`, GT Alpina
    title, mono body (kept the intersection-observer fly-in).
  - **Team** → founder panel cards (photo, GT Alpina name, mono accent role, bio).
  - **FAQ** → accordion with GT Alpina questions + accent `+`, mono answers.
  - **Closing CTA** → an inverted dark panel (`className="theme-dark"`, so it uses the
    semantic dark tokens) with the particle cloud as a backdrop, a mixed
    "Ready to run your business `like code?`" headline, and hero-style buttons.
  - **Footer** → logo + mono links, full-bleed.
- Verified Who/Build/How/Team/FAQ/Closing in isolation at 1400 and 500px (the long
  page's lower sections don't paint in full-page headless captures — the 4 particle
  PNGs choke the virtual-time paint — so I rendered the lower half at the top to
  confirm; DOM/scroll metrics confirmed the full 8071px page is intact).
- Dead code left behind (harmless, no `noUnusedLocals`): `CodosLogo`, `LogoPill`,
  the `S` style object's legacy keys, `ACCENT`, and a few now-unused `COPY` fields —
  candidates for a later prune.

---

## Polish round — scroll reveals, button hovers, /ds motion

- **Motion tokens** added to tokens.css (`--ease-out`, `--ease-spring`,
  `--duration-fast/base/slow`) — the single source for all transition timing.
- **Scroll reveals**: new `Reveal` component (IntersectionObserver → fade + lift +
  slight blur, `--duration-slow`/`--ease-out`, staggered via a `delay` prop). Wraps
  the section headers + cards across diagnostic/graph/Who/Build/Team/FAQ/Closing
  (HowItWorks kept its existing fly-in). Honours `prefers-reduced-motion` (shows
  immediately). Verified it settles to the visible state.
- **Button + affordance hovers**: class hooks in `index.css` (inline styles can't do
  `:hover`) driven by the motion tokens — `.lp-btn` (lift + shadow; `--filled`,
  `--outline`, `--accent` variants), `.lp-link` (accent on hover), `.lp-card`
  (lift + shadow on Who/How/Team panels), `.lp-logo` (opacity), and `.lp-faq`
  (summary accent + the `+` rotating to `×` on open). All disabled under
  `prefers-reduced-motion`. Applied to hero/nav/closing buttons, nav+footer links,
  partner logos, FAQ rows, and the panel cards.
- **/ds updated**: a new **Motion** section listing the motion tokens with a live
  hover-button demo + a replayable scroll-reveal demo; ds.css transitions
  re-pointed at `--duration-fast`/`--ease-out` (no more hardcoded `0.15s ease`).

---

# Overnight polish pass — 2026-05-27 (items 1–10)

One commit per numbered item; build + typecheck kept green after each. Every value
goes through a token; any new value is added as a semantically-named token.

## Item 1 — tighten global page inset by 30%

- **Single token confirmed**: `--page-gutter` (tokens.css) is the one left+right rail.
  `SECTION` (`padding: var(--section-y) var(--page-gutter)`) and `StepSection`
  (spreads `SECTION`) drive every `<section>` from it; `S.inner` also references it.
- Reduced it 30% across the whole fluid clamp (each stop × 0.7):
  `clamp(1.25rem, 4vw, 4rem)` → `clamp(0.875rem, 2.8vw, 2.8rem)`. Kept as ONE token,
  kept fluid — no per-section padding touched.
- Verified: grepped all horizontal insets in `EditorialLanding.tsx`. Every
  `<section>` resolves its left/right rail to `--page-gutter`. The **only** exception
  is the hero, which still used `--space-5/--space-8` — that's item 2's target, not a
  per-section override of the inset.

## Item 2 — align all sections to one left rail

- **Root cause**: the hero set its own gutter `isMobile ? var(--space-5) : var(--space-8)`
  (≈48px desktop) while every `<section>` used `--page-gutter` (a different, fluid
  value). So the hero headline/body/buttons and the diagnostic `_stepOne` block sat
  on two different left rails.
- **Fix**: hero `gutter` now = `var(--page-gutter)` — the same single inset token.
  The hero header, headline and lower-content blocks all reference `gutter`, so the
  whole hero now shares the exact left/right rail of every section (and stays fluid,
  since `--page-gutter` is itself a clamp).
- Verified by construction: hero content box left = `--page-gutter`; `StepSection`'s
  grid (no extra padding/margin) starts its first column — the `_stepOne` block — at
  the section's `--page-gutter` left. Same token ⇒ same edge. One inset, no exceptions.

## Item 3 — vertically center hero particles

- The particle was top-anchored (`top: clamp(2rem,4vw,5rem)` desktop / `40%` mobile),
  so it sat high/low rather than centred.
- **Fix (proper centring, no hardcoded offset)**: `top: 50%` +
  `transform: translate(-50%, -50%)`. That mid-line anchor + half-size pull-back is
  exact vertical centring at any particle size/viewport.
- **Kept the scroll drift working**: the Task-2 effect overwrites `transform` each
  frame, so it now writes `translate(-50%, calc(-50% + <drift>px)) scale(...)` —
  i.e. the −50% centring baseline is preserved and the scroll drift is added on top.
  At rest (scrollY 0 → drift 0) it resolves to `translate(-50%, calc(-50% + 0px))`,
  identical to the CSS base, so there's no jump on mount.
- Geometry simplified accordingly: with `top:50% + translateY(-50%)` the rest visual
  centre equals `offsetTop`, so `naturalCenterAtEnd = offsetTop − heroH` (dropped the
  now-incorrect `+ offsetHeight/2` term). `prefers-reduced-motion` still short-circuits
  the effect, leaving the centred CSS base.
- Verification: no scriptable headless browser is installed (no puppeteer/playwright)
  and NOTES already records the particle PNG failing to paint in headless captures, so
  this was verified by geometry/derivation rather than a screenshot; flagged for the
  morning manual pass.

## Item 4 — particles underlay diagnostic card

- **What "it" was**: the diagnostic section's single particle blob rendered as an
  inline centred orb inside the card's flex flow (an isolated focal image floating in
  the card's empty middle). Moved that same instance to *underlay* the grey card.
- **How**: the grey card is now `position: relative; overflow: hidden; isolation:
  isolate`. The particle is an absolute, centred child with `z-index: -1`. Because the
  card now forms its own stacking context, `z-index:-1` paints **above the grey fill
  but below every content child** — so the blob sits *within* the grey card, behind
  the header / agent tag / transcript / footer, and is clipped to the card (no longer
  floating in the gap before it). Card content needed no z-index changes.
- **No hero conflict**: this is a standalone `<img>` with no `ref` and no
  `data-hero-particles`; the hero's scroll animation only ever targets its own element
  by `ref`, so the two particle instances are fully independent.
- Removed the now-redundant inline orb `<img>`; kept the "CODOS AI" agent tag, which
  reads cleanly against the backdrop (it carries its own `--color-panel-chip` fill).
- Sizing/styling token-driven (`clamp(240px,62%,480px)`, `--color-panel`, radii); the
  one literal is `opacity: 0.9`, a presentational layer constant consistent with the
  other particle instances (graph 0.95 / closing 0.55), not a themeable color/space.

## Item 5 — data-driven node diagram with computed edge anchors

- **Before**: connectors were hand-placed. Source→raw lines fanned from five *guessed*
  x-values `[345,470,577,690,810]` that corresponded to nothing in the geometry; node
  heights were never modelled (loose `Y` constants), so anchors only approximately met
  the boxes.
- **After**: one `N` table holds every node's full box geometry (`x,y,w,h`) in design
  units + its content — the single source of truth. The boxes are rendered from it
  (`pct(n)` → left/top/width/height) AND the edges are **computed** from it:
  - `edges` is a list of `[parent, child]` relationships (data, not coordinates).
  - each path runs `bottomMid(parent) → topMid(child)`, i.e. the exact midpoint of the
    parent's bottom side to the midpoint of the child's top side.
  - the SVG shares the node coordinate system (`viewBox 0 0 1153 777` +
    `preserveAspectRatio="none"`), which maps 1:1 to the `%`-positioned boxes, so an
    anchor at design `(x,y)` lands precisely on the box edge at that point.
  Because the curve `M a C (a.x,my) (b.x,my) b` puts control points on the midline,
  every connector is a clean, consistent vertical S-curve.
- Result: lines stay attached to the correct box edges and will follow automatically if
  a node's `x/y/w/h` changes — no second set of coordinates to keep in sync. Still pure
  SVG, no new dependency, no canvas. Styling token-driven (`--color-border-strong`,
  `--color-panel`, `--color-highlight`, cqw sizes). Node heights (111/120) match the
  Figma tiers and the cqw-scaled content fits within them at the min-width and up.

## Item 6 — comparison table fixes

- **Strikethrough removed**: the "Build it yourself" column dropped
  `textDecoration: line-through` (+ its `textDecorationColor`). The DIY values are now
  plain `--color-muted` text — present as the weaker option without being crossed out.
- **Codos column → green**: both the "WITH CODOS" header and the row dot markers
  changed from `--color-accent` (orange) to **`--color-success`** — the existing
  semantic positive-green token (`--color-success-ink` `#2c5a44`). No new token needed;
  the brief's `--color-success` already exists in tokens.css and is exposed in Tailwind.
  Chose the semantic success token over the brighter `--color-signal`/`--color-status-live`
  greens because the brief asked specifically for the success/positive green.

## Item 7 — add CTA to comparison section

- Extracted the hero's primary+secondary buttons into a module-level **`CtaPair`**
  component (`Book a demo` filled + `E-mail founders` outline) backed by shared style
  constants (`ctaBtnBase/Filled/Outline`), all token-driven, with the same `lp-btn`
  hover hooks. The hero now renders `<CtaPair/>` too, so the comparison CTA is
  *literally the same component with the same tokens* — exactly the consistency the
  brief asked for, and a single place to evolve the pair.
- Added `<CtaPair onCta={handleCta} />` at the END of the analysis/comparison section
  (after the comparison panel, wrapped in a `Reveal` for the scroll-in), left-aligned
  to the section rail.
- Removed the now-redundant hero-local `btnBase/btnFilled/btnOutline`. Net: less code,
  one source of truth for the CTA pair.

## Item 8 — team section to left/right layout

- Was: centred `SectionHead` stacked above a centred `max-width:64rem` 2-card grid.
- Now: an outer two-column grid — **headline block (TEAM eyebrow + "McKinsey meets AI
  lab.") on the LEFT**, the **two member cards as a pair on the RIGHT**. Reused the same
  column ratio as `StepSection` (`minmax(0,0.8fr) minmax(0,2fr)`) so the team section
  lines up with the diagnostic/graph rhythm.
- `SectionHead` switched from `center` to left-aligned (default); `titleMaxW="14ch"`
  gives the headline a tidy wrap in the narrow left column.
- Responsive: on mobile the outer grid collapses to one column (headline then cards)
  and the right-hand card pair itself drops from 2-up to 1-up. Card markup/tokens
  unchanged. `minWidth: 0` on the cards column prevents grid overflow.

## Item 9 — FAQ left/right layout + animated accordion

- **Layout**: same left/right grid as the team section — headline (FAQ eyebrow +
  "Questions founders ask.") on the LEFT, the accordion list on the RIGHT;
  `minmax(0,0.8fr) minmax(0,2fr)`, collapsing to one column on mobile.
- **Animated accordion**: replaced the native `<details>` (which snaps open) with a
  controlled `FaqAccordion` (React state, one row open at a time, first open by
  default). Open/close now animates smoothly:
  - **height** via the `grid-template-rows: 0fr → 1fr` technique on `.lp-acc-panel`
    (inner wrapper `overflow: hidden; min-height: 0` clips during the transition) —
    no fixed/guessed max-height, animates to the content's true height.
  - **opacity** 0 → 1 in parallel; the `+` mark rotates 45° to an `×`.
  - timing from the motion tokens (`--duration-base`/`--ease-out`).
- **prefers-reduced-motion**: an `@media (prefers-reduced-motion: reduce)` block in
  index.css zeroes the transitions on `.lp-acc-summary/.lp-acc-mark/.lp-acc-panel`, so
  it opens/closes instantly with no motion. State still toggles correctly.
- A11y: the summary is now a real `<button type="button">` with `aria-expanded`.
  The legacy `.lp-faq` CSS is left in place (now unused) — harmless.
