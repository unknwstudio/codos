import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Mic } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Editorial Landing — V2 from Claude Design handoff (Codos)
// Off-white cream background, Fraunces serif display, Urbanist body,
// Geist Mono kickers, single terracotta accent. Inline-styled to mirror
// the design source 1:1 — no Tailwind on this page.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#F26B1F';

// Shared brand assets exported from Figma (particle cloud + CODOS wordmark).
// The particle PNG is reused across the hero, diagnostic and graph frames.
const PARTICLES_SRC = '/assets/figma/particles.png';
const LOGO_SRC = '/assets/figma/logo.svg';

// Partner / backer logos (real wordmarks from /assets/logo/). Union.svg = cyber·Fund.
const PARTNER_LOGOS = [
  { src: '/assets/logo/mckinsey.svg', alt: 'McKinsey & Co', h: 0.95 },
  { src: '/assets/logo/meta.svg', alt: 'Meta', h: 0.78 },
  { src: '/assets/logo/Union.svg', alt: 'cyber·Fund', h: 0.7 },
  { src: '/assets/logo/everclear.svg', alt: 'Everclear', h: 0.85 },
];

// ───────────────── Responsive helper ─────────────────
function useIsMobile(breakpoint = 760) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ───────────────── COPY ─────────────────
const COPY = {
  nav: [
    { label: 'How it works', href: '#how' },
    { label: 'Team', href: '#team' },
  ],
  heroEyebrow: 'For teams 50–1,000',
  heroSub: 'We make mid-sized organizations AI-native.',
  ctaPrimary: 'Book a demo',
  founderEmail: 'dima@codos.ai',

  // New hero (Figma 33:78)
  heroWordLeft: 'install',
  heroWordRight: 'evolution',
  heroLede: 'the AI layer that keeps your company evolving — on its own',
  heroCtaSecondary: 'E-mail founders',
  heroCredentials: [
    { num: '01', label: 'McKinsey & Co' },
    { num: '02', label: 'Meta' },
    { num: '03', label: 'cyber·Fund' },
    { num: '04', label: 'Everclear' },
  ],

  // Diagnostic section (Figma 55:2)
  diagnostic: {
    step: '_stepOne',
    verb: 'conduct ',
    method: 'diagnostic.Interviews',
    tagline: 'A listening agent — not a form.',
    cardLabel: 'diagnostic interviews',
    session: ['Session ID4611.4', 'VP Sales', '01:55'],
    status: 'Listening',
    agentTag: 'CODOS AI',
    quote: 'Most start inbound — a founder demo request. Then AE qualifies, SE joins for technical depth..',
    footLeft: ['Mic on', 'Phase 2 of 5', 'Go-to-market'],
    footRight: ['Pause', 'End turn'],
  },

  // Context graph section (Figma 55:22)
  graph: {
    step: '_stepTwo',
    verb: 'setting ',
    method: 'contexts.Graph',
    tagline: 'Every signal, routed, deduped, written to record.',
    sources: { label: '.sources', chips: ['Interviews', 'Org chart', 'Metrics & OKRs', 'Meeting notes', 'Notion', 'Slack', 'Gmail', 'Hubspot', 'Google Sheets', 'Many more..'] },
    rawData: { label: '.raw-data', chips: ['MD', 'PDF', 'XLSX', 'transcripts'] },
    observers: [
      { kicker: 'observer', label: '.people', chips: ['roles', 'depts', 'OKRs'] },
      { kicker: 'observer', label: '.product', chips: ['tech stack', 'systems'] },
      { kicker: 'observer', label: '.operations', chips: ['process', 'financials'] },
      { kicker: 'observer', label: '.market', chips: ['competitors', 'customers'] },
    ],
    judge: { label: 'company-merge-judge', chips: ['dedup', 'resolve', 'write plan'] },
    vaults: [
      { kicker: 'vault', label: '.company', chips: ['stable facts'] },
      { kicker: 'vault', label: '.engagement', chips: ['operational record'] },
      { kicker: 'vault', label: '.working-memory', chips: ['synthesis & priorities'] },
    ],
  },

  // Transform / exec-dashboard section (Figma 56:344 — _stepThree)
  dashboard: {
    step: '_stepThree',
    verb: 'transform data into ',
    method: 'Dashboard',
    tagline: 'A listening agent — not a form.',
    rightSub: 'Every signal, routed, deduped, written to record.',
    tabs: ['exec summary', 'people', 'product', 'operations', 'market'],
    tabAction: 'simulate',
    feed: [
      { text: "Sales headcount is up 18% but rev/employee is flat. You're paying for growth you're not getting.", action: 'Freeze Sales hiring', time: '14:21' },
      { text: "Competitor Atlas shipped 2 features you've had in backlog since Q1. Context graph flagged 4 customer mentions this week.", action: 'Brief the team on Atlas', time: '14:21' },
      { text: 'Pause the other 3 pilots until Token Coverage is fixed', action: 'Pause the other 3 pilots', time: '14:21' },
    ],
    inputPlaceholder: 'ask anything',
    metrics: [
      { label: 'revenue per employee', value: '415K', unit: '$', unitBefore: true, delta: '+$20K', notes: ['vs $480K last week'] },
      { label: 'net margin', value: '18.2', unit: '%', unitBefore: false, notes: ['revenue $26.4M · OpEx $21.6M', 'OpEx grew 12% while revenue grew 9%.', 'net margin grew from 14.6%'] },
      { label: 'Net revenue retention', value: '118', unit: '%', unitBefore: false, notes: ['ARR $58M, up from $49M. logo churn 2.1%/mo, but expansion revenue covers it 3×. signups are a vanity input; NRR is the outcome.'] },
    ],
  },

  approachKicker: 'Our approach',
  approachTitle: 'We help you become AI-native.',
  approachSub:
    'Three things working together. Not a deck — a deployed system. We diagnose, build context graph, and hand you the software to run the transformation — in that order.',
  approach: [
    { num: '01', name: 'Diagnostics',   body: 'AI agents scan your org, run interviews, and analyze workflows to surface the highest-ROI initiatives first.' },
    { num: '02', name: 'Context graph', body: "We connect all the data sources and build your org's context graph and ontology." },
    { num: '03', name: 'Transformation', body: 'Ongoing access to the tooling we build — including a CAIO agent that drives adoption across every function.' },
  ],

  whoKicker: "Who it's for",
  whoTitle: 'Built for leaders who want leverage — not another tool to manage.',
  who: [
    { name: 'Mid-sized teams',         range: '50–1,000 people',     body: 'Big enough to feel friction. Small enough to become AI-native fast.' },
    { name: 'Founders & operators',    range: 'Growth-stage',        body: 'You know AI matters. We know how to get 10× leverage from it.' },
    { name: 'People-heavy businesses', range: 'Services, ops, support', body: 'Your business runs on people. Most of their time is spent on work AI can do.' },
  ],

  buildVsBuyTitle: "Build it yourself. Or don't.",
  buildVsBuySub: 'A frank comparison.',
  compareRows: [
    { metric: 'Time to value',       diy: '6–9 months',              codos: 'Days' },
    { metric: 'System architecture', diy: 'Ad-hoc, experimental',    codos: 'Battle-tested, scalable' },
    { metric: 'Data privacy',        diy: 'Cloud, often weak',       codos: 'Local-first, strong' },
    { metric: 'Workflow adaptation', diy: 'Generic',                 codos: 'Bespoke configuration' },
    { metric: 'Technical support',   diy: 'Internal resource drain', codos: 'Dedicated concierge' },
  ],

  howKicker: 'How it works',
  howTitle: 'From zero to running — in days.',
  howSteps: [
    { time: 'Days',   name: 'Diagnostics',    body: 'Agentic interviews and data analysis to find the lowest-hanging fruits.' },
    { time: 'Weeks',  name: 'Pilot',          body: 'Your first CAIO agent and initial Codos OS deployment.' },
    { time: 'Months', name: 'Transformation', body: 'Scale successful pilots. Improve margins. Compound.' },
  ],

  teamKicker: 'Team',
  teamTitle: 'McKinsey meets AI lab.',
  team: [
    {
      name: 'Dima Khanarin', role: 'Co-founder, CEO',
      bio: ['Former CEO, Everclear Foundation — $5bn volume, Pantera-backed.', 'Consultant, McKinsey & Co.'],
    },
    {
      name: 'Gleb Sidora', role: 'Co-founder, CTO',
      bio: ['ML Engineer, Meta.', 'Founding engineer, Condukt (Lightspeed-backed).'],
    },
  ],
  backers: ['McKinsey & Co', 'Meta', 'cyber•Fund', 'Everclear'],

  faqKicker: 'FAQ',
  faqTitle: 'Questions founders ask.',
  faq: [
    { q: "What's the primary value of Codos?", a: 'Real productivity gains from deep custom integration, knowledge transfer so you build internal AI fluency, and absolute privacy — your data stays on your devices.' },
    { q: "Can't I just build this myself?",     a: 'Easier every day. But Codos is 12 months of research + 6 months of building. We save you months of iteration and handle the architecture for you.' },
    { q: 'Does my team need to be technical?',  a: 'No. We handle the technical setup end-to-end. Your team just uses it.' },
    { q: "What's the engagement model?",        a: 'A 30-day pilot to prove value, then an ongoing monthly partnership. Cancel any time after pilot.' },
  ],

  closingSub: "Book a 30-minute discovery call. We'll show you exactly how Codos would work for your team.",
};

