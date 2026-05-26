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
