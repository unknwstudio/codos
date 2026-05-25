import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Phone, ExternalLink, Check, Copy, Link2,
  Users, DollarSign, Zap, Target, Bot, BookOpen, Award, Building2, Layers,
  Key, Brain, Database, Settings, Calculator,
  Code, Terminal, Shield, GitBranch, Cpu, Monitor, Clock, Eye, BarChart2,
  Sparkles, FileText, Mic, RefreshCw, Send,
  Repeat, MessageSquare, Activity,
  Megaphone, Pencil, Search, Laptop, ClipboardList,
} from 'lucide-react';
import { supabase } from '../supabaseClient';

/* ═══════════════════════════════════════════
   CONFIG (mirrored from QuizPage)
   ═══════════════════════════════════════════ */
const CTA_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3i1Ln5x0OopEqxxTQzfw6fWVy-M_-eAIfG0K-4pCOsATXssPqCNjJFuYl9uvKrp9ykG8kDEf61';
const PLAYBOOK_URL = 'http://136.243.91.17:8080/guides/';

const BLOCK_COLORS: Record<string, string> = {
  org: '#818cf8', data: '#22d3ee', eng: '#60a5fa', sales: '#fb923c',
  support: '#4ade80', marketing: '#c084fc', product: '#f87171', ops: '#a78bfa',
};

const QUADRANT_MAP: { key: string; label: string; icon: string; qIds: string[] }[] = [
  { key: 'q1', label: 'Role Models', icon: '\u{1F464}', qIds: ['org_9', 'org_6', 'org_3'] },
  { key: 'q2', label: 'Skills Development', icon: '\u{1F6E0}', qIds: ['org_7', 'data_2', 'data_1'] },
  { key: 'q3', label: 'Understanding & Conviction', icon: '\u{1F4A1}', qIds: ['org_5', 'data_6', 'data_5'] },
  { key: 'q4', label: 'Formal Mechanisms', icon: '\u{2699}', qIds: ['org_8', 'org_4', 'data_4', 'data_3'] },
];

const Q_ICONS: Record<string, React.FC<{ className?: string }>> = {
  org_1: Users, org_2: DollarSign, org_3: Zap, org_4: Layers,
  org_5: Target, org_6: Bot, org_7: BookOpen, org_8: Award,
  org_9: Building2, org_10: Settings,
  data_1: Key, data_2: Brain, data_3: Database, data_4: Link2,
  data_5: Settings, data_6: Calculator,
  eng_1: Users, eng_2: Terminal, eng_3: Shield, eng_4: GitBranch,
  eng_5: Cpu, eng_6: Monitor, eng_7: Clock, eng_8: Eye, eng_10: BarChart2,
  sales_1: Users, sales_2: DollarSign, sales_3: Sparkles,
  sales_5: FileText, sales_6: Mic, sales_7: RefreshCw, sales_8: Send,
  cs_1: Users, cs_2: Repeat, cs_3: MessageSquare,
  cs_4: Clock, cs_5: Activity, cs_6: FileText,
  mkt_1: Users, mkt_2: Megaphone, mkt_3: Pencil, mkt_4: Sparkles,
  prod_1: Users, prod_2: Laptop, prod_3: Search,
  prod_4: ClipboardList, prod_5: FileText,
  ops_1: Users, ops_2: FileText, ops_3: GitBranch,
  ops_4: BarChart2, ops_5: MessageSquare, ops_6: Terminal,
};

const TIERS = [
  { max: 20, label: 'Starting', color: '#ef4444',
    msg: 'Your organization has massive untapped AI potential. The good news: the biggest gains come from the first moves. We organized initiatives in two blocks — change management and functional AI pilots — with a high-level roadmap below.' },
  { max: 40, label: 'Exploring', color: '#f97316',
    msg: "You've started experimenting, but most AI value is still on the table. The initiatives below show where quick wins can build momentum. We organized them into change management and functional AI pilots, with a phased roadmap to get there." },
  { max: 60, label: 'Developing', color: '#60a5fa',
    msg: 'Solid foundation in place. Strategic investments in the gaps below will unlock exponential returns. Your change management and functional AI pilots are mapped out, with a roadmap to take you from developing to advanced.' },
  { max: 80, label: 'Advanced', color: '#4ade80',
    msg: 'Strong AI adoption across the board. The initiatives below target the remaining gaps that separate advanced from elite. Focus on automation depth, agent orchestration, and the organizational shifts in the roadmap.' },
  { max: 101, label: 'Elite', color: '#34d399',
    msg: "Top 5% of organizations — you're operating AI-natively. The roadmap below focuses on compounding your advantage: orchestrator-of-orchestrators, org-wide knowledge graphs, and maintaining your edge as the landscape evolves." },
];

const FUNC_OPTIONS: [string, string | null][] = [
  ['Engineering', 'eng'],
  ['Sales', 'sales'],
  ['Operations (incl. finance, legal, people)', 'ops'],
  ['Product', 'product'],
  ['Marketing', 'marketing'],
  ['Customer Support', 'support'],
];

/* ═══════════════════════════════════════════
   TYPES (mirrored from QuizPage)
   ═══════════════════════════════════════════ */
type Opt = { text: string; score: number };
type Question = {
  id: string; text: string; desc?: string;
  type: 'single' | 'multi' | 'number' | 'text';
  options?: Opt[]; placeholder?: string; key?: string;
  rec?: string; tools?: string; scored?: boolean;
  imp?: number;
};
type Block = { id: string; name: string; desc: string; extra?: string; questions: Question[] };

/* ═══════════════════════════════════════════
   BLOCK DATA (mirrored from QuizPage)
   ═══════════════════════════════════════════ */
const DK: Opt = { text: "Don't know", score: -1 };