// ───────────────── STYLE TOKENS ─────────────────
const S = {
  wrap: {
    // Transparent: the page cream lives on <body> (the canvas). Keeping the wrap
    // transparent lets the single scroll particle (z-index:-1) paint above the cream
    // but below every section's content — the global "above bg, below text" rule.
    fontFamily: 'Urbanist, sans-serif',
    background: 'transparent',
    color: 'var(--color-text)',
    minHeight: '100vh',
  } as CSSProperties,
  // Fluid container — no longer locked at a fixed px width. Generous max + a
  // viewport-fluid gutter (both from tokens), so content breathes mobile → wide.
  inner: { maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--page-gutter)' } as CSSProperties,
  serif: { fontFamily: '"Fraunces", "Instrument Serif", Georgia, serif' } as CSSProperties,
  kicker: {
    fontFamily: '"Geist Mono", monospace',
    fontSize: 11,
    letterSpacing: 0.22,
    textTransform: 'uppercase',
    color: ACCENT,
    fontWeight: 500,
    marginBottom: 16,
  } as CSSProperties,
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    background: '#1a1a1a', color: '#f5f1ea',
    padding: '14px 24px', borderRadius: 999,
    fontSize: 14, fontWeight: 600, textDecoration: 'none',
    letterSpacing: 0.01, cursor: 'pointer', border: 'none',
  } as CSSProperties,
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 22px', borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.2)', color: '#1a1a1a',
    fontSize: 14, fontWeight: 500, textDecoration: 'none', background: 'transparent', cursor: 'pointer',
  } as CSSProperties,
  body: { fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-muted)' } as CSSProperties,
};

// ───────────────── CodosLogo ─────────────────
function CodosLogo({ size = 28, color = 'currentColor', accent }: { size?: number; color?: string; accent?: string }) {
  const s = size;
  const r = s * 0.22;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: s * 0.35 }}>
      <div
        style={{
          width: s, height: s,
          borderRadius: r,
          background: accent || ACCENT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24" fill="none">
          <path d="M5 7 L10 12 L5 17" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17 L19 17" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: s * 0.78, color, letterSpacing: -s * 0.01 }}>Codos</span>
    </div>
  );
}

// ───────────────── LogoPill ─────────────────
function LogoPill({ label, dark = false }: { label: string; dark?: boolean }) {
  const color = dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)';
  const h = 22;
  const logos: Record<string, React.ReactNode> = {
    'McKinsey & Co': (
      <svg width="200" height={h} viewBox="0 0 200 24" fill="none">
        <text x="0" y="19" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="400" fill={color} letterSpacing="-0.3">
          McKinsey &amp; Company
        </text>
      </svg>
    ),
    Meta: (
      <img
        src="/assets/meta-logo.png"
        alt="Meta"
        style={{
          height: 18, width: 'auto', display: 'block',
          filter: dark ? 'invert(1) brightness(0.9)' : 'brightness(0.6) contrast(1.05)',
          opacity: 0.72,
        }}
      />
    ),
    'cyber•Fund': (
      <svg width="130" height={h} viewBox="0 0 130 24" fill="none">
        <text x="0" y="19" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="18" fontWeight="400" fill={color} letterSpacing="-0.2">
          cyber
        </text>
        <circle cx="55" cy="13" r="2.3" fill={color} />
        <text x="63" y="19" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="18" fontWeight="700" fill={color} letterSpacing="-0.2">
          Fund
        </text>
      </svg>
    ),
    Everclear: (
      <img
        src="/assets/everclear-logo.png"
        alt="Everclear"
        style={{
          height: 39, width: 'auto', display: 'block',
          filter: dark ? 'invert(1) brightness(0.92)' : 'brightness(0.55) contrast(1.1)',
          opacity: 0.85,
        }}
      />
    ),
  };
  const logo = logos[label];
  return (
    <div style={{ padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 38, opacity: 0.85 }} title={label}>
      {logo || (
        <span style={{ fontFamily: 'Urbanist, sans-serif', fontSize: 13, fontWeight: 500, color }}>{label}</span>
      )}
    </div>
  );
}

