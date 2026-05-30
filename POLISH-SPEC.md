# Codos — Comprehensive Polish + Motion Pass (active spec)

> Project moved to `~/code/codos` (off Desktop). Ignore any Desktop paths in old NOTES.
> Goal: take the site from "agency build" to "infrastructure-grade premium."
> Reference register: Linear, Stripe, Vercel, Anthropic — quiet, engineered, fast, restrained.
> NOT awwwards-tier motion-heavy. **Restraint is the brief.**
>
> Delivery: Part 2 (structural bugs) → Part 3 (dashboard fidelity) → Part 4+5 (motion) →
> Part 6 (micro-motion) → Part 7 (type/edge). **Show Parts 1–3 + screenshots before Part 4+.**

---

## PART 1 — MOTION LIBRARY SETUP
Install framer-motion as the primary motion library. Use GSAP ONLY for the particle-cloud
animations and the diagram-dot-traveling animation (where timeline control matters).
Do NOT install ScrollSmoother. Do NOT scroll-jack the page anywhere.

Globally:
- All transitions: ease-out cubic-bezier(0.22, 1, 0.36, 1), 200–400ms.
- Section reveals on scroll: subtle (8–12px y-offset + opacity), never more.
- No "bounce," no overshoot, no exaggerated easing. This brand is engineered.

