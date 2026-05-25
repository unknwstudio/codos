import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, Check, Mail, Copy, Phone, Download, ExternalLink,
  Shield, GitBranch, Terminal, Eye, Cpu, Code, Monitor, Clock,
  BarChart2, Bot, Zap, Activity, Settings, Database, Bug,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import founderPhoto from '../dima profile pic.jpeg';
import glebPhoto from '../gleb2.png';

/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const CTA_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3i1Ln5x0OopEqxxTQzfw6fWVy-M_-eAIfG0K-4pCOsATXssPqCNjJFuYl9uvKrp9ykG8kDEf61';
const ORG_QUIZ_URL = 'https://codos.ai/quiz';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Opt = { text: string; score: number };
type Question = {
  id: string;
  text: string;
  desc?: string;
  type: 'single' | 'number';
  options?: Opt[];
  placeholder?: string;
  key?: string;
  weight: number;
  rec?: string;
  tools?: string;
};
type Block = { id: string; name: string; desc: string; questions: Question[] };

/* ═══════════════════════════════════════════
   QUESTION DATA
   ═══════════════════════════════════════════ */
const BLOCKS: Block[] = [
  {
    id: 'foundation',
    name: 'Engineering Foundation',
    desc: 'Core engineering practices that form the foundation for AI adoption.',
    questions: [
      {
        id: 'f1', text: 'Does your team do code review?', type: 'single', weight: 1,
        options: [
          { text: 'No code review', score: 0 },
          { text: 'Sometimes', score: 1 },
          { text: 'Always, on every PR', score: 2 },
        ],
        rec: 'Establish mandatory code review on every PR before considering AI review tools. Code review is the foundation — without it, AI reviewers have no process to plug into. Start with a simple rule: no merge without at least one human approval. Tools: GitHub required reviews, GitLab merge request approvals.',
      },
      {
        id: 'f2', text: 'What\'s your automated test coverage?', type: 'single', weight: 2,
        options: [
          { text: 'No automated tests', score: 0 },
          { text: 'Partial (<60% coverage)', score: 1 },
          { text: '>60% coverage', score: 2 },
        ],
        rec: 'AI agents need a test suite to validate their work — without tests, every AI-generated change is a gamble. Target >60% coverage on critical paths first. Use AI to bootstrap: Claude Code can generate regression tests from existing code in hours, not weeks. One company went from 0% to 65% coverage in two sprints using AI-generated tests.',
      },
      {
        id: 'f3', text: 'Do you have a CI/CD pipeline?', type: 'single', weight: 2,
        options: [
          { text: 'No pipeline', score: 0 },
          { text: 'CI only (build + test)', score: 1 },
          { text: 'Full CI + CD (auto-deploy)', score: 2 },
        ],
        rec: 'AI agents need automated pipelines to ship through. Without CI/CD, every AI-generated PR requires manual deployment — destroying the speed advantage. Set up CI first (GitHub Actions, GitLab CI), then add CD. Target: every merge to main auto-deploys to staging. AI + CI/CD = code ships in minutes, not days.',
      },
      {
        id: 'f4', text: 'Are tickets automatically linked to merge requests?', type: 'single', weight: 2,
        options: [
          { text: 'No automatic linking', score: 0 },
          { text: 'Yes, tickets auto-linked to MRs', score: 1 },
        ],
        rec: 'Connect your issue tracker to your repo so every MR references a ticket. This is essential for AI agents — they need to understand why code is being changed, not just what. Tools: Linear + GitHub integration, Jira Smart Commits, GitLab issue references. Takes 30 minutes to set up, pays dividends forever.',
      },
      {
        id: 'f5', text: 'What\'s your release cycle?', type: 'single', weight: 2,
        options: [
          { text: '>1 month', score: 0 },
          { text: '2–4 weeks', score: 1 },
          { text: '1–2 weeks', score: 2 },
          { text: '2–7 days', score: 3 },
          { text: '<2 days', score: 4 },
        ],
        rec: 'AI amplifies shipping speed, but only if your release process allows it. If deploys happen monthly, AI-generated PRs just pile up. Target: deploy at least twice a week. Shorten cycles by: automating testing, using feature flags, splitting monolithic releases into smaller increments. Teams that deploy daily ship 10x more value than monthly deployers.',
      },
      {
        id: 'f6', text: 'Do you have automated vulnerability scanning?', type: 'single', weight: 2,
        options: [
          { text: 'Nothing', score: 0 },
          { text: 'Static analyzers (Snyk, SonarQube, etc.)', score: 1 },
          { text: 'AI-powered security analysis', score: 2 },
        ],
        rec: 'AI-generated code needs automated security review — it can introduce vulnerabilities humans wouldn\'t write. Start with static analyzers (Snyk, SonarQube) in CI. Then add AI-powered security review: Claude can analyze PRs for OWASP top 10, injection risks, auth bypasses. One team caught 3 critical vulnerabilities in AI-generated code in the first week of adding automated scanning.',
        tools: 'Snyk, SonarQube, Claude Code',
      },
      {
        id: 'f7', text: 'What\'s your average PR cycle time?', type: 'single', weight: 2,
        options: [
          { text: '72h+', score: 0 },
          { text: '24–72h', score: 1 },
          { text: '6–24h', score: 2 },
          { text: '<6h', score: 3 },
        ],
        rec: 'Every hour of PR wait compounds — 72h cycles mean engineers context-switch 3+ times before their code lands. Make AI the first reviewer on every PR. Tools: Claude Code hooks, Greptile, Macroscope. Auto-merge PRs that pass AI review + CI. Target: <6h from open to merge. One company went from 72h to <6h and saw 2x deployment frequency.',
        tools: 'Greptile, Claude Code, Macroscope',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI in Engineering',
    desc: 'How deeply AI is embedded in your engineering workflows.',
    questions: [
      {
        id: 'a1', text: 'What % of your team uses AI coding tools?', type: 'single', weight: 4,
        desc: 'Claude Code, Cursor, Copilot, Windsurf, or similar.',
        options: [
          { text: '<25%', score: 0 },
          { text: '25–95%', score: 1 },
          { text: 'Everyone', score: 3 },
        ],
        rec: 'Mandate Claude Code or Cursor for 100% of engineers. Add CLAUDE.md files in every repo with architecture context and coding standards. Teams going from <25% to full adoption see 2–3x throughput — engineers spend less time on boilerplate, tests, and context-switching. Budget: ~$100–200/seat/month. ROI: 10x+ within month one. Best teams provide engineers unlimited API budgets and run competitions on who burns more — top AI devs can burn $3–4K/day.',
        tools: 'Claude Code, Cursor, Copilot',
      },
      {
        id: 'a2', text: 'What % of your PRs are reviewed by AI?', type: 'single', weight: 5,
        options: [
          { text: 'No AI review', score: 0 },
          { text: 'Shadow mode (AI reviews but humans decide)', score: 1 },
          { text: 'AI auto-approves low-risk PRs', score: 2 },
          { text: 'AI auto-approves >75% of all PRs', score: 3 },
        ],
        rec: 'Add AI code review (Greptile, Claude Code, Macroscope) as a mandatory CI check. AI catches what humans miss: security vulnerabilities, performance regressions, missing tests, style violations. Frees senior engineers from routine review — they focus on architecture only. One team\'s seniors got back 1–2 hrs/day previously spent on code review.',
        tools: 'Greptile, Claude Code, Macroscope',
      },
      {
        id: 'a3', text: 'Does your team use AI for writing tests?', type: 'single', weight: 3,
        options: [
          { text: 'Not using AI for tests', score: 0 },
          { text: 'Experimenting', score: 1 },
          { text: 'Most of our tests are generated by AI from documentation', score: 2 },
        ],
        rec: 'Use Claude Code to auto-generate regression tests from every PR. AI can write unit tests, integration tests, and edge-case tests faster than humans. One company cut their release cycle from 3 weeks to 2–3 days by automating QA with AI + a device test farm. Target: 75%+ automated test coverage within one quarter.',
      },
      {
        id: 'a4', text: 'Does your team use AI for bug/log analysis?', type: 'single', weight: 3,
        options: [
          { text: 'No AI for debugging', score: 0 },
          { text: 'Ad-hoc AI deployment for incident analysis', score: 1 },
          { text: 'We have always-on AI agent that monitors telemetry stream', score: 2 },
        ],
        rec: 'Connect your error tracking (Sentry, Datadog) to AI for automated root-cause analysis. AI can correlate stack traces, recent deploys, and log patterns to identify bugs in minutes vs. hours. Start with a simple workflow: error alert → AI analyzes logs + recent commits → suggests fix.',
        tools: 'Sentry, Datadog, Claude Code',
      },
      {
        id: 'a5', text: 'Does your team maintain a set of custom skills and agents?', type: 'single', weight: 3,
        desc: 'E.g. gstack, custom Claude skills, multi-agent workflows.',
        options: [
          { text: 'No', score: 0 },
          { text: 'Individuals are experimenting with these', score: 1 },
          { text: 'We have an established agentic engineering pipeline', score: 2 },
        ],
        rec: 'Move beyond basic code completion. Set up CLAUDE.md files with project context, custom skills (see gstack — github.com/garrytan/gstack), and multi-agent workflows where one agent plans while others execute in parallel. Top engineers don\'t write code — they orchestrate 5–10 agents that write, test, and review simultaneously.',
        tools: 'github.com/garrytan/gstack',
      },
      {
        id: 'a7', text: 'Do you have always-on AI engineer?', type: 'single', weight: 4,
        desc: 'Agents running 24/7 on routine tasks: dependency updates, test fixes, linting, migrations.',
        options: [
          { text: 'No', score: 0 },
          { text: 'We have guardrails but no always-on engineer', score: 1 },
          { text: 'Yes, it contributes <10% of all code', score: 2 },
          { text: 'Yes, it contributes 10–50% of all code', score: 3 },
          { text: 'Yes, it contributes >50% of all code', score: 4 },
        ],
        rec: 'Deploy always-on agents that work 24/7 on routine tasks: dependency updates, test fixes, documentation, linting, migration scripts. Start with 2–3 power users, measure output, then mandate org-wide. Always-on agents are the engineering equivalent of junior devs that never sleep and don\'t need onboarding. Try Hermes (Nous Research) or Claude Code on a VPS.',
        tools: 'Hermes, Claude Code, OpenClaw',
      },
      {
        id: 'a9', text: 'How many LOC does each engineer ship per day?', type: 'single', weight: 3,
        desc: 'Lines of Code measures raw AI-amplified output. Should be paired with quality metrics.',
        options: [
          { text: '<100', score: 0 },
          { text: '100–500', score: 1 },
          { text: '500–1K', score: 2 },
          { text: '>1K', score: 3 },
        ],
        rec: 'Engineers shipping <100 LOC/day are leaving 5–10x productivity on the table. The fix: (1) Claude Code or Cursor for every engineer, (2) CLAUDE.md in every repo, (3) parallel agent workflows. Top AI-augmented engineers ship 500–1K+ LOC/day of production-quality code. This is the new baseline.',
      },
    ],
  },
];

const TOTAL_SCORED = BLOCKS.flatMap(b => b.questions).filter(q => q.type === 'single');
const MAX_SCORE = TOTAL_SCORED.reduce((s, q) => {
  const maxOpt = Math.max(...(q.options || []).map(o => o.score));
  return s + maxOpt * q.weight;
}, 0); // 100

const BLOCK_MAX: Record<string, number> = {};
BLOCKS.forEach(b => {
  BLOCK_MAX[b.id] = b.questions.filter(q => q.type === 'single').reduce((s, q) => {
    return s + Math.max(...(q.options || []).map(o => o.score)) * q.weight;
  }, 0);
});

const TIERS = [
  { max: 20, level: 'L0', label: 'Weak Engineering Culture', color: '#ef4444',
    msg: 'Basic engineering practices are missing. Fix fundamentals — code review, CI/CD, testing — before investing in AI tools. The good news: once the foundation is in place, AI adoption can accelerate everything.' },
  { max: 40, level: 'L1', label: 'Pre-AI Engineering', color: '#f97316',
    msg: 'You have a solid engineering foundation but AI isn\'t yet part of the workflow. You\'re well-positioned to adopt AI tools — the infrastructure is ready. The recommendations below show where to start for maximum impact.' },
  { max: 60, level: 'L2', label: 'Experimenting with AI', color: '#60a5fa',
    msg: 'Some engineers are using AI tools, but it\'s not yet systematic. The gap between your AI-using engineers and the rest is likely growing. The initiatives below will help you move from individual experiments to team-wide adoption.' },
  { max: 80, level: 'L3', label: 'Deep AI Adoption', color: '#4ade80',
    msg: 'AI is embedded in your core workflows — review, testing, shipping. You\'re in the top 20% of engineering teams. The remaining gaps below are what separates deep adoption from full AI-native operation.' },
  { max: 100, level: 'L4', label: 'AI-Native Engineering', color: '#34d399',
    msg: 'AI is the default for every engineering process. Top 5% of teams. Your engineers orchestrate agents, not write code. Focus on maintaining your edge: orchestrator-of-orchestrators, knowledge compounding, and training the next wave.' },
];

const BLOCK_COLORS: Record<string, string> = {
  foundation: '#60a5fa',
  ai: '#fb923c',
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

const Q_ICONS: Record<string, React.FC<{ className?: string }>> = {
  f1: Eye, f2: Shield, f3: GitBranch, f4: Database, f5: Clock, f6: Shield, f7: Clock,
  a1: Terminal, a2: Code, a3: Shield, a4: Bug, a5: Settings,
  a7: Bot, a9: BarChart2,
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const EngQuizPage: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'quiz' | 'loading' | 'email' | 'results'>('landing');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [numbers, setNumbers] = useState<Record<string, number>>({});
  const [currentBlock, setCurrentBlock] = useState(0);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRole, setLeadRole] = useState('');
  const [leadTelegram, setLeadTelegram] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [expandedRecs, setExpandedRecs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const allQuestions = BLOCKS.flatMap(b => b.questions);
  const totalQ = allQuestions.length;

  /* ── Scoring ── */
  const computeScores = useCallback(() => {
    const blockScores: Record<string, number> = {};
    let totalRaw = 0;
    for (const b of BLOCKS) {
      let bRaw = 0;
      for (const q of b.questions) {
        if (q.type !== 'single') continue;
        const ai = answers[q.id];
        if (ai === undefined) continue;
        const s = q.options![ai]?.score ?? 0;
        bRaw += s * q.weight;
      }
      blockScores[b.id] = bRaw;
      totalRaw += bRaw;
    }
    return { blockScores, total: totalRaw };
  }, [answers]);

  /* ── Get gaps for recommendations ── */
  const getBlockGaps = useCallback((block: Block) => {
    const gaps: { q: Question; chosenScore: number; maxScore: number }[] = [];
    for (const q of block.questions) {
      if (q.type !== 'single' || !q.rec) continue;
      const ai = answers[q.id];
      if (ai === undefined) continue;
      const chosen = q.options![ai]?.score ?? 0;
      const max = Math.max(...q.options!.map(o => o.score));
      if (chosen < max) {
        gaps.push({ q, chosenScore: chosen, maxScore: max });
      }
    }
    return gaps.sort((a, b) => b.q.weight - a.q.weight);
  }, [answers]);

  /* ── Generate Markdown ── */
  const generateMarkdown = useCallback(() => {
    const { blockScores, total } = computeScores();
    const tier = TIERS.find(t => total <= t.max) || TIERS[TIERS.length - 1];
    const lines: string[] = [];

    lines.push('# Engineering AI Maturity Report');
    lines.push('');
    lines.push(`**Score: ${total}/${MAX_SCORE} — ${tier.level}: ${tier.label}**`);
    lines.push('');
    lines.push(tier.msg);
    lines.push('');

    for (const b of BLOCKS) {
      const bScore = blockScores[b.id] ?? 0;
      const bMax = BLOCK_MAX[b.id];
      lines.push(`## ${b.name} (${bScore}/${bMax})`);
      lines.push('');

      for (const q of b.questions) {
        if (q.type !== 'single') continue;
        const ai = answers[q.id];
        if (ai === undefined) continue;
        const chosen = q.options![ai];
        const max = Math.max(...q.options!.map(o => o.score));
        const qScore = chosen.score * q.weight;
        const qMax = max * q.weight;
        lines.push(`- **${q.text}** — ${chosen.text} (${qScore}/${qMax})`);
        if (chosen.score < max && q.rec) {
          lines.push(`  → ${q.rec}`);
          if (q.tools) lines.push(`  Tools: ${q.tools}`);
        }
      }
      lines.push('');
    }

    const engSize = numbers['engSize'];
    if (engSize) {
      lines.push(`**Team size:** ${engSize} engineers`);
      lines.push('');
    }

    return lines.join('\n');
  }, [computeScores, answers, numbers]);

  const handleCopyMarkdown = useCallback(async () => {
    const md = generateMarkdown();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateMarkdown]);

  /* ── Loading animation ── */
  useEffect(() => {
    if (screen !== 'loading') return;
    const labels = ['Engineering Foundation', 'AI Practices', 'Scoring', 'Generating Report'];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingStep(i); i++;
      if (i >= labels.length) { clearInterval(interval); setTimeout(() => setScreen('email'), 600); }
    }, 500);
    return () => clearInterval(interval);
  }, [screen]);

  /* ── Score animation ── */
  useEffect(() => {
    if (screen !== 'results') return;
    const { total } = computeScores();
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / 1800, 1);
      setAnimatedScore(Math.round(total * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [screen, computeScores]);

  /* ── Inject CSS ── */
  useEffect(() => {
    const id = 'eng-quiz-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes qFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes qPulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      @keyframes qShimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      .q-fade { animation: qFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
      .q-glass { background:rgba(255,255,255,0.015); backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px); border:1px solid rgba(255,255,255,0.06); }
      .q-glass:hover { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.09); }
    `;
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ── Email submit ── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      const { blockScores, total } = computeScores();
      const tier = TIERS.find(t => total <= t.max) || TIERS[TIERS.length - 1];
      await supabase.from('eng_quiz_results').insert({
        name: leadName.trim(),
        email: leadEmail.trim(),
        role: leadRole.trim() || null,
        telegram: leadTelegram.trim() || null,
        team_size: numbers['engSize'] || null,
        score_foundation: blockScores['foundation'] ?? 0,
        score_ai: blockScores['ai'] ?? 0,
        score_total: total,
        tier: tier.level,
        answers,
      });
    } catch { /* silent */ }
    setLeadSubmitting(false);
    setLeadDone(true);
    setScreen('results');
  };

  /* ═══════════════════════════════════════════════
     LANDING SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'landing') {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-xl w-full text-center relative z-10 q-fade">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-10 q-glass" style={{ color: '#fb923c' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" style={{ animation: 'qPulse 2s ease infinite' }} />
            Engineering Deep-Dive
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-[-0.04em] mb-6 leading-[1.05]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            How AI-Ready Is<br />
            <span style={{ background: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Engineering Team
            </span>?
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md mx-auto" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Assess your team's engineering foundation and AI maturity — with actionable recommendations to 10x your output.
          </p>

          <div className="flex justify-center gap-8 mb-12 text-xs text-gray-500 font-medium tracking-wide uppercase">
            {[`${totalQ} questions`, '10 min', 'Instant report'].map(b => (
              <span key={b} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-orange-500/60" />{b}
              </span>
            ))}
          </div>

          <button onClick={() => { setScreen('quiz'); setCurrentBlock(0); }}
            className="group relative px-10 py-4.5 rounded-2xl font-semibold text-base text-white transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            <span className="relative z-10 flex items-center gap-3">
              Start Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 40px rgba(249,115,22,0.4), 0 0 80px rgba(249,115,22,0.15)' }} />
          </button>

          {/* Built by */}
          <div className="mt-14 mb-8 w-full max-w-lg mx-auto">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-600 mb-5 text-center" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Built by</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Dima Khanarin', photo: founderPhoto, href: 'https://www.linkedin.com/in/dimakhanarin/',
                  lines: ['CEO, Everclear Foundation ($5BN volume, Pantera-backed)', 'Consultant, McKinsey'] },
                { name: 'Gleb Sidora', photo: glebPhoto, href: 'https://www.linkedin.com/in/arodiss',
                  lines: ['ML Engineer, Meta', 'Founding engineer, Condukt (Lightspeed-backed)'] },
              ].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noreferrer"
                  className="q-glass rounded-xl p-3 text-left hover:border-orange-500/20 transition-all duration-300 block">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800">
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{p.name}</p>
                  <p className="text-[9px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: '#f97316', fontFamily: "'Space Grotesk',sans-serif" }}>Co-founder</p>
                  {p.lines.map(l => (
                    <p key={l} className="text-[11px] text-gray-500 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{l}</p>
                  ))}
                </a>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <a href="https://codos.ai" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors duration-300">Codos</a>
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     QUIZ SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'quiz') {
    const safeBlock = Math.min(currentBlock, BLOCKS.length - 1);
    const block = BLOCKS[safeBlock];
    const progress = ((safeBlock + 1) / BLOCKS.length) * 100;
    const col = BLOCK_COLORS[block.id] || '#f97316';

    return (
      <div className="min-h-screen text-white flex flex-col" style={{ background: '#0a0a0f' }}>
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.04] px-6 py-4" style={{ background: 'rgba(10,10,15,0.7)' }}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => safeBlock > 0 ? setCurrentBlock(safeBlock - 1) : setScreen('landing')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-4 h-4" />{safeBlock > 0 ? 'Back' : 'Exit'}
            </button>
            <div className="flex-1 mx-8">
              <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f97316, #fb923c)' }} />
              </div>
            </div>
            <span className="text-xs font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{safeBlock + 1}/{BLOCKS.length}</span>
          </div>
        </div>

        {/* Block content */}
        <div className="flex-1 flex items-start justify-center px-6 py-10">
          <div className="max-w-2xl w-full q-fade" key={block.id}>
            {/* Block header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] mb-4"
                style={{ color: col, background: `${col}15`, border: `1px solid ${col}25` }}>
                {block.name}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {block.desc}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {block.questions.map((q, qi) => {
                const Icon = Q_ICONS[q.id];
                return (
                  <div key={q.id} className="q-fade" style={{ animationDelay: `${qi * 0.06}s` }}>
                    <div className="flex items-start gap-3 mb-3">
                      {Icon && (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${col}10`, border: `1px solid ${col}20` }}>
                          <Icon className="w-4 h-4" style={{ color: col }} />
                        </div>
                      )}
                      <div>
                        <p className="text-[15px] font-semibold text-white leading-snug" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                          {q.text}
                        </p>
                        {q.desc && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{q.desc}</p>
                        )}
                      </div>
                    </div>

                    {q.type === 'single' && q.options && (
                      <div className="flex flex-wrap gap-2 ml-11">
                        {q.options.map((opt, oi) => {
                          const selected = answers[q.id] === oi;
                          return (
                            <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                              style={{
                                background: selected ? `${col}20` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${selected ? `${col}50` : 'rgba(255,255,255,0.06)'}`,
                                color: selected ? col : 'rgba(255,255,255,0.6)',
                                fontFamily: "'Plus Jakarta Sans',sans-serif",
                              }}>
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'number' && (
                      <div className="ml-11">
                        <input type="number" placeholder={q.placeholder} min={0}
                          value={numbers[q.key || ''] || ''}
                          onChange={e => {
                            const v = parseInt(e.target.value) || 0;
                            setNumbers(prev => ({ ...prev, [q.key || '']: v }));
                          }}
                          className="bg-transparent rounded-xl px-5 py-3 text-sm text-white outline-none transition-all duration-300 w-40 placeholder:text-gray-600"
                          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                          onFocus={e => e.target.style.borderColor = `${col}60`}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-end mt-12 pb-8">
              <button
                onClick={() => {
                  if (safeBlock < BLOCKS.length - 1) {
                    setCurrentBlock(safeBlock + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setScreen('loading');
                  }
                }}
                className="group px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                {safeBlock === BLOCKS.length - 1 ? 'See Results' : 'Next'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     LOADING SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'loading') {
    const labels = ['Engineering Foundation', 'AI Practices', 'Scoring', 'Generating Report'];
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6" style={{ background: '#0a0a0f' }}>
        <div className="max-w-md w-full q-fade">
          <div className="flex flex-col items-center mb-12">
            <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 border-t-orange-500 mb-8"
              style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-xl font-semibold text-white tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              Analyzing Your Team
            </p>
          </div>
          <div className="space-y-3">
            {labels.map((label, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500"
                style={{
                  background: i <= loadingStep ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i <= loadingStep ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)'}`,
                }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{ background: i <= loadingStep ? '#f97316' : 'rgba(255,255,255,0.06)' }}>
                  {i <= loadingStep && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium transition-colors duration-500"
                  style={{ color: i <= loadingStep ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     EMAIL GATE SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'email' && !leadDone) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-md w-full relative z-10 q-fade">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <Mail className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-[-0.03em] mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              Your Report Is Ready
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Enter your details to see the full Engineering AI Maturity Report with scores and personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input type="text" placeholder="Your name" required value={leadName}
              onChange={e => setLeadName(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="email" placeholder="work@company.com" required value={leadEmail}
              onChange={e => setLeadEmail(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="text" placeholder="Your role (e.g. CTO, VP Eng, Tech Lead)" value={leadRole}
              onChange={e => setLeadRole(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="text" placeholder="Telegram @handle (optional)" value={leadTelegram}
              onChange={e => setLeadTelegram(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <button type="submit" disabled={leadSubmitting || !leadEmail.trim() || !leadName.trim()}
              className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              {leadSubmitting ? 'Generating...' : 'See My Report'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     RESULTS SCREEN
     ═══════════════════════════════════════════════ */
  const { blockScores, total } = computeScores();
  const tier = TIERS.find(t => total <= t.max) || TIERS[TIERS.length - 1];
  const scoreCirc = 2 * Math.PI * 72;
  const scorePct = MAX_SCORE > 0 ? animatedScore / MAX_SCORE : 0;
  const scoreOffset = scoreCirc - scorePct * scoreCirc;

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0f' }}>

      {/* ─── Score Hero ─── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${tier.color}12, transparent 70%)` }} />

        <div className="relative z-10 text-center pt-20 pb-16 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-10" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Engineering AI Maturity Score
          </p>

          {/* Score ring */}
          <div className="relative w-[200px] h-[200px] mx-auto mb-8">
            <svg viewBox="0 0 160 160" className="w-full h-full" style={{ filter: `drop-shadow(0 0 30px ${tier.color}20)` }}>
              <defs>
                <linearGradient id="engScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={tier.color} />
                  <stop offset="100%" stopColor={tier.color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle cx="80" cy="80" r="72" fill="none" stroke="url(#engScoreGrad)" strokeWidth="5"
                strokeLinecap="round" strokeDasharray={scoreCirc} strokeDashoffset={scoreOffset}
                transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold font-mono tracking-tighter" style={{ color: tier.color, fontFamily: "'JetBrains Mono',monospace" }}>
                {animatedScore}
              </span>
              <span className="text-[10px] font-mono text-gray-500 mt-0.5">/{MAX_SCORE}</span>
              <span className="text-xs font-semibold tracking-wide uppercase mt-2" style={{ color: tier.color, opacity: 0.8 }}>
                {tier.level} — {tier.label}
              </span>
            </div>
          </div>

          <p className="text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {tier.msg}
          </p>
        </div>

        <div className="h-px mx-auto max-w-5xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ─── Block Score Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {BLOCKS.map((b, bi) => {
            const bScore = blockScores[b.id] ?? 0;
            const bMax = BLOCK_MAX[b.id];
            const pct = bMax > 0 ? (bScore / bMax) * 100 : 0;
            const col = BLOCK_COLORS[b.id] || '#f97316';
            const barCol = pct >= 70 ? '#4ade80' : pct >= 40 ? '#fbbf24' : col;

            return (
              <div key={b.id} className="relative rounded-2xl overflow-hidden q-fade"
                style={{ animationDelay: `${bi * 0.1}s`, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${col}60, ${col}20, transparent)` }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: col }} />
                    <h4 className="text-[15px] font-bold tracking-[-0.01em]" style={{ color: col, fontFamily: "'Space Grotesk',sans-serif" }}>{b.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full transition-all duration-[1.5s] ease-out"
                        style={{ width: `${Math.max(pct, 2)}%`, background: `linear-gradient(90deg, ${barCol}, ${barCol}80)` }} />
                    </div>
                    <span className="text-sm font-bold font-mono" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono',monospace" }}>
                      {bScore}/{bMax}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Recommendations ─── */}
        {BLOCKS.map((b, bi) => {
          const gaps = getBlockGaps(b);
          if (gaps.length === 0) return null;
          const col = BLOCK_COLORS[b.id] || '#f97316';

          return (
            <div key={b.id} className="mb-16 q-fade" style={{ animationDelay: `${0.2 + bi * 0.1}s` }}>
              <h3 className="text-2xl font-bold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                {b.name} — Recommendations
              </h3>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Top initiatives sorted by impact weight
              </p>

              <div className="space-y-3">
                {gaps.map(({ q }, idx) => {
                  const impLabel = q.weight >= 5 ? 'High' : q.weight >= 3 ? 'Med' : 'Low';
                  const impColor = q.weight >= 5 ? ['rgba(249,115,22,0.12)', '#f97316'] : q.weight >= 3 ? ['rgba(251,191,36,0.1)', '#fbbf24'] : ['rgba(255,255,255,0.04)', '#666'];
                  const isExpanded = expandedRecs[q.id] || false;
                  return (
                    <div key={q.id} className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                      onClick={() => setExpandedRecs(prev => ({ ...prev, [q.id]: !prev[q.id] }))}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold font-mono flex items-center justify-center w-[22px] h-[22px] rounded-md shrink-0"
                          style={{ color: col, background: `${col}15`, fontFamily: "'JetBrains Mono',monospace" }}>{idx + 1}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded"
                          style={{ color: impColor[1], background: impColor[0], fontFamily: "'Space Grotesk',sans-serif" }}>{impLabel}</span>
                      </div>
                      <p className="text-[13px] leading-[1.6] font-medium" style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        color: 'rgba(255,255,255,0.78)',
                        ...(isExpanded ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
                      }}>{q.rec}</p>
                      {!isExpanded && (
                        <p className="text-[10px] mt-1.5" style={{ color: `${col}70`, fontFamily: "'Space Grotesk',sans-serif" }}>show more ▾</p>
                      )}
                      {q.tools && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.tools.split(', ').map(t => (
                            <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                              style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ─── CTA ─── */}
        <div className="text-center rounded-3xl p-14 mb-12 q-glass q-fade relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.06), transparent 70%)' }} />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-[-0.03em] mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              What's Next?
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed mb-8" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Copy your report to use with AI planning tools, take the full organization assessment, or book a diagnostic call to map 100+ initiatives across every function.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 q-glass"
                style={copied ? { color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' } : { color: '#9ca3af' }}>
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Report</>}
              </button>
              <a href={ORG_QUIZ_URL} target="_blank" rel="noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-300 relative"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <Zap className="w-4 h-4" />
                Full Org Assessment
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 40px rgba(249,115,22,0.35)' }} />
              </a>
              <a href={CTA_URL} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-gray-400 font-semibold text-sm transition-all duration-300 hover:text-white q-glass">
                <Phone className="w-4 h-4" /> Book Diagnostic Call
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 pb-12" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <a href="https://codos.ai" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">Codos</a>
        </p>
      </div>
    </div>
  );
};

export default EngQuizPage;