// ───────────────── How it works — "from zero to running" staircase (Figma 63:221) ─────
// A descending-right staircase: each step is a lengthening brand bar (Days → Weeks →
// Months) over a "{time} of {name}" label (time in mono accent, name in serif) and a
// body line. The growing bars + rightward march read as a ramp from zero to running.
// Indents/bar-widths are proportional layout (like the graph diagram); all colours,
// type, the bar height/radius and rhythm come from tokens. Bleeds off the right edge
// (clipped by the section) on the last step, as in the design.
const HOW_STEP_GEOM = [
  { indent: '0%',  barW: '12%' },
  { indent: '18%', barW: '31%' },
  { indent: '50%', barW: '55%' },
];

function HowItWorksSection() {
  const isMobile = useIsMobile();
  return (
    <section id="how" style={{ ...SECTION, overflow: 'hidden' }}>
      <Reveal><SectionHead kicker={COPY.howKicker} title={COPY.howTitle} titleMaxW="22ch" /></Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 'var(--space-6)' : 'var(--space-8)' }}>
        {COPY.howSteps.map((s, i) => {
          const g = HOW_STEP_GEOM[i] ?? HOW_STEP_GEOM[0];
          return (
            <Reveal key={s.name} delay={i * 120}>
              {/* full-width step; the indent lives on each child so the bar width
                  stays proportional to the full width (the last bar bleeds past the
                  right edge, clipped by the section — as in the design). Flush-left
                  and stacked on mobile. */}
              {(() => {
                const indent = isMobile ? '0%' : g.indent;
                return (
                  <div style={{ minWidth: 0 }}>
                    {/* lengthening brand progress bar */}
                    <div aria-hidden="true" style={{
                      width: g.barW, marginLeft: indent, height: 'var(--space-3)',
                      background: 'var(--color-accent)', borderRadius: 'var(--radius-full)',
                    }} />
                    <div style={{ marginLeft: indent, marginTop: 'var(--space-4)', fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h3)', lineHeight: 1.1 }}>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}>{s.time} of </span>
                      <span>{s.name}</span>
                    </div>
                    <p style={{ marginLeft: indent, marginTop: 'var(--space-3)', marginRight: 0, marginBottom: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-muted)', maxWidth: '40ch' }}>{s.body}</p>
                  </div>
                );
              })()}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ───────────────── Shared section primitives (Figma 55:2 / 55:22) ─────────────────
// Small chip used inside the product-mock panels. Tokens only.
function Chip({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'highlight' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: tone === 'highlight' ? 'var(--color-bg)' : 'var(--color-panel-chip)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', lineHeight: 1.2,
      padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

// Full-bleed section padding (fluid gutter + rhythm). The site is edge-to-edge —
// no max-width container; only body text keeps a readable measure.
const SECTION: CSSProperties = { padding: 'var(--section-y) var(--page-gutter)' };
const REG = 'var(--font-weight-regular)' as unknown as number;

// The 01/02/03 "How it works" step-row grid — the canonical 3-column rail. The team
// cards and the FAQ accordion lock their content onto it, starting at column 2's left
// edge (grid-column 2 / 4). Shared so all three reference the SAME grid definition,
// not each other (so one section's layout can change without breaking the others).
const STEP_GRID_COLS = 'repeat(3, 1fr)';
const STEP_GRID_GAP = 'var(--space-4)';

// Shared section header — mono accent kicker + GT Alpina headline (+ optional sub).
function SectionHead({ kicker, title, sub, center = false, titleMaxW }: {
  kicker: string; title: React.ReactNode; sub?: string; center?: boolean; titleMaxW?: string;
}) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 'var(--space-8)' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-h1)', fontWeight: REG, letterSpacing: '-0.02em', margin: center ? '0 auto' : 0, maxWidth: titleMaxW }}>{title}</h2>
      {sub ? <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-intro)', lineHeight: 'var(--leading-intro)', color: 'var(--color-muted)', margin: center ? 'var(--space-4) auto 0' : 'var(--space-4) 0 0', maxWidth: '52ch' }}>{sub}</p> : null}
    </div>
  );
}

// A standard panel/card surface.
function Panel({ children, highlight = false, hover = false, style }: { children: React.ReactNode; highlight?: boolean; hover?: boolean; style?: CSSProperties }) {
  return (
    <div className={hover ? 'lp-card' : undefined} style={{
      background: highlight ? 'var(--color-highlight)' : 'var(--color-panel)',
      color: highlight ? 'var(--color-highlight-contrast)' : 'var(--color-text)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', ...style,
    }}>
      {children}
    </div>
  );
}

// Scroll-reveal wrapper — fades + lifts (+ slight blur) its child in when it
// scrolls into view. Honours prefers-reduced-motion (renders shown immediately).
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(26px)',
        filter: shown ? 'none' : 'blur(5px)',
        transition: `opacity var(--duration-slow) var(--ease-out) ${delay}ms, transform var(--duration-slow) var(--ease-out) ${delay}ms, filter var(--duration-slow) var(--ease-out) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

// "_stepN" (left col) + mixed verb/method headline (right col). The section's
// visual (`children`) lives in the RIGHT column, so it aligns under the headline
// ("conduct" / "setting"), not under the step. `bgVisual` is an absolute layer
// behind everything (used for the graph's left-side particle).
function StepSection({ step, verb, method, tagline, rightSub, dataSection, children }: {
  step: string; verb: string; method: string; tagline: string; rightSub?: string;
  dataSection: string; children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const heading: CSSProperties = {
    fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-h1)',
    fontWeight: 'var(--font-weight-regular)' as unknown as number,
    letterSpacing: '-0.02em', margin: 0,
  };
  const sub: CSSProperties = {
    margin: 'var(--space-3) 0 0', fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-intro)', lineHeight: 'var(--leading-intro)',
    color: 'var(--color-text)', maxWidth: '34ch',
  };
  return (
    <section data-section={dataSection} style={{ position: 'relative', overflow: 'hidden', ...SECTION }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.8fr) minmax(0, 2fr)',
        gap: isMobile ? 'var(--space-5)' : 'var(--space-8)', alignItems: 'start',
        position: 'relative',
      }}>
        <Reveal>
          <div style={{ ...heading, fontFamily: 'var(--font-headline)' }}>{step}</div>
          <p style={sub}>{tagline}</p>
        </Reveal>
        {/* Right column. The headline reveals, but the visual (`children`) is rendered
            OUTSIDE the Reveal: Reveal uses `will-change: opacity, transform`, which
            ALWAYS creates a stacking context — and that would trap the visual above the
            scroll particle. Keeping the visual out of any stacking context lets the
            particle (z-index:-1) layer between a section's background and its content. */}
        <div style={{ minWidth: 0 }}>
          <Reveal delay={90}>
            <h2 style={heading}>
              <span style={{ fontFamily: 'var(--font-headline)' }}>{verb}</span>
              <span style={{ fontFamily: 'var(--font-body)' }}>{method}</span>
            </h2>
            {rightSub ? <p style={sub}>{rightSub}</p> : null}
          </Reveal>
          <div style={{ marginTop: isMobile ? 'var(--space-6)' : 'var(--space-8)' }}>{children}</div>
        </div>
      </div>
    </section>
  );
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: color, display: 'inline-block', flexShrink: 0 }} />
);

// ───────────────── CtaPair ─────────────────
// The shared primary + secondary CTA pair ("Book a demo" / "E-mail founders"),
// used by the hero and the comparison section so they're literally the same
// component with the same tokens. All values are tokens.
const ctaBtnBase: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)',
  lineHeight: 1, textDecoration: 'none', cursor: 'pointer',
  padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-full)',
  border: 'var(--border-thin) solid transparent', whiteSpace: 'nowrap',
};
// Primary = the brand accent (orange), matching the nav "Book a demo" CTA — a clear,
// high-contrast primary action on the cream background (the old white-on-cream fill
// read as washed out). Secondary = quiet outline.
const ctaBtnFilled: CSSProperties = {
  ...ctaBtnBase, background: 'var(--color-accent)', color: 'var(--color-accent-contrast)',
};
const ctaBtnOutline: CSSProperties = {
  ...ctaBtnBase, background: 'transparent', color: 'var(--color-text)',
  borderColor: 'var(--color-border-strong)',
};

function CtaPair({ onCta, style }: { onCta: (e: React.MouseEvent) => void; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', ...style }}>
      <a href="#demo" onClick={onCta} className="lp-btn lp-btn--accent" style={ctaBtnFilled}>{COPY.ctaPrimary}</a>
      <a href={`mailto:${COPY.founderEmail}`} className="lp-btn lp-btn--outline" style={ctaBtnOutline}>{COPY.heroCtaSecondary}</a>
    </div>
  );
}

// ───────────────── DiagnosticSection (Figma 55:2) ─────────────────
// Flat "step one" diagnostic: header + a live interview mock (orb, transcript,
// status chips). No switcher / tabs / state. Tokens only.
function DiagnosticSection() {
  const isMobile = useIsMobile();
  const d = COPY.diagnostic;
  const meta: CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)',
    lineHeight: 1.4, color: 'var(--color-text)',
  };
  return (
    <StepSection dataSection="diagnostic" step={d.step} verb={d.verb} method={d.method} tagline={d.tagline}>
      {/* Live interview mock — aligned under the "conduct" headline.
          Layer order in this card (item 1): grey fill (z-index:-2) → the docked scroll
          particle (z-index:-1) → this card content (normal flow, on top). The card is
          position:relative but NOT a stacking context (no z-index/transform/opacity), so
          the fill and the global particle resolve in the same root stacking context and
          the particle slips between them. `data-particle-dock` is the dock target. */}
      <div data-particle-dock="true" style={{
        position: 'relative', borderRadius: 'var(--radius-md)',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
        minHeight: isMobile ? 'auto' : '30rem',
      }}>
        {/* Opaque grey fill — BELOW the particle (z-index:-2). */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--color-panel)', borderRadius: 'var(--radius-md)', zIndex: -2 }} />
        {/* header row: window dots · centred label+session · status */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Dot color="var(--color-border-strong)" /><Dot color="var(--color-border-strong)" /><Dot color="var(--color-border-strong)" />
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h4)', lineHeight: 1.1 }}>{d.cardLabel}</div>
            <div style={{ ...meta, display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {d.session.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ ...meta, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-panel-chip)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
              <Dot color="var(--color-status-live)" />{d.status}
            </span>
          </div>
        </div>

        {/* agent tag — centred over the particle backdrop (the orb is now the card
            underlay above, so this region reads against the particle blob) */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <span style={{ ...meta, background: 'var(--color-panel-chip)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)' }}>{d.agentTag}</span>
        </div>

        {/* transcript quote */}
        <p style={{
          margin: '0 auto', textAlign: 'center', fontFamily: 'var(--font-headline)',
          fontSize: 'var(--text-h4)', lineHeight: 'var(--leading-h4)', maxWidth: '46ch',
        }}>
          {d.quote}
        </p>

        {/* footer: status text (left) · controls (right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ ...meta, display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {d.footLeft.map((f) => <span key={f}>{f}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {d.footRight.map((f) => <Chip key={f}>{f}</Chip>)}
          </div>
        </div>
      </div>
    </StepSection>
  );
}

// ───────────────── ContextGraphSection (Figma 55:22 / 61:793) ─────────────────
// A graph node sized in container-query units (cqw) so the whole diagram scales
// as one unit with its container.
function GNode({ kicker, label, chips, highlight = false, style }: {
  kicker?: string; label: string; chips: string[]; highlight?: boolean; style: CSSProperties;
}) {
  const ink = highlight ? 'var(--color-highlight-contrast)' : 'var(--color-text)';
  return (
    <div style={{
      position: 'absolute', boxSizing: 'border-box',
      background: highlight ? 'var(--color-highlight)' : 'var(--color-panel)',
      borderRadius: '0.7cqw', padding: '0.9cqw',
      display: 'flex', flexDirection: 'column', gap: '0.55cqw',
      ...style,
    }}>
      {kicker ? <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.2cqw', letterSpacing: '0.12em', textTransform: 'uppercase', color: ink, opacity: 0.7, lineHeight: 1 }}>{kicker}</div> : null}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '2.6cqw', lineHeight: 1.05, color: ink, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45cqw' }}>
        {chips.map((c) => (
          <span key={c} style={{ background: 'var(--color-panel-chip)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: '1.2cqw', lineHeight: 1.3, padding: '0.2cqw 0.5cqw', borderRadius: '0.3cqw', whiteSpace: 'nowrap' }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

// The context-graph infographic (Figma 61:793, native 1153×777) as a fluid
// composition. DATA-DRIVEN: every node's box geometry lives in one `N` table
// (design units); the diagram renders the boxes from it AND computes every
// connector from the SAME geometry — each edge anchors to the midpoint of the
// relevant box side (parent bottom → child top), so lines stay attached if a box
// moves or resizes. The SVG shares the node coordinate system (viewBox 0 0 W H +
// preserveAspectRatio="none"), and everything is sized in cqw so it scales as one
// unit. A min-width keeps text legible (the diagram scrolls on phones).
type GraphNode = { x: number; y: number; w: number; h: number; label: string; chips: string[]; kicker?: string; highlight?: boolean };

function GraphDiagram() {
  const g = COPY.graph;
  const W = 1153, H = 777;

  // ── Single source of truth: node boxes in design units ──
  const N: Record<string, GraphNode> = {
    sources:    { x: 0,   y: 0,   w: 1153, h: 111, label: g.sources.label, chips: g.sources.chips },
    raw:        { x: 453, y: 162, w: 248,  h: 111, label: g.rawData.label, chips: g.rawData.chips },
    people:     { x: 194, y: 324, w: 156,  h: 120, ...g.observers[0] },
    product:    { x: 356, y: 324, w: 174,  h: 120, ...g.observers[1] },
    operations: { x: 536, y: 324, w: 218,  h: 120, ...g.observers[2] },
    market:     { x: 760, y: 324, w: 200,  h: 120, ...g.observers[3] },
    judge:      { x: 379, y: 495, w: 396,  h: 111, highlight: true, label: g.judge.label, chips: g.judge.chips },
    vCompany:   { x: 0,   y: 657, w: 380,  h: 120, ...g.vaults[0] },
    vEngage:    { x: 386, y: 657, w: 380,  h: 120, ...g.vaults[1] },
    vWorking:   { x: 772, y: 657, w: 381,  h: 120, ...g.vaults[2] },
  };

  // ── Edges: parent → child. Geometry (anchors) is COMPUTED, not hand-placed ──
  const edges: [string, string][] = [
    ['sources', 'raw'],
    ['raw', 'people'], ['raw', 'product'], ['raw', 'operations'], ['raw', 'market'],
    ['people', 'judge'], ['product', 'judge'], ['operations', 'judge'], ['market', 'judge'],
    ['judge', 'vCompany'], ['judge', 'vEngage'], ['judge', 'vWorking'],
  ];
  const bottomMid = (n: GraphNode) => ({ x: n.x + n.w / 2, y: n.y + n.h });
  const topMid    = (n: GraphNode) => ({ x: n.x + n.w / 2, y: n.y });
  // Smooth vertical S-curve between two anchor points (control points on the midline).
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const my = (a.y + b.y) / 2;
    return `M ${a.x} ${a.y} C ${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
  };
  const pct = (n: GraphNode): CSSProperties => ({
    left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`,
    width: `${(n.w / W) * 100}%`, height: `${(n.h / H) * 100}%`,
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ containerType: 'inline-size', position: 'relative', width: '100%', minWidth: '38rem', aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          {edges.map(([from, to]) => (
            <path key={`${from}-${to}`} d={curve(bottomMid(N[from]), topMid(N[to]))}
              fill="none" stroke="var(--color-border-strong)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {Object.entries(N).map(([id, n]) => (
          <GNode key={id} kicker={n.kicker} label={n.label} chips={n.chips} highlight={n.highlight} style={pct(n)} />
        ))}
      </div>
    </div>
  );
}

function ContextGraphSection() {
  const g = COPY.graph;
  // No static left-particle: the single hero particle pins to the left here (see Hero).
  return (
    <StepSection dataSection="graph" step={g.step} verb={g.verb} method={g.method}
      tagline={COPY.diagnostic.tagline} rightSub={g.tagline}>
      <GraphDiagram />
    </StepSection>
  );
}

// ───────────────── TransformDashboardSection (Figma 56:344 — _stepThree) ─────────
// The "transform data into Dashboard" deliverable: a grey exec-dashboard card with a
// tab bar (exec summary active), a left insight feed (assistant lines + action chips
// + timestamps + an "ask anything" input) and a right KPI column. Tokens only;
// headline = GT Alpina (--font-headline), all UI text = DM Mono (--font-body).
function ExecDashboard() {
  const isMobile = useIsMobile();
  const d = COPY.dashboard;
  const tabBase: CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.2,
    padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap',
  };
  const note: CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)',
    lineHeight: 'var(--leading-caption)', color: 'var(--color-muted)',
  };
  return (
    <div style={{
      background: 'var(--color-panel)', borderRadius: 'var(--radius-md)',
      padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
    }}>
      {/* tab bar — exec summary (active, highlight) … + simulate (outlined, right).
          The whole cluster is locked: not-allowed cursor + "book a demo" tooltip on hover. */}
      <div className="dash-tablock" role="group" aria-label="Dashboard views — book a demo to access" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {d.tabs.map((t, i) => (
            <span key={t} style={{
              ...tabBase,
              // exec summary (active) = brand highlight; the rest = a faint darker
              // fill on the panel (Figma 63:143 shows subtle grey tab boxes).
              background: i === 0 ? 'var(--color-highlight)' : 'var(--color-surface-sunken)',
              color: i === 0 ? 'var(--color-highlight-contrast)' : 'var(--color-text)',
            }}>{t}</span>
          ))}
        </div>
        {/* simulate — a separate action, on a light (white) chip at the right */}
        <span style={{ ...tabBase, background: 'var(--color-panel-chip)', color: 'var(--color-text)' }}>{d.tabAction}</span>
      </div>

      {/* content — insight feed (left) + KPI column (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 'var(--space-6)' : 'var(--space-8)', alignItems: 'stretch' }}>
        {/* feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
          {d.feed.map((f) => (
            <div key={f.text} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-text)' }}>{f.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <Chip>{f.action}</Chip>
                <span style={{ ...note, color: 'var(--color-faint)', flexShrink: 0 }}>{f.time}</span>
              </div>
            </div>
          ))}
          {/* ask-anything — a borderless row sitting on a top divider (Figma: no fill box) */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', borderTop: 'var(--border-thin) solid var(--color-border-strong)', paddingTop: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--color-faint)' }}>{d.inputPlaceholder}</span>
            <Mic size={18} aria-hidden="true" style={{ color: 'var(--color-faint)', flexShrink: 0 }} />
          </div>
        </div>

        {/* KPI column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
          {d.metrics.map((m) => (
            <div key={m.label} style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
              // Every KPI block carries a top rule (Figma 63:143 — a hairline above
              // each label, including the first).
              borderTop: 'var(--border-thin) solid var(--color-border-strong)',
              paddingTop: 'var(--space-4)',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 1.3, color: 'var(--color-text)' }}>{m.label}</span>
              {/* oversized numeral; the $/% unit is a small superscript at the cap-top */}
              <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-metric)', lineHeight: 'var(--leading-metric)', display: 'flex', alignItems: 'flex-start' }}>
                {m.unitBefore && <span style={{ fontSize: '0.32em', marginTop: '0.12em' }}>{m.unit}</span>}
                <span>{m.value}</span>
                {!m.unitBefore && <span style={{ fontSize: '0.32em', marginTop: '0.12em' }}>{m.unit}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'baseline' }}>
                {m.delta && <span style={note}>{m.delta}</span>}
                <span style={note}>{m.notes[0]}</span>
              </div>
              {m.notes.slice(1).map((n) => <span key={n} style={note}>{n}</span>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransformDashboardSection() {
  const d = COPY.dashboard;
  // No static left-particle: the single hero particle stays pinned to the left through
  // this section (see Hero), then releases at "Who it's for".
  return (
    <StepSection dataSection="dashboard" step={d.step} verb={d.verb} method={d.method}
      tagline={d.tagline} rightSub={d.rightSub}>
      <ExecDashboard />
    </StepSection>
  );
}

// ───────────────── Hero (Figma 33:78) ─────────────────
// Full-bleed brand hero. Split "install / evolution" headline (GT Alpina
// Typewriter), particle cloud centerpiece, lede + dual CTAs, credentials.
// Every value comes from a token (var(--…)); no raw Figma px/hex.
function Hero({ onCta }: { onCta: (e: React.MouseEvent) => void }) {
  const isMobile = useIsMobile();
  // The hero shares the ONE global page inset every <section> uses (--page-gutter),
  // so its left/right rail lines up exactly with the diagnostic "_stepOne" block,
  // the comparison table, and every other section. No bespoke hero gutter.
  const gutter = 'var(--page-gutter)';

  // ── Scroll-driven particle (Task 2) ──
  // As the hero scrolls into the next section the particle cloud drifts toward
  // the viewport centre and scales down, tied to scroll progress. rAF-throttled
  // transform writes only; honours prefers-reduced-motion.
  const sectionRef = useRef<HTMLElement>(null);
  const particleRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const sec = sectionRef.current;
    const img = particleRef.current;
    if (!sec || !img) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const smoothstep = (t: number) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    // ── ONE continuous scroll journey ──
    //   ① hero centre (large)  ② dock onto the diagnostic card  ③ rise to the graph's
    //   upper-left  ④ PIN to the left through graph + dashboard  ⑤ release at "who".
    // Each phase yields a target viewport centre (vx, vy) + scale; we convert that to a
    // transform. Visual centre = (vw/2 + tx, restY + ty); set tx,ty so it lands on the
    // target. Anchors are read live from the DOM each frame, so it tracks layout/resize.
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vw = window.innerWidth, vh = window.innerHeight;
      const heroH = sec.offsetHeight || 1;
      const restY = img.offsetTop;          // hero-centre document Y (top:50% + −50%)
      const baseW = img.offsetWidth || 1;   // unscaled particle width

      const q = (sel: string) => document.querySelector(sel) as HTMLElement | null;
      const dockEl = q('[data-particle-dock]');
      const graphEl = q('[data-section="graph"]');
      const releaseEl = q('[data-particle-release]');
      const dr = dockEl?.getBoundingClientRect();
      const dockDocY = dr ? dr.top + y + dr.height / 2 : restY + heroH;
      const dockX = dr ? dr.left + dr.width / 2 : vw / 2;
      const graphTop = graphEl ? graphEl.getBoundingClientRect().top + y : restY + heroH * 2;
      const releaseTop = releaseEl ? releaseEl.getBoundingClientRect().top + y : graphTop + heroH * 2;

      const sDock = 0.46;                    // fits inside the diagnostic card
      const sPin = 0.40;                     // left-side size during the pin
      const pinVY = vh * 0.34;               // upper area
      // pinned centre-X: keep the (scaled) blob fully on-screen against the left rail.
      const pinVX = clamp(vw * 0.04 + (baseW * sPin) / 2, (baseW * sPin) / 2, vw * 0.5);

      const B1 = heroH;                              // hero → dock
      const B2 = Math.max(B1 + 1, graphTop);         // dock → upper-left (pin starts)
      // pin ends as "who" arrives — release a touch before its top hits the viewport
      // top so the blob has cleared by the time the section is centred.
      const B3 = Math.max(B2 + 1, releaseTop - vh * 0.25);

      let vx: number, vy: number, scale: number;
      if (y <= B1) {
        const t = smoothstep(y / Math.max(1, B1));
        vy = lerp(restY, dockDocY, t) - y;           // document-anchored interpolation
        vx = lerp(vw / 2, dockX, t);
        scale = lerp(1, sDock, t);
      } else if (y <= B2) {
        const t = smoothstep((y - B1) / (B2 - B1));
        vy = lerp(dockDocY - y, pinVY, t);           // card (doc-anchored) → upper-left
        vx = lerp(dockX, pinVX, t);
        scale = lerp(sDock, sPin, t);
      } else if (y <= B3) {
        vx = pinVX; vy = pinVY; scale = sPin;        // PINNED (fixed viewport position)
      } else {
        vx = pinVX; vy = (B3 + pinVY) - y; scale = sPin; // released → scroll away
      }

      const tx = vx - vw / 2;
      const ty = (y + vy) - restY;
      img.style.transform = `translate(calc(-50% + ${tx.toFixed(1)}px), calc(-50% + ${ty.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
      // Opacity: full in the hero (centrepiece, every viewport); once it docks/pins it
      // fades to a width-driven backdrop level — faint on narrow viewports (where content
      // stacks full-width over it), near-full on wide desktop (where the left rail has
      // room). A smooth graceful degradation rather than a hard mobile/desktop switch.
      const postOp = lerp(0.22, 1, smoothstep((vw - 600) / 600));
      img.style.opacity = lerp(1, postOp, smoothstep(y / Math.max(1, B1))).toFixed(3);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const headlineWord: CSSProperties = {
    fontFamily: 'var(--font-headline)',
    fontSize: 'var(--text-display)',
    lineHeight: 'var(--leading-display)',
    fontWeight: 'var(--font-weight-regular)' as unknown as number,
    letterSpacing: '-0.02em',
    margin: 0,
  };
  return (
    <section
      ref={sectionRef}
      style={{
        // overflow visible (not hidden) so the full square particle cloud is never
        // clipped at the hero edges, and so the single instance can travel out of the
        // hero and dock onto the diagnostic card on scroll. The particle width is
        // capped at ≤100vw, so nothing spills horizontally.
        position: 'relative', overflow: 'visible',
        // Transparent: shows the body cream, so the z-index:-1 particle reads as the
        // hero centrepiece (above the cream canvas, below the hero content).
        background: 'transparent', color: 'var(--color-text)',
        minHeight: isMobile ? '92svh' : '100svh',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Top bar — logo + nav */}
      <header style={{
        position: 'relative', zIndex: 3, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `var(--space-5) ${gutter}`,
      }}>
        <img src={LOGO_SRC} alt="Codos" style={{ height: 'var(--logo-h-header)', width: 'auto', display: 'block' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--space-3)' : 'var(--space-6)', fontSize: 'var(--text-body-sm)' }}>
          {!isMobile && COPY.nav.map((n) => (
            <a key={n.label} href={n.href} className="lp-link" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>{n.label}</a>
          ))}
          <a href="#demo" onClick={onCta} className="lp-btn lp-btn--accent" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'var(--color-accent)', color: 'var(--color-accent-contrast)',
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)',
            textDecoration: 'none', fontSize: 'var(--text-body-sm)', whiteSpace: 'nowrap',
          }}>
            {COPY.ctaPrimary}
          </a>
        </nav>
      </header>

      {/* Particle cloud — centerpiece (scroll-animated in Task 2) */}
      <img
        ref={particleRef}
        data-hero-particles
        src={PARTICLES_SRC}
        alt=""
        aria-hidden="true"
        style={{
          // Strictly vertically centred in the hero viewport: top:50% anchors the
          // box's mid-line, translate(-50%,-50%) pulls it back by half its own size.
          // The scroll effect keeps the -50% baseline and adds the dock drift on top.
          // z-index:0 keeps it above the hero's fill but below the hero content AND
          // below the diagnostic card (StepSection grid is z-index:1), so when it
          // docks it underlays that translucent grey card. Width ≤100% (never wider
          // than the viewport) so the un-clipped hero can't trigger horizontal scroll.
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)', transformOrigin: 'center center', willChange: 'transform',
          width: isMobile ? '100%' : 'min(92vw, 1040px)', maxWidth: 'none', height: 'auto',
          // z-index:-1 → above the body cream canvas but below every section's content
          // (which is in normal flow / positive z). The diagnostic grey fill is pushed
          // to z-index:-2 so the particle sits between grey and the card's text.
          pointerEvents: 'none', userSelect: 'none', zIndex: -1,
        }}
      />

      {/* Split headline */}
      <div style={{ position: 'relative', zIndex: 2, padding: `0 ${gutter}`, marginTop: isMobile ? 'var(--space-5)' : 'var(--space-2)', flexShrink: 0 }}>
        <h1 style={{
          margin: 0, display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: isMobile ? 0 : 'var(--space-6)',
        }}>
          <span style={headlineWord}>{COPY.heroWordLeft}</span>
          <span style={{ ...headlineWord, textAlign: isMobile ? 'left' : 'right' }}>{COPY.heroWordRight}</span>
        </h1>
      </div>

      {/* Lower content — lede + CTAs (top), credentials (bottom) */}
      <div style={{
        position: 'relative', zIndex: 2, flex: '1 1 auto',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-8)',
        padding: `var(--space-6) ${gutter} var(--space-8)`,
      }}>
        <div style={{ maxWidth: isMobile ? '100%' : 'min(100%, 28rem)' }}>
          <p style={{
            margin: 0, fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-intro)', lineHeight: 'var(--leading-intro)',
            color: 'var(--color-text)', maxWidth: '100%', overflowWrap: 'break-word',
          }}>
            {COPY.heroLede}
          </p>
          <CtaPair onCta={onCta} style={{ marginTop: 'var(--space-5)' }} />
        </div>

        {/* Credentials — partner / backer logos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-faint)',
          }}>
            Backed by builders from
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(var(--space-4), 3vw, var(--space-8))', flexWrap: 'wrap' }}>
            {PARTNER_LOGOS.map((l) => (
              <img
                key={l.alt}
                className="lp-logo"
                src={l.src}
                alt={l.alt}
                style={{ height: `calc(${l.h} * clamp(16px, 1.7vw, 24px))`, width: 'auto', display: 'block', opacity: 0.72 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────── FaqAccordion ─────────────────
// Controlled accordion (replaces native <details>) so open/close can animate
// smoothly (height via grid-template-rows + opacity, in index.css). One row open
// at a time; first row open by default. Reduced-motion handled by the CSS hooks.
function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {COPY.faq.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} style={{ borderBottom: 'var(--border-thin) solid var(--color-border)', padding: 'var(--space-4) 0' }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="lp-acc-summary"
              style={{
                width: '100%', appearance: 'none', background: 'none', border: 'none',
                padding: 0, margin: 0, textAlign: 'left', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)',
                fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h4)', lineHeight: 1.2,
              }}
            >
              <span style={{ flex: 1 }}>{f.q}</span>
              <span className="lp-acc-mark" data-open={isOpen} style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)', display: 'inline-block', flexShrink: 0 }}>+</span>
            </button>
            <div className="lp-acc-panel" data-open={isOpen}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-muted)', marginTop: 'var(--space-3)', maxWidth: '48ch' }}>{f.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────── Editorial Landing (root) ─────────────────
type Props = { onCtaClick?: () => void };

export default function EditorialLanding({ onCtaClick }: Props) {
  const isMobile = useIsMobile();
  const handleCta = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  return (
    <div style={S.wrap}>
      {/* HERO (Figma 33:78) — full-bleed */}
      <Hero onCta={handleCta} />

      {/* DIAGNOSTIC (Figma 55:2) */}
      <DiagnosticSection />

      {/* CONTEXT GRAPH (Figma 55:22) */}
      <ContextGraphSection />

      {/* TRANSFORM / EXEC DASHBOARD (Figma 56:344 — _stepThree) */}
      <TransformDashboardSection />

      {/* WHO IT'S FOR — the scroll particle releases (un-pins) when this section arrives */}
      <section data-particle-release="true" style={{ ...SECTION, borderTop: 'var(--border-thin) solid var(--color-border)' }}>
        <Reveal><SectionHead kicker={COPY.whoKicker} title={COPY.whoTitle} titleMaxW="24ch" /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          {COPY.who.map((w, i) => (
            <Reveal key={w.name} delay={i * 90} style={{ height: '100%' }}>
              <Panel hover style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', height: '100%', boxSizing: 'border-box' }}>
                <Chip>{w.range}</Chip>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h3)', lineHeight: 1.1 }}>{w.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-muted)' }}>{w.body}</div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BUILD VS BUY */}
      <section style={SECTION}>
        <Reveal><SectionHead kicker="analysis" title={COPY.buildVsBuyTitle} sub={COPY.buildVsBuySub} titleMaxW="18ch" /></Reveal>
        <Reveal delay={90}><Panel style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr 1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)', borderBottom: 'var(--border-thin) solid var(--color-border-strong)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            {!isMobile && <div>Metric</div>}
            <div>Build it yourself</div>
            <div style={{ color: 'var(--color-status-live)' }}>With Codos</div>
          </div>
          {COPY.compareRows.map((r) => (
            <div key={r.metric} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr 1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderBottom: 'var(--border-thin) solid var(--color-border)', alignItems: 'center' }}>
              <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto', fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h4)', lineHeight: 1.15, marginBottom: isMobile ? 'var(--space-2)' : 0 }}>{r.metric}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', color: 'var(--color-muted)' }}>{r.diy}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Dot color="var(--color-status-live)" />{r.codos}
              </div>
            </div>
          ))}
        </Panel></Reveal>
        {/* Section CTA — same component + tokens as the hero's button pair */}
        <Reveal delay={140}>
          <CtaPair onCta={handleCta} style={{ marginTop: 'var(--space-6)' }} />
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* TEAM — headline in column 1 of the step-row grid, the member-card pair in
          columns 2–3 (so the cards start exactly at CARD 2's left edge). Stacks on mobile. */}
      <section id="team" style={{ ...SECTION, borderTop: 'var(--border-thin) solid var(--color-border)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : STEP_GRID_COLS,
          gap: isMobile ? 'var(--space-6)' : STEP_GRID_GAP, alignItems: 'start',
        }}>
          <Reveal style={{ gridColumn: isMobile ? 'auto' : '1 / 2' }}><SectionHead kicker={COPY.teamKicker} title={COPY.teamTitle} titleMaxW="14ch" /></Reveal>
          <div style={{ gridColumn: isMobile ? 'auto' : '2 / 4', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: STEP_GRID_GAP, minWidth: 0 }}>
            {COPY.team.map((p, i) => {
              const photo = p.name.startsWith('Dima') ? '/assets/founder-1.png' : '/assets/founder-2.png';
              return (
                <Reveal key={p.name} delay={i * 100} style={{ height: '100%' }}>
                <Panel hover style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', boxSizing: 'border-box', height: '100%' }}>
                  <div style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-panel-chip)' }}>
                    <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h3)', lineHeight: 1.1 }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginTop: 'var(--space-2)' }}>{p.role}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    {p.bio.map((b, j) => <div key={j} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--leading-body-sm)', color: 'var(--color-muted)' }}>{b}</div>)}
                  </div>
                </Panel>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ — headline in column 1 of the step-row grid, accordion in columns 2–3
          (locked to the SAME grid as the team cards, referencing the shared grid
          constants directly — not the team section's layout). Stacks on mobile. */}
      <section id="faq" style={SECTION}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : STEP_GRID_COLS,
          gap: isMobile ? 'var(--space-6)' : STEP_GRID_GAP, alignItems: 'start',
        }}>
          <Reveal style={{ gridColumn: isMobile ? 'auto' : '1 / 2' }}><SectionHead kicker={COPY.faqKicker} title={COPY.faqTitle} titleMaxW="14ch" /></Reveal>
          <Reveal delay={90} style={{ gridColumn: isMobile ? 'auto' : '2 / 4', minWidth: 0 }}>
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA — whole section filled brand orange (particles stay). Text is
          dark ink (best contrast on this orange); the primary button is a dark fill
          (never orange-on-orange) so it reads clearly as a button. */}
      <section id="demo" style={{ ...SECTION, position: 'relative', overflow: 'hidden', background: 'var(--color-accent)', color: 'var(--color-text)' }}>
        <img src={PARTICLES_SRC} alt="" aria-hidden="true" style={{ position: 'absolute', right: '-6%', top: '50%', transform: 'translateY(-50%)', width: 'clamp(16rem, 34vw, 34rem)', height: 'auto', opacity: 0.55, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
        <Reveal>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '36rem' }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-h1)', lineHeight: 'var(--leading-h1)', fontWeight: REG, letterSpacing: '-0.02em', margin: 0, color: 'var(--color-text)' }}>
              Ready to run your business <span style={{ fontFamily: 'var(--font-body)' }}>like&nbsp;code?</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-intro)', lineHeight: 'var(--leading-intro)', color: 'var(--color-text)', margin: 'var(--space-5) 0 0' }}>{COPY.closingSub}</p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
              <a href="#" onClick={handleCta} className="lp-btn lp-btn--filled" style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-text)', color: 'var(--color-bg)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', lineHeight: 1, padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-full)', textDecoration: 'none' }}>{COPY.ctaPrimary}</a>
              <a href={`mailto:${COPY.founderEmail}`} className="lp-btn lp-btn--outline" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)', lineHeight: 1, padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-full)', border: 'var(--border-thin) solid var(--color-text)', textDecoration: 'none' }}>{COPY.heroCtaSecondary}</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER — continues the orange of the closing CTA (one unbroken orange block,
          no cream strip beneath). Ink text/links for contrast on the orange. */}
      <footer style={{ ...SECTION, background: 'var(--color-accent)', color: 'var(--color-text)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 'var(--space-4)' : 'var(--space-6)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-sm)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={LOGO_SRC} alt="Codos" style={{ height: 'var(--logo-h-footer)', width: 'auto', display: 'block' }} />
          <span>© {new Date().getFullYear()} Codos, Inc.</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#" className="lp-link--on-accent" style={{ textDecoration: 'none' }}>Privacy</a>
          <a href="#" className="lp-link--on-accent" style={{ textDecoration: 'none' }}>Terms</a>
          <a href={`mailto:${COPY.founderEmail}`} className="lp-link--on-accent" style={{ textDecoration: 'none' }}>{COPY.founderEmail}</a>
          <a href="https://unknw.com" target="_blank" rel="noopener noreferrer" className="lp-link--on-accent" style={{ textDecoration: 'none' }}>designed by UNKNW</a>
        </div>
      </footer>
    </div>
  );
}