## PART 2 — STRUCTURAL FIXES (DO FIRST)
**2.1 — "Transform data into Dashboard" section (step three / dashboard mock)**
- Headline ("Transform data into Dashboard") + subline ("Every signal, routed, deduped,
  written to record.") moved to TOP of section, full-width or left-aligned, first in vertical flow.
- Particle cloud visual ("_stepThree / A listening agent — not a form.") sits BELOW the headline
  AND behind it in z-index (background/decorative layer, not a side column).
- Then below the particles, the dashboard mock container.

**2.2 — Final orange CTA section ("Ready to run your business like code?")**
- Orange fill extends ALL THE WAY to top edge of section — remove cream/off-white gap above.
  Orange begins flush against whatever section ends above it.
- Orange bleeds full-width (no side gutters showing page background).

**2.3 — Footer (currently inside orange section)**
- Footer row (CODOS logo · © 2026 Codos, Inc. · Privacy · Terms · dima@codos.ai · designed by
  UNKNW) sits at BOTTOM of orange section, not floating mid with dead space.
- Reduce vertical padding above/below footer row significantly — hug bottom edge with tight
  padding (~32–48px top/bottom from the row).

**2.4 — Step section red guide/indent issue**
- On "_stepOne / conduct diagnostic.Interviews" (and any other step section, same pattern), the
  left indent / column gap between step-label column and main content column is too small —
  content bleeds into label area.
- Increase horizontal gap between left "_stepOne …" column and right main content. Roughly
  DOUBLE the current gap. Apply consistently across all step sections.

**2.5 — a16z logo**
- Currently rasterized (JPG/PNG). Replace with SVG at `~/logo/speedrun.svg`
  (in repo: `public/assets/logo/speedrun.svg`). Inline SVG or <img>/next-image with .svg source,
  proper vector resolution.

## PART 3 — DASHBOARD MOCK (figma fidelity pass)
Reference Figma frame: https://www.figma.com/design/Ij8zWW8M5fFXiBSHdqTzJj/Brand?node-id=63-143&m=dev

**3.1 — Container**: entire mock (tabs + signals + metrics + ask-anything) in ONE warm light-gray
rounded container (≈ #E5E2DD — pull exact from Figma). Radius ~16–20px, generous internal
padding, full content-width.

**3.2 — Tabs row (top)**: order `exec summary | people | product | operations | market … simulate`
(simulate right-aligned). All pills rounded ~6–8px, monospaced. "exec summary" active = solid
Figma yellow fill, black text. people/product/operations/market = slightly darker gray than
container, dark text. simulate = white fill, dark text.

**3.3 — Two-column body**: Left (~58%) = NESTED WHITE rounded card on the gray container, white/cream
fill, ~12–16px radius, ~24–32px padding; holds the 3 signal items + "ask anything" input at bottom
(separated by 1px hairline). Right (~42%) = NO nested card, content directly on gray container,
separated by whitespace only.

**3.4 — Metric numbers (critical fix)**: big numbers ($415K, 18.2%, 118%) currently FAR too small.
Figma = display-scale ~80–110px, dominating right column. $ on $415K = small superscript upper-left
of the 4. % on 18.2% and 118% = small superscript upper-right. Tight line-height, tight tracking,
mono family.

**3.5 — Metric blocks**: three stacked, separated by 1px mid-gray hairlines. Each = small mono label
on top → giant number → small mono caption below. Figma vertical padding ~32–40px per block.

## PART 4 — DASHBOARD SIGNALS ANIMATION (NEW) [after 1–3 review]
Left white card: animate chat-style signals as continuous loop.
- Pool of 12–15 distinct signal entries (paragraph of insight + action pill + timestamp). Copy
  matches existing 3 signals' tone (terse, diagnostic, founder/CEO-relevant, mono). Topics: churn,
  hiring-vs-revenue, competitor moves, product velocity, runway, pricing experiments, regional ARR…
- 3 visible at a time. Every ~2.5s a new one fades+slides in from bottom (8–12px y, opacity 0→1,
  ~400ms ease-out); oldest fades+slides out top. After all 15, loop restarts seamlessly. Timestamp
  static "14:21". Pause on hover anywhere in white card. framer-motion AnimatePresence + layout.
- Action pills hover: bg slightly darkens, ~150ms ease.

## PART 5 — CONTEXT GRAPH DIAGRAM ANIMATION (NEW) [after 1–3 review]
Diagram (.sources → .raw-data → observers → company-merge-judge → vaults):
- Small orange dots (~6–8px, Codos orange) travel along each connector path: sources→raw-data;
  raw-data→each of 4 observers; each observer→merge-judge; merge-judge→each of 3 vaults.
- Multiple dots in flight, staggered. ~1.2–1.8s per segment. Continuous loop. GSAP MotionPath (or
  motion.circle along the existing SVG connector paths). Subtle trail (3–4 segs, fading opacity).
  NO glow/blur/particles — clean + engineered.

## PART 6 — MOTION POLISH (GLOBAL) [after 1–3 review]
6.1 Buttons: hover scale 1.0→1.02 + bg shift 200ms ease-out; press scale 0.98 instant; pointer
  cursor on all interactive; subtle custom cursor on key CTAs (tasteful, no big circles).
6.2 Tab pills: inactive hover bg darkens 150ms; active yellow fill animates between tabs via
  framer-motion layoutId (pill slides).
6.3 Section reveals: headline+subline+content fade-in on scroll-in: opacity 0→1, y 12→0, ~500ms
  ease-out, staggered (headline, subline +80ms, content +160ms). whileInView viewport once:true.
  Only headlines, sublines, main visual block per section.
6.4 Step labels (_stepOne…): on scroll-in, underscore+number typewriter in over ~400ms; descriptor
  below fades in standard after label completes.
6.5 Metric numbers: on dashboard scroll-in count up from 0 over ~1.2s ease-out ($0K→$415K,
  0.0%→18.2%, 0%→118%) via framer-motion animate() onUpdate; stay static after.
6.6 Particle cloud: slow continuous drift (rotate 360deg/60s infinite) + subtle scale breathing
  (0.98→1.02→0.98 over 8s). Alive but not distracting. Hover (CTA context) speeds drift slightly.
6.7 Page load: hero fades up — logo, then headline, then subline, then CTAs, staggered ~100ms
  each, total intro ~600ms. No splash, no loader.

## PART 7 — TYPOGRAPHY + EDGE POLISH [after 1–3 review]
7.1 Type: audit headlines vs Figma (most too small/loose). Tighten letter-spacing on display
  (-0.01 to -0.02em on large mono headlines). Body line-height 1.5–1.6; large mono headlines 1.2–1.3.
  Mono for UI/labels/captions; serif only where Figma specifies (e.g. "Transform data into Dashboard").
7.2 Borders/radii: consistent — 16–20px large containers, 8–12px inner cards, 4–8px pills. Hairlines
  1px via consistent token ≈ rgba(0,0,0,0.08) on light. NO drop shadows unless Figma specifies (flat+structural).
7.3 Spacing: consistent section vertical rhythm ~120–160px top/bottom desktop.

## PART 8 — WHAT NOT TO DO
No scroll-jacking / ScrollSmoother / locked scroll. No big swooping reveals, no parallax beyond
specified. No "fade everything on every scroll" — only headlines/sublines/key visuals. No glow/neon/
gradients beyond Figma. No cursor effects beyond subtle pointer scale on CTAs. No sound/autoplay
video. No loading/splash screens.
