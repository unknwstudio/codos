import React, { useEffect, useRef, useState, type CSSProperties } from 'react';

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
    { label: 'Solution', href: '#solution' },
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
    fontFamily: 'Urbanist, sans-serif',
    background: '#f5f1ea',
    color: '#1a1a1a',
    minHeight: '100vh',
  } as CSSProperties,
  inner: { maxWidth: 1180, margin: '0 auto', padding: '0 48px' } as CSSProperties,
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
  body: { fontSize: 16, lineHeight: 1.6, color: '#3a3a3a' } as CSSProperties,
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

// ───────────────── FeelingSection ─────────────────
function FeelingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = [
    { text: 'You feel FOMO about AI.',                       color: 'rgba(0,0,0,0.32)', italic: false, scale: 1.0,  delay: 0,    bold: false },
    { text: 'You sense the team should be moving faster.',   color: 'rgba(0,0,0,0.55)', italic: false, scale: 1.05, delay: 350,  bold: false },
    { text: "It's time to accelerate.",                       color: ACCENT,            italic: true,  scale: 1.22, delay: 750,  bold: true  },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? '64px 0 72px' : '120px 0 140px',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        fontFamily: "'Urbanist', system-ui, sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: ACCENT, marginBottom: isMobile ? 28 : 48,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        The feeling
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 18 : 28, padding: isMobile ? '0 12px' : 0 }}>
        {lines.map((ln, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: (isMobile ? 22 : 44) * ln.scale, lineHeight: 1.2, letterSpacing: isMobile ? -0.4 : -0.8,
              color: ln.color, fontStyle: ln.italic ? 'italic' : 'normal',
              fontWeight: ln.bold ? 500 : 400,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0) translateY(0)' : `translateX(${i % 2 === 0 ? '-80px' : '80px'}) translateY(20px)`,
              filter: visible ? 'blur(0)' : 'blur(6px)',
              transition: `opacity 800ms cubic-bezier(0.2, 0.8, 0.2, 1) ${ln.delay}ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${ln.delay}ms, filter 800ms ease ${ln.delay}ms`,
              willChange: 'transform, opacity, filter',
            }}
          >
            {ln.text}
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────── How it works (sequential fly-in) ─────────────────
function HowItWorksSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="how" ref={ref} style={{ padding: isMobile ? '56px 0' : '80px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 64 }}>
        <div style={S.kicker}>{COPY.howKicker}</div>
        <h2 style={{ ...S.serif, fontSize: isMobile ? 32 : 56, lineHeight: 1.05, letterSpacing: isMobile ? -0.8 : -1.2, fontWeight: 400, margin: '0 auto', maxWidth: 720 }}>{COPY.howTitle}</h2>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 32 : 0,
          position: 'relative',
        }}
      >
        {!isMobile && (
          <div
            style={{
              position: 'absolute', top: 30, left: '8%', right: '8%',
              height: 1, background: 'rgba(0,0,0,0.15)',
              transformOrigin: 'left center',
              transform: visible ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1200ms cubic-bezier(0.2, 0.8, 0.2, 1) 200ms',
            }}
          />
        )}
        {COPY.howSteps.map((s, i) => {
          const delay = i * 350;
          return (
            <div
              key={s.name}
              style={{
                textAlign: 'center', padding: '0 20px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                filter: visible ? 'blur(0)' : 'blur(8px)',
                transition: `opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, filter 700ms ease ${delay}ms`,
                willChange: 'transform, opacity, filter',
              }}
            >
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: ACCENT, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', ...S.serif,
                fontSize: 24, fontWeight: 500, position: 'relative', zIndex: 2,
                transform: visible ? 'scale(1)' : 'scale(0.5)',
                transition: `transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 100}ms`,
              }}>{i + 1}</div>
              <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: ACCENT, letterSpacing: 0.15, textTransform: 'uppercase', marginBottom: 8 }}>{s.time}</div>
              <div style={{ ...S.serif, fontSize: 26, fontWeight: 400, letterSpacing: -0.3, marginBottom: 10 }}>{s.name}</div>
              <div style={{ ...S.body, fontSize: 14, maxWidth: 280, margin: '0 auto' }}>{s.body}</div>
            </div>
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