const ALL_BLOCKS: Block[] = [
  { id: 'org', name: 'Organization', desc: 'Your AI strategy, culture, and organizational readiness.',
    questions: [
      { id: 'org_1', text: 'How many people are in your organization?', type: 'number', placeholder: 'e.g. 150', key: 'orgSize' },
      { id: 'org_2', text: "What's your company's annual revenue range?", type: 'single', key: 'revIdx',
        options: [{ text: 'Pre-revenue / <$1M', score: -2 }, { text: '$1M–$5M', score: -2 }, { text: '$5M–$20M', score: -2 }, { text: '$20M–$50M', score: -2 }, { text: '$50M+', score: -2 }] },
      { id: 'org_3', text: 'What % of the organization are heavy AI-users?', type: 'single',
        desc: 'Who you\'d say are proficient in AI in their work.',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 3, rec: 'Launch an AI Champions program: pick 2–3 power users per department, give them Claude Pro or Cursor seats, and run weekly "show what I built" sessions. Champions should own a SKILLS.md doc per function. Most orgs go from <25% → 50%+ adoption in 8 weeks. See gstack (github.com/garrytan/gstack) for how Garry Tan structures engineering skills that 10x developers.' },
      { id: 'org_4', text: 'Does your company have a shared AI workspace or AI OS that connects to your business tools?', type: 'single',
        desc: 'This is a system where AI can access your docs, CRM, tasks, or code — not just a chatbot in a browser tab.',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Deploy an org-wide AI workspace — Obsidian + Claude Code for technical teams, Notion AI or Cowork for business. Store CLAUDE.md files, prompt libraries, and agent configs in a shared repo so every employee starts at 80% effectiveness instead of 0%. This is the #1 infrastructure gap. First step: create a shared vault documenting your top 20 workflows as AI-ready skills.' },
      { id: 'org_5', text: 'Do you measure AI\'s impact on your business with specific OKRs or KPIs?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Add one measurable AI OKR per function this quarter. Examples: "Reduce PR cycle time from 72h to <6h" (Eng), "AI resolves 50% of L1 tickets" (Support), "AI-drafted first pass on 100% of content" (Marketing). Without measurable targets, AI stays a hobby project. Review progress weekly — not quarterly.' },
      { id: 'org_6', text: 'Have you tried always-on agents like OpenClaw?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Deploy one always-on agent for your highest-volume repetitive task: PR review, ticket triage, or daily report generation. Tools: OpenClaw, Claude Code daemon, or Hermes. In one of our clients, a single always-on agent on support triage saved the equivalent of 10–12 FTE (40% of the CS staff). Start small, measure the impact, then expand to every function.' },
      { id: 'org_7', text: 'Does your company have internal instructions or AI playbook for specific tasks or each function?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Create a SKILLS.md per function documenting: which AI tools to use, which workflows are AI-assisted, and standard prompts. Takes 2–3 hours per function, saves hundreds of hours. Your playbook becomes institutional knowledge that compounds — every new hire starts at 80% instead of 0%.' },
      { id: 'org_8', text: 'Do people earn more if they use AI a lot and perform more work?', type: 'single',
        options: [{ text: 'Yes, AI is part of reviews and incentives', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Add AI proficiency as a performance review criterion. Measure output per person (PRs shipped, tickets resolved, content produced) — not hours worked. Teams that incentivize AI adoption see 3x faster adoption curves.' },
      { id: 'org_9', text: 'Do you already have an internal AI unit?', type: 'single', scored: true,
        options: [{ text: 'Yes — everyone is AI-native', score: 100 }, { text: 'Have CAIO / Head of AI', score: 80 }, { text: 'Driving it myself / with CTO', score: 50 }, { text: 'Have some dedicated AI engineers', score: 25 }, { text: "Don't have dedicated people", score: 0 }, DK],
        imp: 2, rec: 'Appoint a CAIO or Head of AI who owns the transformation roadmap, unblocks tool access, and runs the Champions network. This person should report to the CEO, not CTO — AI transformation is a business initiative, not just a tech one.' },
      { id: 'org_10', text: 'Which functions do you have in your organization?', type: 'multi', scored: false, key: 'functions',
        options: FUNC_OPTIONS.map(([label]) => ({ text: label, score: -2 })) },
    ] },
  { id: 'data', name: 'Data & Infrastructure', desc: 'The technical foundation that enables — or blocks — AI adoption.',
    questions: [
      { id: 'data_1', text: 'Do you have a corporate subscription to Claude Cowork/Code or ChatGPT/Codex?', type: 'single',
        options: [{ text: 'Enterprise Claude', score: 100 }, { text: 'Enterprise ChatGPT', score: 80 }, { text: 'Only some people have company-provided access', score: 35 }, { text: "Don't provide access to AI tools", score: 0 }, DK],
        imp: 3, rec: 'Provide enterprise Claude or ChatGPT to every employee — not just engineers. At $20–100/seat/month, even a non-technical employee saving 5 hrs/week generates 10–25x ROI. Enterprise plans include security controls and audit logs that personal accounts don\'t.' },
      { id: 'data_2', text: 'Can your employees ask AI a question and get an answer based on your company\'s actual data?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Build a company knowledge layer: start with markdown files covering org structure, product docs, processes, and key decisions. Even basic .md context files improve AI output quality by 50–70%.' },
      { id: 'data_3', text: 'Do you have a centralized data warehouse (DWH)?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Set up a data warehouse (BigQuery, Snowflake, or DuckDB for smaller orgs). Without centralized data, every AI initiative starts with weeks of manual data gathering.' },
      { id: 'data_4', text: 'Can AI tools connect directly to your internal systems automatically via API or CLI?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Expose your top 3 most-used internal tools via API or MCP (Model Context Protocol). Browser-only systems are invisible to AI agents.' },
      { id: 'data_5', text: 'How fragmented is your tool stack?', type: 'single',
        options: [{ text: '10+ tools per workflow', score: 0 }, { text: '5–10 tools', score: 45 }, { text: 'Under 5, mostly integrated', score: 90 }, DK],
        imp: 1, rec: 'Implement MCP connectors so AI agents access all tools through one interface. Start with connectors for your 3 most-used tools.' },
      { id: 'data_6', text: 'Do you know how much it costs your company to complete routine tasks?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 1, rec: 'Time your top 10 repetitive workflows before automating anything. Without baselines, you can\'t calculate ROI or prioritize.' },
    ] },
  { id: 'eng', name: 'Engineering', desc: 'How your technical team builds, tests, and ships software.',
    questions: [
      { id: 'eng_1', text: 'How big is your engineering team?', type: 'number', placeholder: 'e.g. 40', key: 'engSize' },
      { id: 'eng_2', text: 'Which % of the team is using AI coding tools?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 3, rec: 'Mandate Claude Code or Cursor for 100% of engineers. Add CLAUDE.md files in every repo with architecture context and coding standards. Teams going from <25% to full adoption see 2–3x throughput.' },
      { id: 'eng_3', text: 'What % of your QA work is currently automated?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Use Claude Code to auto-generate regression tests from every PR. Target: 75%+ automated test coverage within one quarter.' },
      { id: 'eng_4', text: 'Does your engineering team use advanced prompts or sub-agents for planning?', type: 'single',
        tools: 'github.com/garrytan/gstack',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Move beyond basic code completion. Set up CLAUDE.md files with project context, custom skills, and multi-agent workflows.' },
      { id: 'eng_5', text: 'What % of your eng team has always-on engineering agents?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Deploy always-on agents that work 24/7 on routine tasks: dependency updates, test fixes, documentation, linting.' },
      { id: 'eng_6', text: 'How many active parallel CLI sessions do your engineers have on average?', type: 'single',
        options: [{ text: '1–2', score: 10 }, { text: '2–5', score: 30 }, { text: '5–10', score: 55 }, { text: '>10 (manual)', score: 80 }, { text: '>10 (orchestrated)', score: 100 }, DK],
        imp: 3, rec: 'The single biggest productivity multiplier: parallelism. Train engineers to run 5–10+ simultaneous Claude Code sessions.' },
      { id: 'eng_7', text: "What's your average PR cycle time?", type: 'single',
        options: [{ text: '72h+', score: 0 }, { text: '24–72h', score: 35 }, { text: '6–24h', score: 70 }, { text: '<6h', score: 100 }, DK],
        imp: 3, rec: 'Make AI the first reviewer on every PR. Auto-merge PRs that pass AI review + CI. Target: <6h from open to merge.' },
      { id: 'eng_8', text: 'Which % of your PRs is reviewed by AI?', type: 'single',
        tools: 'Greptile, Claude Code, Macroscope',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Add AI code review as a mandatory CI check. AI catches what humans miss: security vulnerabilities, performance regressions, missing tests.' },
      { id: 'eng_10', text: 'How many LOCs are getting shipped by every engineer per day?', type: 'single',
        options: [{ text: '<1k', score: 10 }, { text: '1–5k', score: 35 }, { text: '5–10k', score: 70 }, { text: '>10k', score: 100 }, DK],
        imp: 1, rec: 'Engineers shipping <1K LOC/day are leaving 5–10x productivity on the table. The fix: Claude Code or Cursor for every engineer, CLAUDE.md in every repo, parallel agent workflows.' },
    ] },
  { id: 'sales', name: 'Sales', desc: 'How your commercial team acquires and retains customers.',
    questions: [
      { id: 'sales_1', text: 'How big is your sales team?', type: 'number', placeholder: 'e.g. 15', key: 'salesSize' },
      { id: 'sales_2', text: "What's your annual revenue per salesperson?", type: 'single',
        options: [{ text: '<$0.2M', score: 10 }, { text: '$0.2–1M', score: 35 }, { text: '$1–3M', score: 70 }, { text: '>$3M', score: 100 }, DK],
        imp: 2, rec: 'Low revenue per rep = too much time on non-selling work. Automate CRM entry, follow-up emails, proposal drafting, meeting notes.' },
      { id: 'sales_3', text: 'Which % of the team is using AI sales tools?', type: 'single',
        tools: 'Monaco.com, Amplemarket.com, Hockeystack.com',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 3, rec: 'Every rep needs AI for: pre-call research, email/proposal drafting, and post-call follow-up automation.' },
      { id: 'sales_5', text: 'Which CRM are you using?', type: 'text', placeholder: 'e.g. HubSpot, Attio, Salesforce' },
      { id: 'sales_6', text: 'What % of your sales calls is transcribed?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Transcribe 100% of sales calls. Transcripts enable: AI coaching, auto-generated follow-ups, CRM updates without typing, and win/loss pattern analysis.' },
      { id: 'sales_7', text: 'Is "Meeting → CRM → Next steps" sequence automated?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Automate the full post-meeting chain: transcribe → extract action items → update CRM → draft follow-up → schedule next steps. Saves 30–45 min per meeting.' },
      { id: 'sales_8', text: 'If your company does cold outreach: Is the pipeline automated?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Build an end-to-end AI outreach pipeline: build list → enrich → AI-personalize → sequence → analyze. AI-personalized outreach gets 2–3x reply rates.' },
    ] },
  { id: 'support', name: 'Customer Support', desc: 'How you handle customer inquiries and resolve issues.',
    questions: [
      { id: 'cs_1', text: 'How big is your customer support team?', type: 'number', placeholder: 'e.g. 20', key: 'csSize' },
      { id: 'cs_2', text: 'What percentage of support tickets are repetitive?', type: 'single',
        options: [{ text: '<25%', score: -2 }, { text: '25–50%', score: -2 }, { text: '50–75%', score: -2 }, { text: '>75%', score: -2 }, DK],
        imp: 2, rec: 'High repetitive ticket volume is the clearest AI ROI signal. Categorize top 20 ticket types, deploy AI for those.' },
      { id: 'cs_3', text: 'Which % of customer support queries is served by AI tools?', type: 'single',
        tools: 'Intercom, Fin.ai',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 3, rec: 'Roll out AI support in phases: AI drafts responses → AI auto-resolves simple tickets → AI handles 75%+ with human escalation.' },
      { id: 'cs_4', text: 'What is your average ticket resolution time?', type: 'single',
        options: [{ text: '6h+', score: 10 }, { text: '1–6h', score: 35 }, { text: '10–60 min', score: 70 }, { text: '<10 min', score: 100 }, DK],
        imp: 2, rec: 'Fix knowledge gaps and routing. Deploy internal knowledge agent + AI ticket classification. Target: 50% reduction in resolution time.' },
      { id: 'cs_5', text: "What's the average # of tickets per CS employee per day?", type: 'single',
        options: [{ text: '<10', score: 10 }, { text: '10–20', score: 35 }, { text: '20–30', score: 70 }, { text: '>30', score: 100 }, DK],
        imp: 1, rec: 'Deploy agent-assist widget that pulls customer context from all systems into one pane and auto-drafts responses.' },
      { id: 'cs_6', text: 'Which % of support tickets/conversations is transcribed?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Record and transcribe 100% of support interactions. Enables QA at 100% coverage, training data for AI, and coaching insights.' },
    ] },
  { id: 'marketing', name: 'Marketing', desc: 'How your marketing team creates and distributes content.',
    questions: [
      { id: 'mkt_1', text: 'How big is your marketing team?', type: 'number', placeholder: 'e.g. 8', key: 'mktSize' },
      { id: 'mkt_2', text: 'What % of your marketing is AI-assisted?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 3, rec: 'Use AI for the first draft of everything: blogs, social, email, SEO, ad copy. 3–5x faster than manual.' },
      { id: 'mkt_3', text: 'Is your content creation process automated from research to publishing?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Build a fully automated content pipeline: AI research → briefs → drafts → human review → auto-publish. Each step 70–80% automated.' },
      { id: 'mkt_4', text: 'Do you have specialized marketers?', type: 'single',
        options: [{ text: 'Yes, all of them', score: 100 }, { text: 'Some combine multiple functions', score: 50 }, { text: 'No, we have generalist marketers only', score: 15 }, DK],
        imp: 1, rec: 'AI lets generalist marketers produce specialist-quality output. A single marketer with the right AI stack can run SEO, email, social, and performance marketing.' },
    ] },
  { id: 'product', name: 'Product', desc: 'How your product team researches, specs, and ships.',
    questions: [
      { id: 'prod_1', text: 'How big is your product team?', type: 'number', placeholder: 'e.g. 6', key: 'prodSize' },
      { id: 'prod_2', text: 'Do your product managers and designers ship code?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 3, rec: 'Train PMs and designers to ship code with AI (Cursor, Claude Code, Lovable, or v0). Collapses spec → design → implement from weeks to hours.' },
      { id: 'prod_3', text: 'What % of product research is AI-assisted?', type: 'single',
        tools: 'Dovetail, Granola for calls, Claude Code for research and analysis',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Use AI across all product research: interview synthesis, competitive analysis, metric deep-dives. 5–10x faster and catches correlations humans miss.' },
      { id: 'prod_4', text: 'Do you use AI to turn customer requests into product tickets automatically?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Automate backlog creation: Slack message → AI extracts request → creates Linear/Jira ticket with context and priority.' },
      { id: 'prod_5', text: 'Are product specs/PRDs drafted or co-written with AI?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Co-write every PRD with AI. Feed Claude the research, metrics, constraints, and technical context — structured plan in minutes.' },
    ] },
  { id: 'ops', name: 'Operations', desc: 'How your operations, finance, legal, and people teams run day-to-day work.',
    questions: [
      { id: 'ops_1', text: 'How big is your operations team?', type: 'number', placeholder: 'e.g. 20', key: 'opsSize' },
      { id: 'ops_2', text: 'What % of your operational documents are processed with AI?', type: 'single',
        options: [{ text: '<25%', score: 10 }, { text: '25–50%', score: 35 }, { text: '50–75%', score: 70 }, { text: '>75%', score: 100 }, DK],
        imp: 2, rec: 'Use AI to process invoices, contracts, reports, and compliance documents. Reduces manual processing time by 60–80%.' },
      { id: 'ops_3', text: 'Are your approval and decision-making workflows automated?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Automate approval workflows: AI pre-reviews, routes to the right approver, and flags exceptions. Reduces cycle time by 50%+.' },
      { id: 'ops_4', text: 'Do you use AI for financial reporting and forecasting?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 2, rec: 'Use AI for financial analysis: auto-generate reports, detect anomalies, and build forecasting models. Frees finance team for strategic work.' },
      { id: 'ops_5', text: 'Is internal communication (meeting notes, updates, announcements) AI-assisted?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 1, rec: 'Auto-generate meeting summaries, status updates, and announcements. Saves 30–60 min/day across the org.' },
      { id: 'ops_6', text: 'Do you have AI-assisted onboarding or training?', type: 'single',
        options: [{ text: 'Yes', score: 100 }, { text: 'Partially', score: 50 }, { text: 'No', score: 0 }, DK],
        imp: 1, rec: 'Build AI onboarding: new hires get a Claude workspace pre-loaded with company context, training materials, and their first-week tasks. Cuts onboarding time from weeks to days.' },
    ] },
];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function fmtMoney(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n;
}

function isScored(q: Question): boolean {
  if (q.type === 'number' || q.type === 'text') return false;
  if (q.type === 'multi') return q.scored === true;
  if (q.type === 'single' && q.options?.every(o => o.score === -2)) return false;
  return true;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const ReportPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [expandedRecs, setExpandedRecs] = useState<Record<string, boolean>>({});
  const [linkCopied, setLinkCopied] = useState(false);

  // Data from Supabase
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, number[]>>({});
  const [headcounts, setHeadcounts] = useState<Record<string, number>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [blockScores, setBlockScores] = useState<Record<string, number>>({});
  const [savingsLow, setSavingsLow] = useState(0);
  const [savingsHigh, setSavingsHigh] = useState(0);
  const [savingsItems, setSavingsItems] = useState<{ blockId: string; name: string; hc: number; low: number; high: number }[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  // Extract ID from URL
  const reportId = useMemo(() => {
    const match = window.location.pathname.match(/^\/report\/(.+?)\/?$/);
    return match ? match[1] : null;
  }, []);

  // Fetch data
  useEffect(() => {
    if (!reportId) {
      setError('Report not found');
      setLoading(false);
      return;
    }

    (async () => {
      const { data, error: fetchError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError || !data) {
        setError('Report not found');
        setLoading(false);
        return;
      }

      setAnswers(data.answers || {});
      setMultiAnswers(data.multi_answers || {});
      setHeadcounts(data.headcounts || {});
      setOverallScore(data.overall_score || 0);
      setBlockScores(data.block_scores || {});
      setSavingsLow(data.savings_low || 0);
      setSavingsHigh(data.savings_high || 0);
      setSavingsItems(data.savings_by_block || []);
      setSelectedBlocks(data.selected_blocks || []);
      setLoading(false);
    })();
  }, [reportId]);

  // Visible blocks
  const visibleBlocks = useMemo(() => {
    if (selectedBlocks.length === 0) return ALL_BLOCKS;
    return ALL_BLOCKS.filter(b => selectedBlocks.includes(b.id));
  }, [selectedBlocks]);

  // Score animation
  useEffect(() => {
    if (loading || error) return;
    const start = performance.now();
    const target = overallScore;
    function step(now: number) {
      const t = Math.min((now - start) / 1800, 1);
      setAnimatedScore(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [loading, error, overallScore]);

  // Inject CSS
  useEffect(() => {
    const id = 'quiz-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
      @keyframes qFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes qFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      @keyframes qSpin { to { transform:rotate(360deg); } }
      @keyframes qPulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      @keyframes qShimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      .q-fade { animation: qFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
      .q-glass { background:rgba(255,255,255,0.015); backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px); border:1px solid rgba(255,255,255,0.06); }
      .q-glass:hover { background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.09); }
      .q-shimmer { background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent); background-size:200% 100%; animation:qShimmer 2s ease infinite; }
    `;
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  // Get recommendations
  const getBlockRecs = useCallback((block: Block) => {
    const recs: { q: Question; answerText: string; score: number; isVisGap: boolean }[] = [];
    for (const q of block.questions) {
      if (!q.rec) continue;
      if (q.type === 'single') {
        const ai = answers[q.id];
        if (ai === undefined) continue;
        const opt = q.options![ai];
        if (opt.score === -1) {
          recs.push({ q, answerText: opt.text, score: -1, isVisGap: true });
        } else if (opt.score < 60) {
          recs.push({ q, answerText: opt.text, score: opt.score, isVisGap: false });
        }
      }
      if (q.type === 'multi' && q.scored) {
        const sel = multiAnswers[q.id] || [];
        if (!sel.length) continue;
        const mx = Math.max(...sel.map(i => q.options![i]?.score ?? 0));
        const txt = sel.map(i => q.options![i]?.text).join(', ');
        if (mx === -1) {
          recs.push({ q, answerText: txt, score: -1, isVisGap: true });
        } else if (mx < 60) {
          recs.push({ q, answerText: txt, score: mx, isVisGap: false });
        }
      }
    }
    return recs;
  }, [answers, multiAnswers]);

  // Radar chart
  const renderRadar = () => {
    const scored = visibleBlocks.filter(b => (blockScores[b.id] ?? -1) >= 0);
    if (scored.length < 3) return null;
    const size = 400, cx = size / 2, cy = size / 2, r = 110, n = scored.length;
    const vertex = (i: number, pct: number) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [cx + r * (pct / 100) * Math.cos(angle), cy + r * (pct / 100) * Math.sin(angle)];
    };
    const rings = [25, 50, 75, 100].map(p => {
      const pts = Array.from({ length: n }, (_, i) => vertex(i, p).join(',')).join(' ');
      return <polygon key={p} points={pts} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
    });
    const axes = Array.from({ length: n }, (_, i) => {
      const [x, y] = vertex(i, 100);
      return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
    });
    const vals = scored.map(b => blockScores[b.id] || 0);
    const scorePts = vals.map((v, i) => vertex(i, Math.max(v, 3)).join(',')).join(' ');
    const labels = scored.map((b, i) => {
      const [x, y] = vertex(i, 155);
      const s = blockScores[b.id] || 0;
      const anchor = x < cx - 10 ? 'end' : x > cx + 10 ? 'start' : 'middle';
      const col = BLOCK_COLORS[b.id] || '#888';
      return (
        <g key={b.id}>
          <text x={x} y={y} textAnchor={anchor} fontSize="11" fontWeight="600" fill={col} fontFamily="'Space Grotesk',sans-serif" letterSpacing="0.02em">{b.name}</text>
          <text x={x} y={y + 15} textAnchor={anchor} fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="'JetBrains Mono',monospace">{s}</text>
        </g>
      );
    });
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {rings}{axes}
        <polygon points={scorePts} fill="url(#radarFill)" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />
        {vals.map((v, i) => {
          const [x, y] = vertex(i, Math.max(v, 3));
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#f97316" stroke="#000" strokeWidth="1.5" />;
        })}
        {labels}
      </svg>
    );
  };

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center q-fade">
          <div className="w-10 h-10 border-2 border-orange-500/30 border-t-orange-500 rounded-full mx-auto mb-4" style={{ animation: 'qSpin 1s linear infinite' }} />
          <p className="text-sm text-gray-500" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading report...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center q-fade max-w-md">
          <p className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Report not found</p>
          <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            This report may have been removed or the link is invalid.
          </p>
          <a href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            Take the Diagnostic
          </a>
        </div>
      </div>
    );
  }

  // ── Results ──
  const tier = TIERS.find(t => overallScore <= t.max) || TIERS[TIERS.length - 1];
  const scoreCirc = 2 * Math.PI * 72;
  const scoreOffset = scoreCirc - (animatedScore / 100) * scoreCirc;

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0f' }}>

      {/* ─── Score Hero ─── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${tier.color}12, transparent 70%)` }} />

        <div className="relative z-10 text-center pt-20 pb-16 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-10" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            AI Readiness Score
          </p>

          {/* Score ring */}
          <div className="relative w-[200px] h-[200px] mx-auto mb-8">
            <svg viewBox="0 0 160 160" className="w-full h-full" style={{ filter: `drop-shadow(0 0 30px ${tier.color}20)` }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={tier.color} />
                  <stop offset="100%" stopColor={tier.color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle cx="80" cy="80" r="72" fill="none" stroke="url(#scoreGrad)" strokeWidth="5"
                strokeLinecap="round" strokeDasharray={scoreCirc} strokeDashoffset={scoreOffset}
                transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold font-mono tracking-tighter" style={{ color: tier.color, fontFamily: "'JetBrains Mono',monospace" }}>
                {animatedScore}
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase mt-1" style={{ color: tier.color, opacity: 0.8 }}>
                {tier.label}
              </span>
            </div>
          </div>

          <p className="text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            {tier.msg}
          </p>

          {savingsHigh > 0 && (
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl q-glass">
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Annual AI opportunity</span>
              <span className="text-lg font-bold font-mono tracking-tight" style={{ color: '#fb923c', fontFamily: "'JetBrains Mono',monospace" }}>
                {fmtMoney(savingsLow)} – {fmtMoney(savingsHigh)}
              </span>
            </div>
          )}

          <p className="text-[11px] text-gray-600 mt-3 max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Based on headcount × savings-per-role × (100% − your score) × org size factor, capped by revenue. Range reflects 0.6×–1.3× estimate.
          </p>
        </div>

        <div className="h-px mx-auto max-w-5xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ─── Change Management Framework ─── */}
        <div className="mb-16 q-fade" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-2xl font-bold tracking-[-0.03em] mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Change Management Framework
          </h3>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Key Organization Initiatives to Drive Change
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUADRANT_MAP.map((quad, qi) => {
              const isTop = qi < 2;
              const accentCol = isTop ? BLOCK_COLORS.org : BLOCK_COLORS.data;
              return (
                <div key={quad.key} className="relative overflow-hidden rounded-2xl q-glass" style={{ padding: '20px' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accentCol}50, transparent)` }} />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[15px]">{quad.icon}</span>
                    <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: '#f97316', fontFamily: "'Space Grotesk',sans-serif" }}>{quad.label}</span>
                  </div>
                  {quad.qIds.filter(qId => {
                    const block = ALL_BLOCKS.find(bl => bl.questions.some(qq => qq.id === qId));
                    const q = block?.questions.find(qq => qq.id === qId);
                    if (!q || !q.rec) return false;
                    if (q.type === 'single') {
                      const ai = answers[q.id];
                      if (ai !== undefined) { const s = q.options![ai]?.score ?? 0; if (s >= 70 || s === -1) return false; }
                    }
                    if (q.type === 'multi' && q.scored) {
                      const sel = multiAnswers[q.id] || [];
                      if (sel.length) { const mx = Math.max(...sel.map(i => q.options![i]?.score ?? 0)); if (mx >= 70 || mx === -1) return false; }
                    }
                    return true;
                  }).slice(0, 3).map(qId => {
                    const block = ALL_BLOCKS.find(bl => bl.questions.some(qq => qq.id === qId));
                    const q = block?.questions.find(qq => qq.id === qId);
                    if (!q || !q.rec) return null;
                    const domainId = qId.startsWith('org') ? 'org' : 'data';
                    const col = BLOCK_COLORS[domainId];
                    const isExpanded = expandedRecs[qId] || false;
                    return (
                      <div key={qId} className="rounded-xl p-3 mb-2 cursor-pointer transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                        onClick={() => setExpandedRecs(prev => ({ ...prev, [qId]: !prev[qId] }))}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{ color: col, background: `${col}15`, fontFamily: "'JetBrains Mono',monospace" }}>{qId.toUpperCase()}</span>
                        </div>
                        <p className="text-[13px] leading-[1.55] font-medium" style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          color: 'rgba(255,255,255,0.72)',
                          ...(isExpanded ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
                        }}>{q.rec}</p>
                        {!isExpanded && (
                          <p className="text-[12px] mt-1" style={{ color: `${col}70`, fontFamily: "'Space Grotesk',sans-serif" }}>show more ▾</p>
                        )}
                        {q.tools && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.tools.split(', ').map(t => (
                              <span key={t} className="text-[12px] font-mono px-1.5 py-0.5 rounded"
                                style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Functional AI Opportunities ─── */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold tracking-[-0.03em] mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Functional AI Opportunities
          </h3>
          <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Top initiatives per business function
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleBlocks.filter(b => !['org', 'data'].includes(b.id)).map((b, bi) => {
              const s = blockScores[b.id] ?? -1;
              const saving = savingsItems.find(it => it.blockId === b.id);
              const recs = getBlockRecs(b);
              const allGaps = recs.filter(r => !r.isVisGap);
              const sorted = [...allGaps].sort((a, c) => {
                const impA = a.q.imp || 1, impC = c.q.imp || 1;
                if (impC !== impA) return impC - impA;
                return a.score - c.score;
              });
              const top3 = sorted.slice(0, 3);
              const remaining = sorted.length - top3.length;
              const visGaps = recs.filter(r => r.isVisGap);
              const col = BLOCK_COLORS[b.id] || '#f97316';
              const barCol = s >= 70 ? '#4ade80' : s >= 40 ? '#fbbf24' : col;

              return (
                <div key={b.id} className="relative rounded-2xl overflow-hidden q-fade"
                  style={{ animationDelay: `${0.1 + bi * 0.08}s`, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>

                  <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${col}60, ${col}20, transparent)` }} />

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: col }} />
                      <h4 className="text-[15px] font-bold tracking-[-0.01em]" style={{ color: col, fontFamily: "'Space Grotesk',sans-serif" }}>{b.name}</h4>
                    </div>

                    {s >= 0 && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="h-full rounded-full transition-all duration-[1.5s] ease-out"
                            style={{ width: `${Math.max(s, 2)}%`, background: `linear-gradient(90deg, ${barCol}, ${barCol}80)` }} />
                        </div>
                        <span className="text-xs font-bold font-mono" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono',monospace", minWidth: '24px', textAlign: 'right' }}>{s}</span>
                      </div>
                    )}

                    {saving && (
                      <div className="mb-5">
                        <p className="text-[22px] font-bold font-mono tracking-tight leading-none" style={{ color: col, fontFamily: "'JetBrains Mono',monospace" }}>
                          {fmtMoney(saving.low)}–{fmtMoney(saving.high)}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-600 font-semibold mt-1.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Annual AI potential</p>
                      </div>
                    )}

                    {top3.length > 0 && (
                      <div>
                        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-600 font-semibold mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Top initiatives</p>
                        <div className="space-y-2.5">
                          {top3.map(({ q, score }, idx) => {
                            const impLabel = q.imp === 3 ? 'High' : q.imp === 2 ? 'Med' : 'Low';
                            const impColor = q.imp === 3 ? ['rgba(249,115,22,0.12)', '#f97316'] : q.imp === 2 ? ['rgba(251,191,36,0.1)', '#fbbf24'] : ['rgba(255,255,255,0.04)', '#666'];
                            const isExpanded = expandedRecs[q.id] || false;
                            return (
                              <div key={q.id} className="rounded-xl p-3.5 cursor-pointer transition-all duration-200"
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
                        {remaining > 0 && (
                          <p className="text-xs mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            <span className="text-gray-600">+{remaining} more</span>
                            <span className="text-gray-700 mx-1.5">{'·'}</span>
                            <a href={CTA_URL} target="_blank" rel="noreferrer" className="text-orange-400/70 hover:text-orange-400 transition-colors duration-300">
                              Discuss in diagnostic call
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                    {top3.length === 0 && s >= 0 && (
                      <p className="text-sm text-gray-600" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>No critical gaps detected.</p>
                    )}

                    {visGaps.length > 0 && (
                      <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Visibility gaps</p>
                        {visGaps.map(({ q }) => (
                          <p key={q.id} className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{'·'} {q.text}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── AI Transformation Roadmap ─── */}
        <div className="mb-16 q-fade" style={{ animationDelay: '0.35s' }}>
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: '#555', fontFamily: "'Space Grotesk',sans-serif" }}>AI Transformation Roadmap</p>
            <h3 className="text-3xl font-bold tracking-[-0.03em] mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              From Diagnostic to{' '}
              <span style={{ background: 'linear-gradient(135deg,#fb923c,#f97316,#ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Native Organization</span>
            </h3>
            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: '#666', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              A structured 9-month journey: diagnose, launch, scale, optimize. Every phase builds on the last.
            </p>
          </div>

          {/* Phase timeline bar */}
          <div className="flex gap-[3px] mb-6 rounded-lg overflow-hidden" style={{ height: '6px' }}>
            {[{ w: 14, c: '#f97316' }, { w: 46, c: '#fb923c' }, { w: 25, c: '#fbbf24' }, { w: 15, c: '#34d399' }].map((p, i) => (
              <div key={i} style={{ flex: p.w, background: p.c, opacity: 0.6 }} />
            ))}
          </div>

          {/* Phase rows */}
          {(() => {
            const hasBlock = (id: string) => visibleBlocks.some(b => b.id === id);
            const funcImpacts: Record<string, string> = {
              eng: 'Engineering 5–10x throughput',
              support: 'Support auto-resolution >50%',
              marketing: 'Content velocity 3–5x',
              sales: 'Sales capacity 2–3x',
              product: 'Product cycle time 2x faster',
              ops: 'Ops manual work reduced 60%+',
            };
            const selectedFuncImpacts = Object.entries(funcImpacts)
              .filter(([id]) => hasBlock(id))
              .map(([, v]) => v);

            const phase2Funcs = visibleBlocks
              .filter(b => !['org', 'data'].includes(b.id))
              .map(b => b.name);

            const phases = [
              {
                label: 'Phase 1', duration: 'Days 1–14', title: 'Full AI Diagnostics', color: '#f97316',
                tagline: 'Map every opportunity before making a single change',
                milestones: [
                  'Leadership interviews (CEO, C-level and key heads)',
                  'Process mapping across all functions — shadow real workflows',
                  'Current state scoring — AI readiness per domain',
                  'Opportunity sizing — $ estimates per initiative with headcount-adjusted ROI',
                  'Build full transformation plan with 100+ initiatives and Chief AI Officer Agent',
                ],
                deliverables: ['AI Readiness Dashboard', 'Initiative Map (100+ opportunities)', 'ROI Model', 'Detailed Roadmap'],
                impact: `Baseline established across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. Leadership aligned on opportunity size and priority stack.`,
              },
              {
                label: 'Phase 2', duration: 'Days 15–60', title: 'Launch & Quick Wins', color: '#fb923c',
                tagline: 'Launch the AI Office, ship the first wins, build momentum',
                milestones: [
                  'Establish AI Office — appoint CAIO or transformation lead',
                  'Launch Change Management Initiatives (4 Quadrants)',
                  { text: 'Deploy enterprise AI access for 100% of employees', dyn: true },
                  { text: 'Kick-off pilot: AI-first workflows — target <6h cycle time', dyn: true },
                  { text: 'Create AI playbook per function (SKILLS.md)', dyn: true },
                  'First pilot results — measure against diagnostic baselines',
                ],
                deliverables: ['AI Office charter', 'Change Management framework', 'Enterprise AI tools', '3–5 pilots launched'],
                impact: `AI Champions network active across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. First measurable wins (30–50% time savings). Organization-wide AI access.`,
              },
              {
                label: 'Phase 3', duration: 'Q3 2026', title: 'Scale & Automate', color: '#fbbf24',
                tagline: 'Expand what works, automate what repeats, measure everything',
                milestones: [
                  'Expand successful pilots to full departments',
                  { text: 'Deploy always-on agents for support triage — 75% auto-resolution', dyn: true, block: 'support' },
                  { text: 'Automate content pipeline end-to-end: research to publish', dyn: true, block: 'marketing' },
                  { text: 'AI-assisted sales: autonomous follow-ups, proposal generation', dyn: true, block: 'sales' },
                  { text: 'Build company-wide knowledge layer — every doc queryable by AI', dyn: true },
                  'Mid-point ROI review vs. diagnostic baselines',
                ],
                deliverables: ['Always-on agents deployed', 'Automated pipelines', 'Knowledge layer', 'ROI report'],
                impact: `50–70% of identified opportunities captured. ${selectedFuncImpacts.length > 0 ? selectedFuncImpacts.join('. ') + '.' : 'Major efficiency gains across selected functions.'}`,
              },
              {
                label: 'Phase 4', duration: 'Q4 2026', title: 'AI-Native Organization', color: '#34d399',
                tagline: 'Not using AI — being AI. Every function, every workflow, every decision.',
                milestones: [
                  { text: 'Orchestrate Orchestrators — meta-agents managing agent fleets, self-healing pipelines', dyn: true },
                  { text: 'Long-Term Org Memory — compounding knowledge graph for every future AI action', dyn: true },
                  { text: 'Agent-to-Employee ratio >2:1 — each person has 2+ dedicated AI agents', dyn: true },
                  { text: 'AI-native hiring & onboarding — agent setup on Day 1, AI fluency required', dyn: true },
                  'End-of-year executive review: full ROI vs. diagnostic baseline, 2027 roadmap',
                ],
                deliverables: ['Orchestrator-of-orchestrators', 'Org Memory knowledge graph', 'Agent ratio >2:1', '2027 AI roadmap'],
                impact: `AI is the organization across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. 80%+ opportunity captured. 3–5x output without headcount growth.`,
              },
            ];
            return (
              <div className="flex flex-col gap-4">
                {phases.map((phase, pi) => (
                  <div key={pi} className="flex flex-col md:flex-row overflow-hidden q-glass rounded-2xl">
                    <div className="relative md:border-r md:w-[340px] md:min-w-[340px]" style={{ padding: 24, borderColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="absolute top-0 left-0 bottom-0" style={{ width: 3, background: phase.color }} />
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: phase.color, fontFamily: "'JetBrains Mono',monospace" }}>{phase.label}</p>
                      <p className="text-lg font-bold tracking-[-0.02em] text-white mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{phase.title}</p>
                      <p className="font-mono text-xs mb-2.5" style={{ color: phase.color, opacity: 0.7, fontFamily: "'JetBrains Mono',monospace" }}>{phase.duration}</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: '#555', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{phase.tagline}</p>

                      <div className="mt-4 p-3.5 rounded-xl relative overflow-hidden" style={{ borderLeft: `3px solid ${phase.color}`, background: `linear-gradient(135deg, ${phase.color}08, ${phase.color}03)` }}>
                        <div className="absolute -top-2.5 -right-2.5 w-[60px] h-[60px] pointer-events-none" style={{ background: `radial-gradient(circle, ${phase.color}12, transparent 70%)` }} />
                        <p className="text-[10px] uppercase tracking-[0.12em] font-bold mb-1.5 flex items-center gap-1.5" style={{ color: phase.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                          <Zap className="w-3 h-3" /> Expected Impact
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{phase.impact}</p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 p-6">
                      <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-2.5" style={{ color: '#555', fontFamily: "'Space Grotesk',sans-serif" }}>Key Milestones</p>
                      <div className="flex flex-col gap-1.5 mb-4">
                        {phase.milestones.filter(m => {
                          if (typeof m === 'string') return true;
                          if (m.block) return visibleBlocks.some(b => b.id === m.block);
                          return true;
                        }).map((m, mi) => {
                          const mText = typeof m === 'string' ? m : m.text;
                          const isDyn = typeof m !== 'string' && m.dyn;
                          return (
                            <div key={mi} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-[7px] font-mono text-[11px] font-bold shrink-0"
                                style={{ color: phase.color, background: `${phase.color}15`, fontFamily: "'JetBrains Mono',monospace" }}>{mi + 1}</span>
                              <div className="flex-1">
                                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{mText}</p>
                                {isDyn && (
                                  <span className="inline-block mt-1 font-mono text-[9px] font-semibold tracking-[0.04em]"
                                    style={{ color: phase.color, opacity: 0.5, fontFamily: "'JetBrains Mono',monospace" }}>from your diagnostic</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-2" style={{ color: '#555', fontFamily: "'Space Grotesk',sans-serif" }}>Deliverables</p>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.deliverables.map((d, di) => (
                          <span key={di} className="text-xs px-3 py-1.5 rounded-lg" style={{
                            color: phase.color, background: `${phase.color}10`, border: `1px solid ${phase.color}25`,
                            fontFamily: "'Plus Jakarta Sans',sans-serif",
                          }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* ─── CTA ─── */}
        <div className="text-center rounded-3xl p-14 mb-12 q-glass q-fade relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.06), transparent 70%)' }} />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-[-0.03em] mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
              See the Full Picture
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed mb-8" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              A full Codos AI Transformation maps 100+ initiatives across every function — with interviews, validated dollar estimates, and a prioritized roadmap. Typically uncovers 3-5x more opportunity.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={CTA_URL} target="_blank" rel="noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-300 relative"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <Phone className="w-4 h-4" />
                Book Your Diagnostic Call
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 40px rgba(249,115,22,0.35)' }} />
              </a>
              <button onClick={handleCopyLink}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 q-glass"
                style={linkCopied ? { color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' } : { color: '#9ca3af' }}>
                {linkCopied ? <><Check className="w-4 h-4" /> Link Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 pb-12" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Built with the{' '}
          <a href={PLAYBOOK_URL} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">AI-Native Playbook</a>
          {' \u00b7 '}
          <a href="https://codos.ai" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">Codos</a>
        </p>
      </div>
    </div>
  );
};

export default ReportPage;
