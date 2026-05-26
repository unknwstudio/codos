import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

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

// ───────────────── useTween + figures ─────────────────
function useTween(from: number, to: number, { duration = 1200, delay = 0 }: { duration?: number; delay?: number } = {}) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    let raf = 0;
    let startAt = 0;
    let cancelled = false;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      if (cancelled) return;
      if (!startAt) startAt = now;
      const elapsed = now - startAt - delay;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(1, elapsed / duration);
      setValue(from + (to - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [from, to, duration, delay]);
  return value;
}

function TweenedFigure({ from, to, decimals, prefix = '', suffix = '', delay = 0, serif, ink }: {
  from: number; to: number; decimals: number; prefix?: string; suffix?: string; delay?: number; serif: string; ink: string;
}) {
  const v = useTween(from, to, { duration: 1300, delay });
  const display = v.toFixed(decimals);
  return (
    <div style={{
      fontFamily: serif, fontWeight: 400,
      fontSize: 52, lineHeight: 1, letterSpacing: -1.5,
      marginTop: 14, color: ink,
      display: 'flex', alignItems: 'baseline',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {prefix && <span style={{ fontSize: 26, marginRight: 2 }}>{prefix}</span>}
      {display}
      {suffix && <span style={{ fontSize: 26, marginLeft: 2 }}>{suffix}</span>}
    </div>
  );
}

function TweenedHeadcount({ target, delay = 0, serif, ink }: { target: number; delay?: number; serif: string; ink: string }) {
  const v = useTween(0, target, { duration: 900, delay });
  return (
    <div style={{
      fontFamily: serif, fontSize: 28, fontWeight: 400, letterSpacing: -0.6,
      marginTop: 12, color: ink, lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {Math.round(v)}
    </div>
  );
}

function PilotMetric({ from, to, decimals, prefix = '', suffix = '', delay = 0, serif, accent }: {
  from: number; to: number; decimals: number; prefix?: string; suffix?: string; delay?: number; serif: string; accent: string;
}) {
  const v = useTween(from, to, { duration: 1200, delay });
  return (
    <span style={{
      fontFamily: serif, fontSize: 34, fontWeight: 400, letterSpacing: -0.8, color: accent,
      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
    }}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
}

// ───────────────── VoiceOrb (canvas) ─────────────────
type OrbState = 'speaking' | 'listening' | 'thinking';
type OrbPalette = 'terracotta' | 'emerald' | 'amber';

function VoiceOrb({ state = 'speaking', palette = 'terracotta' }: { state?: OrbState; palette?: OrbPalette }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);

  const PALETTES = useMemo(() => ({
    terracotta: { tint: { r: 242, g: 107, b: 31 }, grads: [{ r: 255, g: 234, b: 215 }, { r: 245, g: 170, b: 110 }, { r: 210, g: 90, b: 30 }, { r: 90, g: 30, b: 10 }] },
    emerald:    { tint: { r: 16, g: 185, b: 129 }, grads: [{ r: 209, g: 250, b: 229 }, { r: 52, g: 211, b: 153 }, { r: 4, g: 120, b: 87 }, { r: 6, g: 78, b: 59 }] },
    amber:      { tint: { r: 245, g: 158, b: 11 }, grads: [{ r: 254, g: 243, b: 199 }, { r: 251, g: 191, b: 36 }, { r: 180, g: 83, b: 9 }, { r: 69, g: 26, b: 3 }] },
  }), []);

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cssSize = canvas.clientWidth || 320;
    const applySize = () => {
      cssSize = canvas.clientWidth || cssSize;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cssSize * dpr;
      canvas.height = cssSize * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    applySize();
    const bootRaf = requestAnimationFrame(applySize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(applySize) : null;
    ro && ro.observe(canvas);

    const startT = performance.now();
    let rafId = 0;
    let amp = 0;
    let targetAmp = 0;

    const synth = setInterval(() => {
      const nt = (performance.now() - startT) / 1000;
      const s = stateRef.current;
      if (s === 'speaking') {
        const w = Math.sin(nt * 4.2) * 0.35 + Math.sin(nt * 7.1) * 0.22 + Math.sin(nt * 11.5) * 0.14;
        targetAmp = Math.max(0.2, Math.min(1, 0.55 + w * 0.45));
      } else if (s === 'listening') {
        const w = Math.sin(nt * 3.3) * 0.3 + Math.sin(nt * 6.7) * 0.18;
        targetAmp = Math.max(0.15, Math.min(0.85, 0.4 + w * 0.4));
      } else if (s === 'thinking') {
        targetAmp = 0.22 + Math.sin(nt * 0.7) * 0.05;
      } else {
        targetAmp = 0;
      }
    }, 50);

    const pal = PALETTES[palette] || PALETTES.terracotta;
    const draw = () => {
      const now = (performance.now() - startT) / 1000;
      amp += (targetAmp - amp) * 0.12;

      const CX = cssSize / 2;
      const CY = cssSize / 2;
      const BASE_R = cssSize * 0.276;
      const breath = Math.sin(now * (Math.PI / 2)) * 0.02;
      const s = stateRef.current;
      const audioDrive = s === 'thinking' ? 0 : amp;
      const r = BASE_R * (1 + breath + audioDrive * 0.1);
      const tintRGBA = (a: number) => `rgba(${pal.tint.r},${pal.tint.g},${pal.tint.b},${a})`;

      ctx.clearRect(0, 0, cssSize, cssSize);

      ctx.save();
      ctx.filter = 'blur(50px)';
      const R1 = r * 1.95;
      const g1 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R1);
      g1.addColorStop(0, tintRGBA(0.28 + amp * 0.22));
      g1.addColorStop(0.55, tintRGBA(0.08));
      g1.addColorStop(1, tintRGBA(0));
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(CX, CY, R1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.filter = 'blur(24px)';
      const R2 = r * 1.32;
      const g2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, R2);
      g2.addColorStop(0, tintRGBA(0.4));
      g2.addColorStop(0.7, tintRGBA(0.08));
      g2.addColorStop(1, tintRGBA(0));
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(CX, CY, R2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const rot = s === 'thinking' ? now * 0.5 : now * 0.15;
      const disp = 5 + audioDrive * 18;
      ctx.save();
      ctx.filter = 'blur(0.6px)';
      ctx.beginPath();
      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const n =
          Math.sin(a * 3 + now * 0.8 + rot) * 0.5 +
          Math.sin(a * 5 - now * 0.55) * 0.3 +
          Math.sin(a * 7 + now * 1.1 + rot * 0.3) * 0.2;
        const rr = r + n * disp;
        const x = CX + Math.cos(a) * rr;
        const y = CY + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const core = ctx.createRadialGradient(CX - r * 0.22, CY - r * 0.28, r * 0.08, CX, CY, r * 1.15);
      const p = pal.grads;
      core.addColorStop(0, `rgb(${p[0].r},${p[0].g},${p[0].b})`);
      core.addColorStop(0.32, `rgb(${p[1].r},${p[1].g},${p[1].b})`);
      core.addColorStop(0.72, `rgb(${p[2].r},${p[2].g},${p[2].b})`);
      core.addColorStop(1, `rgb(${p[3].r},${p[3].g},${p[3].b})`);
      ctx.fillStyle = core;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.filter = 'blur(14px)';
      const hx = CX - r * 0.24;
      const hy = CY - r * 0.32;
      const hl = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.62);
      hl.addColorStop(0, 'rgba(255,255,255,0.6)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(hx, hy, r * 0.62, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      ctx.filter = 'blur(6px)';
      ctx.fillStyle = tintRGBA(0.5);
      ctx.beginPath();
      ctx.arc(CX, CY, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(bootRaf);
      clearInterval(synth);
      ro && ro.disconnect();
    };
  }, [palette, PALETTES]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

// ───────────────── InterviewMock ─────────────────
function InterviewMock() {
  const SCRIPT: { state: OrbState; who: 'AI' | 'you' | null; text: string; ms: number }[] = [
    { state: 'speaking',  who: 'AI',  text: 'Tell me about your go-to-market motion. How do deals typically start?', ms: 4800 },
    { state: 'listening', who: 'you', text: 'Most start inbound — a founder demo request. Then AE qualifies, SE joins for technical depth…', ms: 5600 },
    { state: 'thinking',  who: null,  text: 'Analyzing…', ms: 1800 },
    { state: 'speaking',  who: 'AI',  text: 'Got it. What percentage convert from demo to paid pilot?', ms: 3600 },
    { state: 'listening', who: 'you', text: 'Roughly 34% last quarter. Faster on sub-500-seat. Enterprise drags to 8 weeks…', ms: 5200 },
    { state: 'thinking',  who: null,  text: 'Analyzing…', ms: 1600 },
    { state: 'speaking',  who: 'AI',  text: "Noted. Let's map how your team handles qualification today.", ms: 4200 },
  ];

  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const turn = SCRIPT[idx];
    const t = setTimeout(() => setIdx((i) => (i + 1) % SCRIPT.length), turn.ms);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    const start = Date.now();
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(iv);
  }, []);

  const turn = SCRIPT[idx];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const bg = '#faf5ec';
  const text = '#1a1a1a';
  const dim = 'rgba(26,26,26,0.55)';
  const border = 'rgba(26,26,26,0.08)';
  const panel = 'rgba(26,26,26,0.02)';

  const statusLabel: Record<OrbState, string> = {
    listening: 'Listening',
    speaking: 'AI speaking',
    thinking: 'Thinking',
  };
  const statusColor: Record<OrbState, string> = {
    listening: '#10b981',
    speaking: ACCENT,
    thinking: '#f59e0b',
  };

  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 12,
      overflow: 'hidden',
      fontFamily: 'Urbanist, sans-serif',
      color: text,
      aspectRatio: '16/10',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${border}`, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>›_</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Diagnostic interviews</div>
            <div style={{ fontSize: 10, color: dim, marginTop: 1, whiteSpace: 'nowrap' }}>Session · VP Sales · {mm}:{ss}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[turn.state], boxShadow: `0 0 10px ${statusColor[turn.state]}` }} />
          <span style={{ color: dim }}>{statusLabel[turn.state]}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '24px 24px 16px', position: 'relative' }}>
        <div style={{ width: '52%', maxWidth: 360, aspectRatio: '1/1' }}>
          <VoiceOrb
            state={turn.state}
            palette={turn.state === 'listening' ? 'emerald' : turn.state === 'thinking' ? 'amber' : 'terracotta'}
          />
        </div>
        <div style={{ maxWidth: '78%', minHeight: 56, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {turn.who && (
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.2, color: turn.who === 'AI' ? ACCENT : dim, fontWeight: 600, fontFamily: '"Geist Mono", monospace' }}>
              {turn.who === 'AI' ? 'AI · Codos' : 'You'}
            </div>
          )}
          <div
            key={idx}
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 18, lineHeight: 1.4, letterSpacing: -0.3,
              color: turn.state === 'thinking' ? dim : text,
              fontStyle: turn.state === 'thinking' ? 'italic' : 'normal',
              animation: 'interviewFade 500ms ease',
            }}
          >
            {turn.text}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: `1px solid ${border}`, background: panel, fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: dim }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
            </svg>
            Mic on
          </div>
          <div>Phase 2 of 5 · Go-to-market</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '5px 12px', border: `1px solid ${border}`, borderRadius: 6, color: dim }}>Pause</div>
          <div style={{ padding: '5px 12px', background: ACCENT, color: '#fff', borderRadius: 6, fontWeight: 600 }}>End turn</div>
        </div>
      </div>

      <style>{`@keyframes interviewFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ───────────────── ContextGraph ─────────────────
function NodeBox({ x, y, w, h, tone = 'plain', label, sub }: { x: number; y: number; w: number; h: number; tone?: 'plain' | 'accent' | 'emphasis'; label: string; sub: string }) {
  const pct = (n: number, total: number) => `${(n / total) * 100}%`;
  const ink = '#1a1a1a';
  const bg = '#faf5ec';
  const toneStyles: Record<string, { bg: string; border: string; labelColor: string; subColor: string }> = {
    plain:    { bg, border: 'rgba(26,26,26,0.22)', labelColor: ink, subColor: 'rgba(26,26,26,0.55)' },
    accent:   { bg: 'rgba(242,107,31,0.07)', border: ACCENT, labelColor: ACCENT, subColor: 'rgba(26,26,26,0.6)' },
    emphasis: { bg: ink, border: ink, labelColor: bg, subColor: 'rgba(250,245,236,0.6)' },
  };
  const t = toneStyles[tone];
  return (
    <div style={{
      position: 'absolute',
      left: pct(x, 960), top: pct(y, 510),
      width: pct(w, 960), height: pct(h, 510),
      background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '8px 14px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12, fontWeight: 500, color: t.labelColor, letterSpacing: 0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ fontSize: 10.5, color: t.subColor, marginTop: 2, letterSpacing: 0.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
    </div>
  );
}

function ContextGraphMock() {
  const bg = '#faf5ec';
  const ink = '#1a1a1a';
  const dim = 'rgba(26,26,26,0.6)';
  const faint = 'rgba(26,26,26,0.38)';
  const rule = 'rgba(26,26,26,0.12)';
  const ruleHi = 'rgba(26,26,26,0.22)';
  const accent = ACCENT;
  const serif = '"Fraunces", serif';
  const sans = 'Urbanist, sans-serif';
  const mono = '"Geist Mono", monospace';

  const sources = ['Interviews', 'Org chart', 'Metrics & OKRs', 'Meeting notes', 'Notion', 'Slack', 'Gmail', 'Hubspot', 'Google Sheets', 'Many more…'];
  const observers = [
    { x: 60,  label: 'observer · people',     sub: 'roles, depts, OKRs' },
    { x: 270, label: 'observer · product',    sub: 'tech stack, systems' },
    { x: 480, label: 'observer · operations', sub: 'process, financials' },
    { x: 690, label: 'observer · market',     sub: 'competitors, customers' },
  ];
  const obsY = 140;
  const obsW = 210, obsH = 64;
  const vaults = [
    { x: 80,  label: 'vault · company',         sub: 'stable facts' },
    { x: 360, label: 'vault · engagement',      sub: 'operational record' },
    { x: 640, label: 'vault · working-memory',  sub: 'synthesis & priorities' },
  ];
  const vaultY = 420;
  const vaultW = 240, vaultH = 64;
  const rawData = { x: 360, y: 8, w: 240, h: 60 };
  const merge = { x: 340, y: 290, w: 280, h: 60 };

  const cb = (n: { x: number; y: number; w?: number; h?: number }) => ({ x: n.x + (n.w ?? obsW) / 2, y: n.y + (n.h ?? obsH) });
  const ct = (n: { x: number; y: number; w?: number; h?: number }) => ({ x: n.x + (n.w ?? obsW) / 2, y: n.y });

  return (
    <div style={{ background: bg, borderRadius: 16, padding: '36px 40px 32px', color: ink, fontFamily: sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 18, borderBottom: `1px solid ${ruleHi}` }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.3, color: accent, textTransform: 'uppercase' }}>§02 · context graph · live</div>
          <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 28, lineHeight: 1.1, letterSpacing: -0.6, marginTop: 8, color: ink }}>
            Every signal, <span style={{ fontStyle: 'italic' }}>routed, deduped,</span> written to record.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, fontFamily: mono, fontSize: 10, color: dim, letterSpacing: 0.18, textTransform: 'uppercase' }}>
          <span>ingest</span><span style={{ color: faint }}>—</span>
          <span>observe</span><span style={{ color: faint }}>—</span>
          <span>merge</span><span style={{ color: faint }}>—</span>
          <span>vault</span>
        </div>
      </div>

      <div style={{ marginTop: 26, marginBottom: 6, fontFamily: mono, fontSize: 10, letterSpacing: 0.25, color: dim, textTransform: 'uppercase' }}>01 · sources</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, justifyContent: 'center' }}>
        {sources.map((s) => (
          <div key={s} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${ruleHi}`, borderRadius: 999, fontSize: 12, color: ink, fontFamily: mono, letterSpacing: 0.1, whiteSpace: 'nowrap' }}>{s}</div>
        ))}
      </div>

      <div style={{ height: 72, position: 'relative', marginBottom: -12 }}>
        <svg viewBox="0 0 960 72" width="100%" height="72" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const x = 72 + i * 90;
            const d = `M ${x} 0 C ${x} 36, ${480} 36, ${480} 72`;
            return <path key={i} d={d} stroke={rule} strokeWidth="1" fill="none" strokeDasharray="1 3" />;
          })}
          {Array.from({ length: 10 }).map((_, i) => {
            const x = 72 + i * 90;
            const d = `M ${x} 0 C ${x} 36, ${480} 36, ${480} 72`;
            return (
              <circle key={`dot-${i}`} r="1.8" fill={accent}>
                <animateMotion dur={`${2.6 + (i % 4) * 0.3}s`} repeatCount="indefinite" begin={`${(i * 0.22) % 2.4}s`} path={d} />
              </circle>
            );
          })}
        </svg>
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '960 / 510' }}>
        <svg viewBox="0 0 960 510" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <marker id="cgArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={ruleHi} />
            </marker>
          </defs>

          {observers.map((o, i) => {
            const from = cb(rawData);
            const to = ct({ ...o, y: obsY, w: obsW, h: obsH });
            const midY = (from.y + to.y) / 2;
            const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
            return (
              <g key={o.label}>
                <path d={d} stroke={ruleHi} strokeWidth="1" fill="none" markerEnd="url(#cgArrow)" />
                <circle r="2.5" fill={accent}>
                  <animateMotion dur={`${2.2 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} path={d} />
                </circle>
              </g>
            );
          })}

          {observers.map((o, i) => {
            const from = cb({ ...o, y: obsY, w: obsW, h: obsH });
            const to = ct(merge);
            const midY = (from.y + to.y) / 2;
            const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
            return (
              <g key={`to-merge-${i}`}>
                <path d={d} stroke={ruleHi} strokeWidth="1" fill="none" markerEnd="url(#cgArrow)" />
                <circle r="2" fill={ink} opacity="0.7">
                  <animateMotion dur={`${2.4 + i * 0.2}s`} repeatCount="indefinite" begin={`${0.8 + i * 0.3}s`} path={d} />
                </circle>
              </g>
            );
          })}

          {vaults.map((v, i) => {
            const from = cb(merge);
            const to = ct({ ...v, y: vaultY, w: vaultW, h: vaultH });
            const midY = (from.y + to.y) / 2;
            const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
            return (
              <g key={v.label}>
                <path d={d} stroke={ruleHi} strokeWidth="1" fill="none" markerEnd="url(#cgArrow)" />
                <circle r="2" fill={accent} opacity="0.85">
                  <animateMotion dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" begin={`${1.4 + i * 0.3}s`} path={d} />
                </circle>
              </g>
            );
          })}
        </svg>

        {[
          { y: rawData.y + rawData.h / 2 - 6, label: '02 · raw' },
          { y: obsY + obsH / 2 - 6,            label: '03 · observe' },
          { y: merge.y + merge.h / 2 - 6,      label: '04 · merge' },
          { y: vaultY + vaultH / 2 - 6,        label: '05 · vault' },
        ].map((r) => (
          <div key={r.label} style={{ position: 'absolute', left: 0, top: `${(r.y / 510) * 100}%`, fontFamily: mono, fontSize: 9, color: faint, letterSpacing: 0.2, textTransform: 'uppercase' }}>{r.label}</div>
        ))}

        <NodeBox x={rawData.x} y={rawData.y} w={rawData.w} h={rawData.h} tone="accent" label="raw-data/" sub="MD · PDF · XLSX · transcripts" />
        {observers.map((o) => (
          <NodeBox key={o.label} x={o.x} y={obsY} w={obsW} h={obsH} tone="plain" label={o.label} sub={o.sub} />
        ))}
        <NodeBox x={merge.x} y={merge.y} w={merge.w} h={merge.h} tone="emphasis" label="company-merge-judge" sub="dedup · resolve · write plan" />
        {vaults.map((v) => (
          <NodeBox key={v.label} x={v.x} y={vaultY} w={vaultW} h={vaultH} tone="plain" label={v.label} sub={v.sub} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 14, borderTop: `1px solid ${ruleHi}`, fontFamily: mono, fontSize: 10, color: dim, letterSpacing: 0.18, textTransform: 'uppercase' }}>
        <span>10 sources · 4 observers · 1 judge · 3 vaults</span>
        <span>updated <span style={{ color: ink }}>&lt; 1 min ago</span></span>
      </div>
    </div>
  );
}

// ───────────────── AccountReviewMock ─────────────────
function AccountReviewMock() {
  const bg = '#faf5ec';
  const ink = '#1a1a1a';
  const dim = 'rgba(26,26,26,0.6)';
  const faint = 'rgba(26,26,26,0.38)';
  const rule = 'rgba(26,26,26,0.1)';
  const ruleHi = 'rgba(26,26,26,0.18)';
  const accent = ACCENT;
  const risk = '#b5572b';
  const serif = '"Fraunces", serif';
  const sans = 'Urbanist, sans-serif';
  const mono = '"Geist Mono", monospace';

  const kpis = [
    { label: 'Token coverage',       fromNum: 78,  toNum: 85,  decimals: 0, prefix: '',  suffix: '%', delta: '+7pts',  prev: '78% last week',   dir: 'up' as const },
    { label: 'Revenue per employee', fromNum: 480, toNum: 500, decimals: 0, prefix: '$', suffix: 'K', delta: '+$20K',  prev: '$480K last week', dir: 'up' as const },
    { label: 'Headcount',            fromNum: 640, toNum: 621, decimals: 0, prefix: '',  suffix: '',  delta: '−19',    prev: '640 last week',   dir: 'down' as const },
    { label: 'AI savings, YTD',      fromNum: 7.2, toNum: 8.0, decimals: 1, prefix: '$', suffix: 'M', delta: '+$0.8M', prev: '$7.2M last week', dir: 'up' as const },
  ];

  const pilots = [
    { tag: 'Sales + CS', name: 'Sales Copilot',     fromNum: 0,   toNum: 1.4, decimals: 1, prefix: '$',  suffix: 'M', metricUnit: ' saved',         sub: 'Account-brief agent rolled out to 84 AEs. 22% lift in reply rate across 317 auto-briefed accounts.', status: 'on track' },
    { tag: 'R&D',        name: 'Developer Pilot',   fromNum: 0,   toNum: 38,  decimals: 0, prefix: '+',  suffix: '%', metricUnit: ' velocity',      sub: '18.2K → 25.1K LoC/week across a cohort of 48 engineers. Cycle time down 26%; PR-review agent live.', status: 'on track' },
    { tag: 'Context',    name: 'Token Coverage',    fromNum: 0,   toNum: 1,   decimals: 0, prefix: '+',  suffix: '',  metricUnit: ' source',         sub: 'Hubspot connected Monday. Coverage now 85% across Slack, Notion, Gmail and Hubspot. Google Drive on deck.', status: 'at risk' },
    { tag: 'People',     name: 'Change Management', fromNum: 0,   toNum: 120, decimals: 0, prefix: '',   suffix: '',  metricUnit: ' AI Champions',  sub: 'Up from 110 last week. Weekly office hours; 42-playbook internal library; NPS +12 among adopters.', status: 'on track' },
  ];

  const org = {
    ceo: { name: 'Maya Chen', title: 'CEO', okr: 'Grow revenue per employee 2× this year.' },
    functions: [
      { name: 'Sales',            lead: 'Derek Holt',      people: 114, status: 'on track', tone: 'ok',   okr: 'Close $40M net new ARR' },
      { name: 'Marketing',        lead: 'Priya Shah',      people: 16,  status: 'at risk',  tone: 'risk', okr: 'CAC payback < 9 mo' },
      { name: 'Product',          lead: 'Jonas Lindqvist', people: 30,  status: 'on track', tone: 'ok',   okr: 'Launch Payments to $5M ARR' },
      { name: 'Engineering',      lead: 'Leah Okafor',     people: 218, status: 'on track', tone: 'ok',   okr: 'Velocity +40%' },
      { name: 'Customer Support', lead: 'Marco Velasco',   people: 151, status: 'at risk',  tone: 'risk', okr: 'CSAT 94 · AHT −20%' },
      { name: 'Operations',       lead: 'Sana Devi',       people: 92,  status: 'on track', tone: 'ok',   okr: 'Save $3M in OpEx' },
    ],
  };

  const Delta = ({ dir, children }: { dir: 'up' | 'down'; children: React.ReactNode }) => (
    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.1, color: dir === 'down' ? risk : accent, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: 9 }}>{dir === 'down' ? '▼' : '▲'}</span>
      {children}
    </span>
  );

  return (
    <div style={{ background: bg, borderRadius: 16, padding: '36px 40px 40px', color: ink, fontFamily: sans }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 18, borderBottom: `1px solid ${ruleHi}` }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.3, color: accent, textTransform: 'uppercase' }}>weekly brief — wk 16 · 2026</div>
          <div style={{ fontFamily: serif, fontSize: 32, lineHeight: 1.05, letterSpacing: -0.8, marginTop: 8, fontWeight: 400 }}>Helix Corp.</div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: mono, fontSize: 10, color: dim, letterSpacing: 0.1, lineHeight: 1.6 }}>
          <div>account lead · codos</div>
          <div style={{ color: faint }}>dima@codos.ai</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 28 }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ padding: '2px 22px 6px', borderLeft: i === 0 ? 'none' : `1px solid ${rule}` }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.22, color: dim, textTransform: 'uppercase' }}>{k.label}</div>
            <TweenedFigure from={k.fromNum} to={k.toNum} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} delay={120 + i * 90} serif={serif} ink={ink} />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Delta dir={k.dir}>{k.delta}</Delta>
              <span style={{ fontSize: 11, color: faint, fontStyle: 'italic' }}>vs {k.prev}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 44, marginBottom: 20, paddingBottom: 10, borderBottom: `1px solid ${ruleHi}` }}>
        <span style={{ fontFamily: serif, fontSize: 20, fontStyle: 'italic', fontWeight: 400, letterSpacing: -0.3 }}>Pilots in flight</span>
        <span style={{ fontFamily: mono, fontSize: 10, color: faint, letterSpacing: 0.2 }}>§01 · four active</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
        {pilots.map((p, i) => (
          <div key={p.name} style={{ padding: '4px 22px 4px', borderLeft: i === 0 ? 'none' : `1px solid ${rule}` }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.22, color: dim, textTransform: 'uppercase' }}>{p.tag}</div>
            <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, letterSpacing: -0.4, marginTop: 10 }}>{p.name}</div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline' }}>
              <PilotMetric
                from={p.fromNum} to={p.toNum} decimals={p.decimals}
                prefix={p.prefix} suffix={p.suffix}
                delay={400 + i * 220}
                serif={serif} accent={accent}
              />
              <span style={{ fontSize: 12, color: dim, marginLeft: 6, fontStyle: 'italic' }}>{p.metricUnit}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: dim, marginTop: 10, marginBottom: 12 }}>{p.sub}</p>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.18, textTransform: 'uppercase', color: p.status === 'at risk' ? risk : dim, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.status === 'at risk' ? risk : ink, opacity: p.status === 'at risk' ? 1 : 0.5 }} />
              {p.status}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 44, marginBottom: 24, paddingBottom: 10, borderBottom: `1px solid ${ruleHi}` }}>
        <span style={{ fontFamily: serif, fontSize: 20, fontStyle: 'italic', fontWeight: 400, letterSpacing: -0.3 }}>Organization</span>
        <span style={{ fontFamily: mono, fontSize: 10, color: faint, letterSpacing: 0.2 }}>§02 · 621 people across 6 functions</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ textAlign: 'center', maxWidth: 460, animation: 'arCeoIn 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both' }}>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.25, color: accent, textTransform: 'uppercase' }}>CEO</div>
          <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 400, letterSpacing: -0.4, marginTop: 6 }}>{org.ceo.name}</div>
          <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: dim, marginTop: 8, letterSpacing: -0.1 }}>"{org.ceo.okr}"</div>
        </div>
      </div>

      <svg viewBox="0 0 1200 44" width="100%" height="44" preserveAspectRatio="none" style={{ display: 'block', marginTop: 18, overflow: 'visible' }}>
        <line x1="600" y1="0" x2="600" y2="16" stroke={ruleHi} strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'arTreeTrunk 400ms ease-out 500ms forwards' }} />
        <line x1="600" y1="16" x2="100" y2="16" stroke={ruleHi} strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'arTreeTrunk 500ms ease-out 900ms forwards' }} />
        <line x1="600" y1="16" x2="1100" y2="16" stroke={ruleHi} strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'arTreeTrunk 500ms ease-out 900ms forwards' }} />
        {[100, 300, 500, 700, 900, 1100].map((x, i) => (
          <line key={x} x1={x} y1="16" x2={x} y2="44" stroke={ruleHi} strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: `arTreeTrunk 300ms ease-out ${1400 + i * 80}ms forwards` }} />
        ))}
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
        {org.functions.map((f, i) => (
          <div key={f.name} style={{ padding: '14px 14px 4px', textAlign: 'center', animation: `arFuncIn 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both`, animationDelay: `${1500 + i * 90}ms` }}>
            <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 400, letterSpacing: -0.2, color: ink }}>{f.name}</div>
            <div style={{ fontSize: 11, color: faint, marginTop: 2 }}>{f.lead}</div>
            <TweenedHeadcount target={f.people} delay={1600 + i * 90} serif={serif} ink={ink} />
            <div style={{ fontFamily: mono, fontSize: 8, color: faint, letterSpacing: 0.25, textTransform: 'uppercase', marginTop: 2 }}>people</div>
            <div style={{ fontSize: 11, color: dim, marginTop: 12, lineHeight: 1.35, minHeight: 28 }}>{f.okr}</div>
            <div style={{ marginTop: 10, fontFamily: mono, fontSize: 9, letterSpacing: 0.25, textTransform: 'uppercase', color: f.tone === 'risk' ? risk : dim, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: f.tone === 'risk' ? risk : ink, opacity: f.tone === 'risk' ? 1 : 0.45 }} />
              {f.status}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes arCeoIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes arTreeTrunk { to { stroke-dashoffset: 0; } }
        @keyframes arFuncIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${ruleHi}`, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560, background: '#ffffff', border: `1px solid ${ruleHi}`, borderRadius: 20, boxShadow: '0 30px 60px -24px rgba(26,26,26,0.18), 0 2px 4px rgba(26,26,26,0.04)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${rule}`, background: 'rgba(26,26,26,0.02)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e2574c' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e2b24a' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#5fb878' }} />
            <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 10, letterSpacing: 0.22, color: faint, textTransform: 'uppercase' }}>helix-caio · live</span>
          </div>
          <div style={{ padding: '36px 28px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 160, height: 160 }}>
              <VoiceOrb state="speaking" palette="terracotta" />
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.3, color: accent, textTransform: 'uppercase', marginTop: 18 }}>§03 · always on</div>
            <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 38, lineHeight: 1.05, letterSpacing: -0.8, marginTop: 10, color: ink, textAlign: 'center' }}>
              Talk to <span style={{ fontStyle: 'italic', color: accent }}>Helix CAIO</span>.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderTop: `1px solid ${rule}`, background: 'rgba(26,26,26,0.02)' }}>
            <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: faint, flex: 1 }}>Ask anything about Helix Corp…</span>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: ink, color: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────── Scrollable mobile wrapper ─────────────────