// "_stepN" + mixed verb/method headline (verb = headline face, method = mono),
// two-column on desktop. Shared by the diagnostic and graph sections.
function StepHeader({ step, verb, method, tagline, rightSub }: {
  step: string; verb: string; method: string; tagline: string; rightSub?: string;
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 0.85fr) minmax(0, 2fr)',
      gap: isMobile ? 'var(--space-4)' : 'var(--space-8)', alignItems: 'start',
    }}>
      <div>
        <div style={{ ...heading, fontFamily: 'var(--font-headline)' }}>{step}</div>
        <p style={sub}>{tagline}</p>
      </div>
      <div>
        <h2 style={heading}>
          <span style={{ fontFamily: 'var(--font-headline)' }}>{verb}</span>
          <span style={{ fontFamily: 'var(--font-body)' }}>{method}</span>
        </h2>
        {rightSub ? <p style={sub}>{rightSub}</p> : null}
      </div>
    </div>
  );
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: color, display: 'inline-block', flexShrink: 0 }} />
);

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
    <section data-section="diagnostic" style={{ padding: isMobile ? 'var(--space-10) 0' : 'var(--space-12) 0' }}>
      <StepHeader step={d.step} verb={d.verb} method={d.method} tagline={d.tagline} />

      {/* Live interview mock */}
      <div style={{
        marginTop: isMobile ? 'var(--space-6)' : 'var(--space-8)',
        background: 'var(--color-panel)', borderRadius: 'var(--radius-md)',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-6)',
        minHeight: isMobile ? 'auto' : '30rem',
      }}>
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

        {/* orb + agent tag */}
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <img src={PARTICLES_SRC} alt="" aria-hidden="true" style={{ width: 'clamp(180px, 32vw, 360px)', height: 'auto', display: 'block', pointerEvents: 'none', userSelect: 'none' }} />
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
    </section>
  );
}