function ScrollableMock({ minWidth, children }: { minWidth: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollLeft > 8) setShowHint(false);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          borderRadius: 8,
        }}
      >
        <div style={{ minWidth }}>{children}</div>
      </div>
      {showHint && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%', right: 0, transform: 'translateY(-50%)',
            width: 56, height: '90%',
            background: 'linear-gradient(to left, rgba(245,241,234,0.95), rgba(245,241,234,0))',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingRight: 6, pointerEvents: 'none',
            borderTopRightRadius: 8, borderBottomRightRadius: 8,
          }}
        >
          <span
            style={{
              fontFamily: '"Geist Mono", monospace', fontSize: 10,
              color: ACCENT, letterSpacing: 0.18, textTransform: 'uppercase',
              writingMode: 'vertical-rl' as CSSProperties['writingMode'],
              textOrientation: 'mixed', opacity: 0.9,
            }}
          >
            Scroll →
          </span>
        </div>
      )}
    </div>
  );
}

// ───────────────── ProductShowcase ─────────────────
function ProductShowcase() {
  const [tab, setTab] = useState<'interview' | 'context' | 'dashboard'>('interview');
  const isMobile = useIsMobile();
  const titles = {
    interview: { prefix: 'A ', em: 'listening',     suffix: ' agent — not a form.' },
    context:   { prefix: 'A living ', em: 'context graph', suffix: ' of your company.' },
    dashboard: { prefix: '',  em: 'CAIO',            suffix: ' agent to run your transformation.' },
  } as const;
  const t = titles[tab];

  const tabs = [
    { id: 'interview' as const, label: 'Diagnostic interviews', kicker: '01' },
    { id: 'context'   as const, label: 'Context graph',         kicker: '02' },
    { id: 'dashboard' as const, label: 'Transformation',        kicker: '03' },
  ];

  return (
    <section style={{ padding: isMobile ? '36px 0 64px' : '60px 0 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 32 }}>
        <div style={S.kicker}>The product</div>
        <h2 style={{ ...S.serif, fontSize: isMobile ? 30 : 48, lineHeight: 1.1, letterSpacing: isMobile ? -0.6 : -1, fontWeight: 400, margin: 0, maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
          {t.prefix}<em style={{ color: ACCENT }}>{t.em}</em>{t.suffix}
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'flex-start' : 'center',
          gap: 4, marginBottom: isMobile ? 18 : 28,
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? 6 : 0,
          marginLeft: isMobile ? -20 : 0, marginRight: isMobile ? -20 : 0,
          paddingLeft: isMobile ? 20 : 0, paddingRight: isMobile ? 20 : 0,
          scrollbarWidth: 'none',
        }}
      >
        {tabs.map((tb) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: isMobile ? '8px 14px' : '10px 18px',
                background: active ? '#1a1a1a' : 'transparent',
                color: active ? '#fff' : 'rgba(0,0,0,0.55)',
                border: active ? '1px solid #1a1a1a' : '1px solid rgba(0,0,0,0.12)',
                borderRadius: 999, cursor: 'pointer',
                fontFamily: 'Urbanist, sans-serif', fontSize: isMobile ? 12 : 13, fontWeight: 500,
                letterSpacing: 0.1, transition: 'all 200ms ease',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: active ? ACCENT : 'rgba(0,0,0,0.4)' }}>{tb.kicker}</span>
              {tb.label}
            </button>
          );
        })}
      </div>

      <div style={{
        background: '#faf5ec',
        borderRadius: isMobile ? 16 : 24,
        padding: isMobile ? 12 : 24,
        boxShadow: isMobile ? '0 20px 40px -20px rgba(0,0,0,0.12)' : '0 40px 80px -20px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'background 400ms ease',
        overflow: 'hidden',
      }}>
        {tab === 'interview' ? <InterviewMock />
          : tab === 'context' ? (
            isMobile ? (
              <ScrollableMock minWidth={780}>
                <ContextGraphMock />
              </ScrollableMock>
            ) : <ContextGraphMock />
          )
          : (
            isMobile ? (
              <ScrollableMock minWidth={780}>
                <AccountReviewMock />
              </ScrollableMock>
            ) : <AccountReviewMock />
          )}
      </div>
    </section>
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

        <ProductShowcase />

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