// ───────────────── Hero (Figma 33:78) ─────────────────
// Full-bleed brand hero. Split "install / evolution" headline (GT Alpina
// Typewriter), particle cloud centerpiece, lede + dual CTAs, credentials.
// Every value comes from a token (var(--…)); no raw Figma px/hex.
function Hero({ onCta }: { onCta: (e: React.MouseEvent) => void }) {
  const isMobile = useIsMobile();
  const gutter = isMobile ? 'var(--space-5)' : 'var(--space-8)';

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
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const update = () => {
      raf = 0;
      const heroH = sec.offsetHeight || 1;
      // progress through the hero's exit (0 at top → 1 after one hero-height)
      const p = Math.min(1, Math.max(0, window.scrollY / heroH));
      const ease = smoothstep(p);
      // Particle centre's natural viewport-Y once the page has scrolled `heroH`.
      // offsetTop/offsetHeight are layout metrics (transform-independent).
      const naturalCenterAtEnd = img.offsetTop + img.offsetHeight / 2 - heroH;
      const drift = window.innerHeight / 2 - naturalCenterAtEnd; // → viewport centre
      const ty = ease * drift;
      const scale = 1 - 0.55 * ease;
      img.style.transform = `translate(-50%, ${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
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
  const btnBase: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-body-lg)',
    lineHeight: 1, textDecoration: 'none', cursor: 'pointer',
    padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-full)',
    border: 'var(--border-thin) solid transparent', whiteSpace: 'nowrap',
  };
  const btnFilled: CSSProperties = {
    ...btnBase, background: 'var(--color-surface)', color: 'var(--color-text)',
  };
  const btnOutline: CSSProperties = {
    ...btnBase, background: 'transparent', color: 'var(--color-text)',
    borderColor: 'var(--color-border-strong)',
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--color-bg)', color: 'var(--color-text)',
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
        <img src={LOGO_SRC} alt="Codos" style={{ height: 'clamp(24px, 2.2vw, 38px)', width: 'auto', display: 'block' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--space-3)' : 'var(--space-6)', fontSize: 'var(--text-body-sm)' }}>
          {!isMobile && COPY.nav.map((n) => (
            <a key={n.label} href={n.href} style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>{n.label}</a>
          ))}
          <a href="#demo" onClick={onCta} style={{
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
          position: 'absolute', left: '50%', top: isMobile ? '40%' : 'clamp(2rem, 4vw, 5rem)',
          transform: 'translateX(-50%)', transformOrigin: 'center center', willChange: 'transform',
          width: isMobile ? '124%' : 'min(92vw, 1040px)', maxWidth: 'none', height: 'auto',
          pointerEvents: 'none', userSelect: 'none', zIndex: 1,
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
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
            <a href="#demo" onClick={onCta} style={btnFilled}>{COPY.ctaPrimary}</a>
            <a href={`mailto:${COPY.founderEmail}`} style={btnOutline}>{COPY.heroCtaSecondary}</a>
          </div>
        </div>

        {/* Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {COPY.heroCredentials.map((c) => (
            <div key={c.num} style={{
              display: 'flex', gap: 'var(--space-3)', alignItems: 'baseline',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)',
              color: 'var(--color-faint)', letterSpacing: '0.04em',
            }}>
              <span style={{ color: 'var(--color-accent)' }}>{c.num}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
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

  const innerStyle: CSSProperties = { ...S.inner, padding: isMobile ? '0 20px' : '0 48px' };

  return (
    <div style={S.wrap}>
      {/* HERO (Figma 33:78) — full-bleed */}
      <Hero onCta={handleCta} />

      <div style={innerStyle}>
        <FeelingSection />

        {/* APPROACH */}
        <section id="solution" style={{ padding: isMobile ? '64px 0' : '100px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
            gap: isMobile ? 24 : 80,
            alignItems: 'start',
            marginBottom: isMobile ? 36 : 56,
          }}>
            <div>
              <div style={S.kicker}>{COPY.approachKicker}</div>
              <h2 style={{ ...S.serif, fontSize: isMobile ? 34 : 54, lineHeight: 1.05, letterSpacing: isMobile ? -0.8 : -1.2, fontWeight: 400, margin: 0 }}>
                {COPY.approachTitle}
              </h2>
            </div>
            <p style={{ ...S.body, fontSize: isMobile ? 16 : 18, maxWidth: 520, marginTop: isMobile ? 0 : 44 }}>
              {COPY.approachSub}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 32 }}>
            {COPY.approach.map((a) => (
              <div key={a.num} style={{ background: '#fff', borderRadius: 20, padding: isMobile ? 24 : 36, border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ ...S.serif, fontStyle: 'italic', fontSize: isMobile ? 32 : 40, color: ACCENT, fontWeight: 400, marginBottom: 16 }}>{a.num}</div>
                <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, marginBottom: 10, letterSpacing: -0.3 }}>{a.name}</div>
                <div style={{ ...S.body, fontSize: isMobile ? 14 : 15 }}>{a.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DIAGNOSTIC (Figma 55:2) — replaces the old switcher */}
        <DiagnosticSection />

        {/* WHO */}
        <section style={{ padding: isMobile ? '64px 0' : '100px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={S.kicker}>{COPY.whoKicker}</div>
          <h2 style={{ ...S.serif, fontSize: isMobile ? 32 : 56, lineHeight: 1.05, letterSpacing: isMobile ? -0.8 : -1.2, fontWeight: 400, margin: isMobile ? '0 0 32px' : '0 0 48px', maxWidth: 820 }}>
            {COPY.whoTitle}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 0,
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}>
            {COPY.who.map((w, i) => (
              <div
                key={w.name}
                style={{
                  padding: isMobile ? '24px 0' : '36px 28px 36px 0',
                  borderRight: !isMobile && i < 2 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  borderBottom: isMobile && i < 2 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  paddingLeft: !isMobile && i > 0 ? 28 : 0,
                }}
              >
                <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: ACCENT, letterSpacing: 0.15, textTransform: 'uppercase', marginBottom: 12 }}>{w.range}</div>
                <div style={{ ...S.serif, fontSize: isMobile ? 24 : 28, fontWeight: 400, letterSpacing: -0.4, marginBottom: 10 }}>{w.name}</div>
                <div style={{ ...S.body, fontSize: isMobile ? 14 : 15 }}>{w.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BUILD VS BUY */}
        <section style={{ padding: isMobile ? '56px 0' : '80px 0' }}>
          <div style={S.kicker}>Analysis</div>
          <h2 style={{ ...S.serif, fontSize: isMobile ? 30 : 48, lineHeight: 1.1, letterSpacing: isMobile ? -0.6 : -1, fontWeight: 400, margin: '0 0 12px', maxWidth: 720 }}>
            {COPY.buildVsBuyTitle}
          </h2>
          <p style={{ ...S.body, marginBottom: isMobile ? 24 : 40 }}>{COPY.buildVsBuySub}</p>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {COPY.compareRows.map((r) => (
                <div
                  key={r.metric}
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '20px 20px 18px',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    style={{
                      ...S.serif,
                      fontSize: 22, lineHeight: 1.15, letterSpacing: -0.4,
                      fontWeight: 400, marginBottom: 16,
                    }}
                  >
                    {r.metric}
                  </div>
                  <div
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 10,
                      paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span
                        style={{
                          fontFamily: '"Geist Mono", monospace', fontSize: 9,
                          color: 'rgba(0,0,0,0.45)', letterSpacing: 0.2,
                          textTransform: 'uppercase', minWidth: 44, flexShrink: 0,
                        }}
                      >
                        DIY
                      </span>
                      <span style={{ fontSize: 15, color: '#7a7a7a', textDecoration: 'line-through', textDecorationColor: 'rgba(0,0,0,0.18)' }}>
                        {r.diy}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span
                        style={{
                          fontFamily: '"Geist Mono", monospace', fontSize: 9,
                          color: ACCENT, letterSpacing: 0.2,
                          textTransform: 'uppercase', minWidth: 44, flexShrink: 0,
                        }}
                      >
                        Codos
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: ACCENT }} />
                        {r.codos}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 20, padding: '12px 32px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 0.15, textTransform: 'uppercase', color: '#888' }}>
                <div>Metric</div>
                <div>Build it yourself</div>
                <div style={{ color: ACCENT }}>With Codos</div>
              </div>
              {COPY.compareRows.map((r) => (
                <div key={r.metric} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '22px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.metric}</div>
                  <div style={{ ...S.body, fontSize: 15, color: '#8a8a8a' }}>{r.diy}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                    <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: ACCENT, marginRight: 10, verticalAlign: 'middle' }} />
                    {r.codos}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HOW */}
        <HowItWorksSection />

        {/* TEAM */}
        <section id="team" style={{ padding: isMobile ? '56px 0' : '80px 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
            <div style={S.kicker}>{COPY.teamKicker}</div>
            <h2 style={{ ...S.serif, fontSize: isMobile ? 32 : 56, lineHeight: 1.05, letterSpacing: isMobile ? -0.8 : -1.2, fontWeight: 400, margin: '0 auto', maxWidth: 720 }}>
              {COPY.teamTitle}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 18 : 28 }}>
            {COPY.team.map((p) => {
              const photo = p.name.startsWith('Dima') ? '/assets/founder-1.png' : '/assets/founder-2.png';
              return (
                <div key={p.name} style={{ background: '#fff', borderRadius: 20, padding: isMobile ? 24 : 32, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ aspectRatio: '1/1', background: '#f5ede0', borderRadius: 12, marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
                    <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                  </div>
                  <div style={{ ...S.serif, fontSize: isMobile ? 24 : 28, fontWeight: 400, letterSpacing: -0.3 }}>{p.name}</div>
                  <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: ACCENT, letterSpacing: 0.15, textTransform: 'uppercase', marginTop: 4, marginBottom: 14 }}>{p.role}</div>
                  {p.bio.map((b, i) => (
                    <div key={i} style={{ ...S.body, fontSize: 14, marginBottom: 4 }}>{b}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ padding: isMobile ? '56px 0' : '80px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
            <div style={S.kicker}>{COPY.faqKicker}</div>
            <h2 style={{ ...S.serif, fontSize: isMobile ? 28 : 48, lineHeight: 1.1, letterSpacing: isMobile ? -0.6 : -1, fontWeight: 400, margin: 0 }}>{COPY.faqTitle}</h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {COPY.faq.map((f, i) => (
              <details key={f.q} open={i === 0} style={{ padding: isMobile ? '18px 12px' : '22px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                <summary style={{ ...S.serif, fontSize: isMobile ? 18 : 22, fontWeight: 400, letterSpacing: -0.2, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ flex: 1 }}>{f.q}</span>
                  <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 14, color: ACCENT }}>+</span>
                </summary>
                <div style={{ ...S.body, fontSize: isMobile ? 14 : 15, marginTop: 10, maxWidth: 680 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section id="demo" style={{ padding: isMobile ? '48px 0 80px' : '80px 0 120px' }}>
          <div style={{
            background: '#1a1a1a', color: '#f5f1ea',
            borderRadius: isMobile ? 22 : 32,
            padding: isMobile ? '44px 24px' : '80px 60px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -120, right: -80, width: isMobile ? 260 : 400, height: isMobile ? 260 : 400, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`, opacity: 0.35 }} />
            <div style={{ position: 'relative', maxWidth: 680 }}>
              <h2 style={{ ...S.serif, fontSize: isMobile ? 34 : 64, lineHeight: 1.05, letterSpacing: isMobile ? -0.8 : -1.5, fontWeight: 400, margin: '0 0 16px' }}>
                Ready to run your business <em style={{ color: ACCENT }}>like code?</em>
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 18, lineHeight: 1.5, opacity: 0.7, marginBottom: isMobile ? 24 : 32 }}>{COPY.closingSub}</p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#" onClick={handleCta} style={{ ...S.btn, background: ACCENT, color: '#fff' }}>Book a 30-min call →</a>
                <a href={`mailto:${COPY.founderEmail}`} style={{ color: '#f5f1ea', textDecoration: 'underline', fontSize: 14, opacity: 0.8 }}>
                  ✉ {COPY.founderEmail}
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer
          style={{
            padding: isMobile ? '0 0 36px' : '0 0 64px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 14 : 0,
            fontSize: 13, color: '#6a6a6a',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <CodosLogo size={22} color="#1a1a1a" />
            <span>© {new Date().getFullYear()} Codos, Inc.</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Terms</a>
            <a href={`mailto:${COPY.founderEmail}`} style={{ color: '#6a6a6a', textDecoration: 'none' }}>{COPY.founderEmail}</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
