import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, Download, Phone, ExternalLink, Check, Mail, Copy,
  Users, DollarSign, Zap, Target, Bot, BookOpen, Award, Building2, Layers,
  Key, Brain, Database, Link2, Settings, Calculator,
  Code, Terminal, Shield, GitBranch, Cpu, Monitor, Clock, Eye, BarChart2,
  Sparkles, FileText, Mic, RefreshCw, Send,
  Repeat, MessageSquare, Activity,
  Megaphone, Pencil, Search, Laptop, ClipboardList,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import founderPhoto from '../dima profile pic.jpeg';
import glebPhoto from '../gleb2.png';

/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const CTA_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3i1Ln5x0OopEqxxTQzfw6fWVy-M_-eAIfG0K-4pCOsATXssPqCNjJFuYl9uvKrp9ykG8kDEf61';
const PLAYBOOK_URL = 'http://136.243.91.17:8080/guides/';

const SIZE_MULTS: [number,number][] = [[10,0.50],[50,0.60],[200,0.65],[500,0.80],[1000,0.90]];
const REV_CAPS = [75000, 450000, 1875000, 5250000, 15000000];
const BLOCK_SAVINGS: Record<string,number> = {eng:75000, sales:40000, support:35000, marketing:45000, product:40000, ops:20000};
const BLOCK_HC: Record<string,string> = {eng:'engSize', sales:'salesSize', support:'csSize', marketing:'mktSize', product:'prodSize', ops:'opsSize'};
const BLOCK_COLORS: Record<string,string> = {
  org:'#818cf8', data:'#22d3ee', eng:'#60a5fa', sales:'#fb923c',
  support:'#4ade80', marketing:'#c084fc', product:'#f87171', ops:'#a78bfa',
};

/* Quadrant mapping — McKinsey Influence Model */
const QUADRANT_MAP: {key:string; label:string; icon:string; qIds:string[]}[] = [
  {key:'q1', label:'Role Models', icon:'\u{1F464}', qIds:['org_9','org_6','org_3']},
  {key:'q2', label:'Skills Development', icon:'\u{1F6E0}', qIds:['org_7','data_2','data_1']},
  {key:'q3', label:'Understanding & Conviction', icon:'\u{1F4A1}', qIds:['org_5','data_6','data_5']},
  {key:'q4', label:'Formal Mechanisms', icon:'\u{2699}', qIds:['org_8','org_4','data_4','data_3']},
];

/* Question icons */
const Q_ICONS: Record<string, React.FC<{className?: string; style?: React.CSSProperties}>> = {
  org_1:Users, org_2:DollarSign, org_3:Zap, org_4:Layers,
  org_5:Target, org_6:Bot, org_7:BookOpen, org_8:Award,
  org_9:Building2, org_10:Settings,
  data_1:Key, data_2:Brain, data_3:Database, data_4:Link2,
  data_5:Settings, data_6:Calculator,
  eng_1:Users, eng_2:Terminal, eng_3:Shield, eng_4:GitBranch,
  eng_5:Cpu, eng_6:Monitor, eng_7:Clock, eng_8:Eye, eng_10:BarChart2,
  sales_1:Users, sales_2:DollarSign, sales_3:Sparkles,
  sales_5:FileText, sales_6:Mic, sales_7:RefreshCw, sales_8:Send,
  cs_1:Users, cs_2:Repeat, cs_3:MessageSquare,
  cs_4:Clock, cs_5:Activity, cs_6:FileText,
  mkt_1:Users, mkt_2:Megaphone, mkt_3:Pencil, mkt_4:Sparkles,
  prod_1:Users, prod_2:Laptop, prod_3:Search,
  prod_4:ClipboardList, prod_5:FileText,
  ops_1:Users, ops_2:FileText, ops_3:GitBranch,
  ops_4:BarChart2, ops_5:MessageSquare, ops_6:Terminal,
};

const TIERS = [
  {max:20, label:'Starting', color:'#ef4444',
   msg:'Your organization has massive untapped AI potential. The good news: the biggest gains come from the first moves. We organized initiatives in two blocks — change management and functional AI pilots — with a high-level roadmap below.'},
  {max:40, label:'Exploring', color:'#f97316',
   msg:"You've started experimenting, but most AI value is still on the table. The initiatives below show where quick wins can build momentum. We organized them into change management and functional AI pilots, with a phased roadmap to get there."},
  {max:60, label:'Developing', color:'#60a5fa',
   msg:'Solid foundation in place. Strategic investments in the gaps below will unlock exponential returns. Your change management and functional AI pilots are mapped out, with a roadmap to take you from developing to advanced.'},
  {max:80, label:'Advanced', color:'#4ade80',
   msg:'Strong AI adoption across the board. The initiatives below target the remaining gaps that separate advanced from elite. Focus on automation depth, agent orchestration, and the organizational shifts in the roadmap.'},
  {max:101, label:'Elite', color:'#34d399',
   msg:"Top 5% of organizations — you're operating AI-natively. The roadmap below focuses on compounding your advantage: orchestrator-of-orchestrators, org-wide knowledge graphs, and maintaining your edge as the landscape evolves."},
];

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Opt = {text:string; score:number}; // -1=don't know (excluded), -2=context (not scored)
type Question = {
  id:string; text:string; desc?:string;
  type:'single'|'multi'|'number'|'text';
  options?:Opt[]; placeholder?:string; key?:string;
  rec?:string; tools?:string; scored?:boolean;
  imp?:number; // importance 1-3 (3=highest). Used to rank recommendations.
};
type Block = {id:string; name:string; desc:string; extra?:string; questions:Question[]};

/* ═══════════════════════════════════════════
   FUNCTION → BLOCK MAPPING (for Q10)
   ═══════════════════════════════════════════ */
const FUNC_OPTIONS: [string, string|null][] = [
  ['Engineering', 'eng'],
  ['Sales', 'sales'],
  ['Operations (incl. finance, legal, people)', 'ops'],
  ['Product', 'product'],
  ['Marketing', 'marketing'],
  ['Customer Support', 'support'],
];

/* ═══════════════════════════════════════════
   BLOCK DATA
   ═══════════════════════════════════════════ */
const DK: Opt = {text:"Don't know", score:-1};

const ALL_BLOCKS: Block[] = [
  /* ── Organization ── */
  {id:'org', name:'Organization', desc:'Your AI strategy, culture, and organizational readiness.',
   extra:'During a full audit, you upload your OKRs and org chart to receive detailed, role-level recommendations.',
   questions:[
    {id:'org_1', text:'How many people are in your organization?', type:'number', placeholder:'e.g. 150', key:'orgSize'},
    {id:'org_2', text:"What's your company's annual revenue range?", type:'single', key:'revIdx',
      options:[{text:'Pre-revenue / <$1M',score:-2},{text:'$1M–$5M',score:-2},{text:'$5M–$20M',score:-2},{text:'$20M–$50M',score:-2},{text:'$50M+',score:-2}]},
    {id:'org_3', text:'What % of the organization are heavy AI-users?', type:'single',
      desc:'Who you\'d say are proficient in AI in their work.',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Launch an AI Champions program: pick 2–3 power users per department, give them Claude Pro or Cursor seats, and run weekly "show what I built" sessions. Champions should own a SKILLS.md doc per function. Most orgs go from <25% → 50%+ adoption in 8 weeks. See gstack (github.com/garrytan/gstack) for how Garry Tan structures engineering skills that 10x developers.'},
    {id:'org_4', text:'Does your company have a shared AI workspace or AI OS that connects to your business tools?', type:'single',
      desc:'This is a system where AI can access your docs, CRM, tasks, or code — not just a chatbot in a browser tab. Possible setups: Obsidian + Claude Code, Cowork, Cursor + GitHub, Notion AI, or similar. "Partially" means it works for a subset of people.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Deploy an org-wide AI workspace — Obsidian + Claude Code for technical teams, Notion AI or Cowork for business. Store CLAUDE.md files, prompt libraries, and agent configs in a shared repo so every employee starts at 80% effectiveness instead of 0%. This is the #1 infrastructure gap. First step: create a shared vault documenting your top 20 workflows as AI-ready skills.'},
    {id:'org_5', text:'Do you measure AI\'s impact on your business with specific OKRs or KPIs?', type:'single',
      desc:'For example: "reduce support response time by 50% with AI," "100% AI tools adoption across the org," or "agent-to-employee ratio of X."',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Add one measurable AI OKR per function this quarter. Examples: "Reduce PR cycle time from 72h to <6h" (Eng), "AI resolves 50% of L1 tickets" (Support), "AI-drafted first pass on 100% of content" (Marketing). Without measurable targets, AI stays a hobby project. Review progress weekly — not quarterly.'},
    {id:'org_6', text:'Have you tried always-on agents like OpenClaw?', type:'single',
      desc:'Could be Hermes by Nous or Claude Code-based setups.',
      options:[{text:'Yes',score:100},{text:'No',score:0},DK],
      imp:2, rec:'Deploy one always-on agent for your highest-volume repetitive task: PR review, ticket triage, or daily report generation. Tools: OpenClaw, Claude Code daemon, or Hermes. In one of our clients, a single always-on agent on support triage saved the equivalent of 10–12 FTE (40% of the CS staff). Start small, measure the impact, then expand to every function.'},
    {id:'org_7', text:'Does your company have internal instructions or AI playbook for specific tasks or each function?', type:'single',
      desc:'For example: a step-by-step guide that tells AI how to write a sales proposal, onboard a new hire, or generate a report — in your company\'s way, with your data. Example: Claude Skills for your organization.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Create a SKILLS.md per function documenting: which AI tools to use, which workflows are AI-assisted, and standard prompts. Takes 2–3 hours per function, saves hundreds of hours. See "Lessons from Building Claude Code: How We Use Skills" by Thariq from the Claude Code team (x.com/trq212/status/2033949937936085378) and gstack (github.com/garrytan/gstack) for how YC structures engineering skills. Your playbook becomes institutional knowledge that compounds — every new hire starts at 80% instead of 0%.'},
    {id:'org_8', text:'Do people earn more if they use AI a lot and perform more work?', type:'single',
      desc:'Is AI adoption part of employee performance reviews?',
      options:[{text:'Yes, AI is part of reviews and incentives',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Add AI proficiency as a performance review criterion. Measure output per person (PRs shipped, tickets resolved, content produced) — not hours worked. Teams that incentivize AI adoption see 3x faster adoption curves. One of our clients (C-level) built a personal AI Chief of Staff with Claude Code that 2x\'d his output — it became an inspiration for the entire C-Suite.'},
    {id:'org_9', text:'Do you already have an internal AI unit?', type:'single', scored:true,
      options:[{text:'Yes — everyone is AI-native',score:100},{text:'Have CAIO / Head of AI',score:80},{text:'Driving it myself / with CTO',score:50},{text:'Have some dedicated AI engineers',score:25},{text:"Don't have dedicated people",score:0},DK],
      imp:2, rec:'Appoint a CAIO or Head of AI who owns the transformation roadmap, unblocks tool access, and runs the Champions network. This person should report to the CEO, not CTO — AI transformation is a business initiative, not just a tech one. Even "driving it myself + CTO" works, but someone must own AI adoption in their OKRs.'},
    {id:'org_10', text:'Which functions do you have in your organization?', type:'multi', scored:false, key:'functions',
      options: FUNC_OPTIONS.map(([label]) => ({text:label, score:-2}))},
  ]},

  /* ── Data & Infra ── */
  {id:'data', name:'Data & Infrastructure', desc:'The technical foundation that enables — or blocks — AI adoption.',
   extra:'We look at your data sources, how they are organized, and where institutional knowledge is stored.',
   questions:[
    {id:'data_1', text:'Do you have a corporate subscription to Claude Cowork/Code or ChatGPT/Codex?', type:'single',
      options:[{text:'Enterprise Claude',score:100},{text:'Enterprise ChatGPT',score:80},{text:'Only some people have company-provided access',score:35},{text:"Don't provide access to AI tools",score:0},DK],
      imp:3, rec:'Provide enterprise Claude or ChatGPT to every employee — not just engineers. At $20–100/seat/month, even a non-technical employee saving 5 hrs/week generates 10–25x ROI. Enterprise plans include security controls and audit logs that personal accounts don\'t. Pick one provider to avoid data fragmentation.'},
    {id:'data_2', text:'Can your employees ask AI a question and get an answer based on your company\'s actual data?', type:'single',
      desc:'Do you have a company-wide knowledge graph or vector DB with company context. Advanced orgs have .md + vector + knowledge-based context graphs that can answer any employee question.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Build a company knowledge layer: start with markdown files (Obsidian vault or Notion) covering org structure, product docs, processes, and key decisions. Even basic .md context files improve AI output quality by 50–70%. This is the foundation every other AI initiative builds on — agents with context produce dramatically better work than agents without it.'},
    {id:'data_3', text:'Do you have a centralized data warehouse (DWH)?', type:'single',
      options:[{text:'Yes',score:100},{text:'No',score:0},DK],
      imp:2, rec:'Set up a data warehouse (BigQuery, Snowflake, or DuckDB for smaller orgs). Without centralized data, every AI initiative starts with weeks of manual data gathering. In one diagnostic, we found 50% of planned AI initiatives were blocked by data scattered across 6+ systems. First step: identify your top 5 data sources and pipe them into one place.'},
    {id:'data_4', text:'Can AI tools connect directly to your internal systems (CRM, accounting, or project management tools) automatically via API or CLI, or only through a browser UI?', type:'single',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Expose your top 3 most-used internal tools via API or MCP (Model Context Protocol). Browser-only systems are invisible to AI agents — humans do the work forever. Use MCP servers to bridge Slack, Notion, Linear, CRM, and internal dashboards. One CTO connected their entire stack via MCP in 2 weeks and unlocked AI access to all internal data.'},
    {id:'data_5', text:'How fragmented is your tool stack?', type:'single',
      desc:'Think about how many apps (Gmail, Slack, Notion, Sheets, CRM, etc.) a person switches between to complete one task end-to-end.',
      options:[{text:'10+ tools per workflow',score:0},{text:'5–10 tools',score:45},{text:'Under 5, mostly integrated',score:90},DK],
      imp:1, rec:'Too many tools = too much context-switching for both humans and agents. Implement MCP connectors so AI agents access all tools through one interface. Claude Code + MCP can read Slack, query databases, update CRM, and pull docs — no tab-switching. Start with connectors for your 3 most-used tools.'},
    {id:'data_6', text:'Do you know how much it costs your company to complete routine tasks?', type:'single',
      desc:'Do you track cost-per-task for current processes?',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:1, rec:'Time your top 10 repetitive workflows before automating anything. Without baselines, you can\'t calculate ROI or prioritize. Common discoveries: sales reps spend 40% of time on non-selling tasks, support agents 30% on information lookup, engineers 25% on code review. These baselines make the business case for every AI initiative.'},
  ]},

  /* ── Engineering ── */
  {id:'eng', name:'Engineering', desc:'How your technical team builds, tests, and ships software.',
   extra:'We do deep-dive interviews with key engineering leaders, review the cycle, repo architecture, and eng practices.',
   questions:[
    {id:'eng_1', text:'How big is your engineering team?', type:'number', placeholder:'e.g. 40', key:'engSize'},
    {id:'eng_2', text:'Which % of the team is using AI coding tools?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Mandate Claude Code or Cursor for 100% of engineers. Add CLAUDE.md files in every repo with architecture context and coding standards. Teams going from <25% to full adoption see 2–3x throughput — engineers spend less time on boilerplate, tests, and context-switching. Budget: ~$100–200/seat/month. ROI: 10x+ within month one.\n\nBest teams provide engineers unlimited budgets for API and run competitions on who burns more - top-AI devs can burn $3-4k a day.'},
    {id:'eng_3', text:'What % of your QA work is currently automated?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Use Claude Code to auto-generate regression tests from every PR. One company cut their release cycle from 3 weeks to 2–3 days by automating QA with AI + a device test farm. Target: 75%+ automated test coverage within one quarter. Start by generating tests for your most critical user flows — the ones that break at 3am.'},
    {id:'eng_4', text:'Does your engineering team use advanced prompts or sub-agents for planning?', type:'single',
      desc:'E.g. gstack, custom Claude skills, multi-agent workflows.',
      tools:'github.com/garrytan/gstack',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Move beyond basic code completion. Set up CLAUDE.md files with project context, custom skills (see gstack — github.com/garrytan/gstack), and multi-agent workflows where one agent plans while others execute in parallel. Top engineers don\'t write code — they orchestrate 5–10 agents that write, test, and review simultaneously.'},
    {id:'eng_5', text:'What % of your eng team has always-on engineering agents?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Deploy always-on agents that work 24/7 on routine tasks: dependency updates, test fixes, documentation, linting, migration scripts. Start with 2–3 power users, measure output, then mandate org-wide. Always-on agents are the engineering equivalent of junior devs that never sleep and don\'t need onboarding.\n\nTry Hermes https://x.com/NousResearch/status/2026758996107898954?s=20 or just Claude Code on VPS (alternative is /remote control).'},
    {id:'eng_6', text:'How many active parallel CLI sessions do your engineers have on average?', type:'single',
      desc:'This measures how many command-line tools/terminals engineers run simultaneously. Advanced AI-augmented engineers run multiple AI agents in parallel. More parallel sessions = higher productivity multiplier.',
      options:[{text:'1–2',score:10},{text:'2–5',score:30},{text:'5–10',score:55},{text:'>10 (manual)',score:80},{text:'>10 (orchestrated)',score:100},DK],
      imp:3, rec:'The single biggest productivity multiplier: parallelism. Train engineers to run 5–10+ simultaneous Claude Code sessions — one per task, each in its own git worktree. Top engineers orchestrate 10+ agents: one writing tests, one refactoring, one implementing, one reviewing. This is the difference between 10 LOC/day and 10K LOC/day. Requires practice and good project structure (CLAUDE.md, clear specs).'},
    {id:'eng_7', text:"What's your average PR cycle time?", type:'single',
      options:[{text:'72h+',score:0},{text:'24–72h',score:35},{text:'6–24h',score:70},{text:'<6h',score:100},DK],
      imp:3, rec:'Make AI the first reviewer on every PR. Tools: Claude Code hooks, Greptile, or Macroscope. Auto-merge PRs that pass AI review + CI. Target: <6h from open to merge. Every hour of PR wait compounds — 72h cycles mean engineers context-switch 3+ times before their code lands. One company went from 72h → <6h and saw 2x deployment frequency.'},
    {id:'eng_8', text:'Which % of your PRs is reviewed by AI?', type:'single',
      tools:'Greptile, Claude Code, Macroscope',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Add AI code review (Greptile, Claude Code, Macroscope) as a mandatory CI check. AI catches what humans miss: security vulnerabilities, performance regressions, missing tests, style violations. Frees senior engineers from routine review — they focus on architecture only. One team\'s seniors got back 1–2 hrs/day previously spent on code review.'},
    {id:'eng_10', text:'How many LOCs are getting shipped by every engineer per day?', type:'single',
      desc:'Lines of Code measures raw output per engineer per day. In the context of AI-augmented development, it measures how much AI is amplifying capacity. Should be paired with quality metrics.',
      options:[{text:'<1k',score:10},{text:'1–5k',score:35},{text:'5–10k',score:70},{text:'>10k',score:100},DK],
      imp:1, rec:'Engineers shipping <1K LOC/day are leaving 5–10x productivity on the table. The fix: (1) Claude Code or Cursor for every engineer, (2) CLAUDE.md in every repo, (3) parallel agent workflows. Top AI-augmented engineers ship 5–10K+ LOC/day of production-quality code. This is the new baseline.'},
  ]},

  /* ── Sales ── */
  {id:'sales', name:'Sales', desc:'How your commercial team acquires and retains customers.',
   extra:'During audit, we shadow your sales people, look into CRM, key processes and metrics including conversion rates and retention.',
   questions:[
    {id:'sales_1', text:'How big is your sales team?', type:'number', placeholder:'e.g. 15', key:'salesSize'},
    {id:'sales_2', text:"What's your annual revenue per salesperson?", type:'single',
      options:[{text:'<$0.2M',score:10},{text:'$0.2–1M',score:35},{text:'$1–3M',score:70},{text:'>$3M',score:100},DK],
      imp:2, rec:'Low revenue per rep = too much time on non-selling work: CRM entry, follow-up emails, proposal drafting, meeting notes. Automate all of it. AI-assisted reps spend 80%+ time selling vs. 40% today. Tools: Granola for meeting notes, Claude for proposals, Zapier for CRM auto-entry. Target: 2x revenue per rep in 6 months.'},
    {id:'sales_3', text:'Which % of the team is using AI sales tools?', type:'single',
      desc:'Could be just Claude Cowork or Claude Code.',
      tools:'Monaco.com, Amplemarket.com, Hockeystack.com',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Every rep needs AI for three workflows: (1) pre-call research — company + person intel in 2 min, (2) email/proposal drafting — 80% first-pass quality, (3) post-call follow-up automation. Even basic Claude usage saves 5–10 hrs/week per rep. For advanced outreach: Monaco, Amplemarket, or HockeyStack. The gap between top and average reps is increasingly their AI toolkit, not their talent.'},
    {id:'sales_5', text:'Which CRM are you using?', type:'text', placeholder:'e.g. HubSpot, Attio, Salesforce'},
    {id:'sales_6', text:'What % of your sales calls is transcribed?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Transcribe 100% of sales calls — not just for notes, but as training data for everything else. Tools: Gong, Granola, or Fireflies. Transcripts enable: AI coaching that flags missed objection-handling, auto-generated follow-ups, CRM updates without typing, and win/loss pattern analysis. One company analyzed 1000+ transcripts and found the #1 predictor of deal closure — then trained all reps on it.'},
    {id:'sales_7', text:'Is "Meeting → CRM → Next steps" sequence automated?', type:'single',
      desc:'How much do sales reps do manually after a customer meeting?',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Automate the full post-meeting chain: transcribe (Granola/Gong) → extract action items → update CRM fields → draft personalized follow-up → schedule next steps. Saves 30–45 min per meeting. At 3–5 meetings/day, that\'s 1.5–3.5 hrs/day back for selling. One CCO built this entire pipeline for $20/mo using Cursor + API integrations.'},
    {id:'sales_8', text:'If your company does cold outreach: Is the "Build Pipeline → Enrich → Outreach → Execute → Analyze" sequence automated?', type:'single',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Build an end-to-end AI outreach pipeline: build list (LinkedIn Sales Nav, Apollo) → enrich (Clay, Clearbit) → AI-personalize each message → sequence via Apollo or Amplemarket → analyze reply rates → iterate. AI-personalized outreach gets 2–3x the reply rate of templates. Budget: $500–2K/mo for tools, 10x output vs. manual. Manual cold outreach is dead.'},
  ]},

  /* ── Customer Support ── */
  {id:'support', name:'Customer Support', desc:'How you handle customer inquiries and resolve issues.',
   extra:'We look deeper into key metrics, tickets by channel, and transcriptions.',
   questions:[
    {id:'cs_1', text:'How big is your customer support team?', type:'number', placeholder:'e.g. 20', key:'csSize'},
    {id:'cs_2', text:'What percentage of support tickets are repetitive, simple questions?', type:'single',
      desc:'In other words — what percentage could be automated?',
      options:[{text:'<25%',score:-2},{text:'25–50%',score:-2},{text:'50–75%',score:-2},{text:'>75%',score:-2},DK],
      imp:2, rec:'High repetitive ticket volume is the clearest AI ROI signal. Step 1: categorize your top 20 ticket types by volume. Step 2: deploy AI (Intercom Fin or Claude-based) for those 20 types. Target: 50%+ auto-resolution within 3 months. One company automated 60% of L1 support and avoided hiring 20+ FTE as they scaled.'},
    {id:'cs_3', text:'Which % of customer support queries is served by AI tools?', type:'single',
      tools:'Intercom, Fin.ai',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Roll out AI support in phases: Phase 1 — AI drafts responses, human reviews before sending (deploy in 2–3 weeks). Phase 2 — AI auto-resolves simple tickets (after 1 month of Phase 1 data). Phase 3 — AI handles 75%+ with human escalation path. Tools: Intercom Fin or Claude API + your KB. Even Phase 1 alone 2–3x\'s tickets per agent per day.'},
    {id:'cs_4', text:'What is your average ticket resolution time?', type:'single',
      desc:'For all channels, on average.',
      options:[{text:'6h+',score:10},{text:'1–6h',score:35},{text:'10–60 min',score:70},{text:'<10 min',score:100},DK],
      imp:2, rec:'Long resolution times stem from two problems: agents can\'t find the answer (knowledge gap) or tickets reach the wrong person (routing). Fix both: (1) internal knowledge agent that instantly surfaces answers from KB, past tickets, and docs, (2) AI ticket classification that routes to the right specialist on first try. Target: 50% reduction in average resolution time within 2 months.'},
    {id:'cs_5', text:"What's the average # of tickets per CS employee per day?", type:'single',
      options:[{text:'<10',score:10},{text:'10–20',score:35},{text:'20–30',score:70},{text:'>30',score:100},DK],
      imp:1, rec:'Low throughput = too much time spent looking up information and switching between systems. Deploy an agent-assist widget that pulls customer context from all systems into one pane and auto-drafts responses. One company\'s support agents went from opening 12 systems per ticket to one — AHT dropped 40% and throughput 2–3x\'d.'},
    {id:'cs_6', text:'Which % of support tickets/conversations is transcribed and accessible for analysis?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Record and transcribe 100% of support interactions across all channels. This data enables: (1) QA monitoring at 100% coverage instead of 2–5%, (2) training data for your AI chatbot, (3) identifying the top 20 issues to automate, (4) coaching based on what top agents do differently. Without transcripts, you\'re optimizing blind.'},
  ]},

  /* ── Marketing ── */
  {id:'marketing', name:'Marketing', desc:'How your marketing team creates and distributes content.',
   extra:'We review your content pipeline, channel performance, and attribution models.',
   questions:[
    {id:'mkt_1', text:'How big is your marketing team?', type:'number', placeholder:'e.g. 8', key:'mktSize'},
    {id:'mkt_2', text:'What % of your marketing (content, social, email, SEO) is AI-assisted?', type:'single',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Use AI for the first draft of everything: blogs, social, email, SEO, ad copy. Workflow: human brief → AI draft → human review → publish. 3–5x faster than manual. See how one marketer runs an entire content operation solo with AI agents: x.com/shannholmberg/status/2033596949601865786. Tools: Claude for long-form, Nano Banana for visuals. The goal isn\'t replacing marketers — it\'s 5x-ing their output.'},
    {id:'mkt_3', text:'Is your content creation process automated from research to publishing?', type:'single',
      desc:'This includes: research, briefing, drafting, reviewing, and publishing content.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Build a fully automated content pipeline: (1) AI researches trending topics and competitor content, (2) generates structured briefs, (3) drafts content, (4) human reviews and edits, (5) auto-publishes and tracks. Each step is 70–80% automated. One marketer using this pipeline produces the output of a 5-person team. Use Claude Code with custom skills to make it repeatable.'},
    {id:'mkt_4', text:'Do you have specialized marketers?', type:'single',
      desc:'People who focus on one type of marketing only (e.g. content, SEO, performance, email).',
      options:[{text:'Yes, all of them',score:100},{text:'Some combine multiple functions',score:50},{text:'No, we have generalist marketers only',score:15},DK],
      imp:1, rec:'AI lets generalist marketers produce specialist-quality output. Look at this guide https://x.com/shannholmberg/status/2033596949601865786?s=20\n\nA single marketer with the right AI stack can run SEO (Surfer + Claude), email (Claude + your ESP), social (Claude + scheduler), and performance (Claude copy + platform AI) at near-specialist quality. The constraint shifts from "hiring specialists" to "training generalists on AI workflows."'},
  ]},

  /* ── Product ── */
  {id:'product', name:'Product', desc:'How your product team researches, specs, and ships.',
   extra:'We review your product development cycle, feedback loops, and spec quality.',
   questions:[
    {id:'prod_1', text:'How big is your product team?', type:'number', placeholder:'e.g. 6', key:'prodSize'},
    {id:'prod_2', text:'Do your product managers and designers ship code?', type:'single',
      desc:'In the AI-native teams, PMs and designers only require engineers for PR reviews.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:3, rec:'Train PMs and designers to ship code with AI (Cursor, Claude Code, Lovable, or v0). In top teams, PMs build working prototypes — engineers only do review and production hardening. This collapses spec → design → implement from weeks to hours. One PM with Cursor ships 80% of features without filing an eng ticket. Start with a 2-day Claude Code workshop, look at latest from Lenny\'s Podcast and Skills (based on Podcast guests):\n- https://refoundai.com/lenny-skills/\n- The Design Process is Dead (Head of Design, Anthropic) https://www.lennysnewsletter.com/p/the-design-process-is-dead\n- Head of Claude Code https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens'},
    {id:'prod_3', text:'What % of product research (market research, interviews, metrics analysis) is AI-assisted?', type:'single',
      tools:'Dovetail, Granola for calls, Claude Code for research and analysis',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Use AI across all product research: interview synthesis (Dovetail or Granola → Claude summarizes themes across 20+ interviews in minutes), competitive analysis (Claude Code researches features, pricing, positioning), metric deep-dives (Claude spots unexpected patterns in usage data). AI research is 5–10x faster and catches correlations humans miss.'},
    {id:'prod_4', text:'Do you use AI to turn customer requests into product tickets automatically?', type:'single',
      desc:'For example: AI converts Loom videos, Slack messages, or support tickets into Linear/Jira tasks with proper context and prioritization.',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Automate backlog creation: Slack message → AI extracts request → creates Linear/Jira ticket with context, priority, and related links. Loom recording → AI transcribes → structured ticket. Support theme clusters → auto-generated feature requests with frequency data. Tools: Zapier + Claude API, or Linear\'s built-in AI. No customer signal gets lost.'},
    {id:'prod_5', text:'Are product specs/PRDs drafted or co-written with AI?', type:'single',
      options:[{text:'Yes',score:100},{text:'Partially',score:50},{text:'No',score:0},DK],
      imp:2, rec:'Co-write every PRD with AI - use /plan with Claude or advanced versions like GStack by Garry Tan https://github.com/garrytan/gstack/.\n\nFeed Claude the research, metrics, constraints, and technical context — it produces a structured plan in minutes that you refine. AI-drafted plans are more thorough because AI doesn\'t forget edge cases, metrics definitions, or rollback plans. 80% time savings + higher quality.'},
  ]},

  /* ── Operations ── */
  {id:'ops', name:'Operations', desc:'How your operations, finance, legal, and people teams run day-to-day work.',
   extra:'We review your core workflows, approval chains, document processing, and reporting stack.',
   questions:[
    {id:'ops_1', text:'How big is your operations team?', type:'number', placeholder:'e.g. 20', key:'opsSize'},
    {id:'ops_2', text:'What % of your operational documents are processed or reviewed with AI?', type:'single',
      desc:'Contracts, invoices, compliance filings, HR documents, agreements, policy reviews — anything your ops team reads, signs off on, or files.',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:3, rec:'Put AI on every document-heavy workflow first — contract review, invoice processing, compliance checks, HR onboarding docs. AI can extract key terms, flag anomalies, and summarize in seconds what takes a person 30–60 minutes. Start with one high-volume document type (e.g. vendor contracts or expense reports) and run 100% of them through Claude. Most ops teams cut document processing time by 70–80% in the first month.'},
    {id:'ops_3', text:'How automated are your internal approval and routing workflows?', type:'single',
      desc:'Purchase orders, expense approvals, maintenance requests, HR sign-offs, legal reviews — how many manual handoffs happen before something gets done?',
      options:[{text:'Fully manual — everything goes through email or meetings',score:0},{text:'Partially connected — some tools talk to each other',score:50},{text:'Fully automated — AI routes, approves, escalates, and closes',score:100}],
      imp:3, rec:'Map your top 5 approval workflows and count the handoffs. Then automate one end-to-end: trigger → AI triage → route to right person → reminder if stalled → close. Tools: Zapier + Claude API, or n8n for self-hosted. One operations team eliminated 6 manual handoffs per maintenance request — 3h per ticket became 20 min. Every workflow you automate compounds.'},
    {id:'ops_4', text:'How much of your operational reporting is generated automatically?', type:'single',
      desc:'Weekly KPI dashboards, financial summaries, utilization reports, compliance snapshots — how much is copy-paste vs. auto-generated?',
      options:[{text:'All manual — someone builds it each time',score:0},{text:'Partially automated — some data pulls automatically',score:50},{text:'Fully automated — reports generate and distribute themselves',score:100},DK],
      imp:2, rec:'Set up automated reporting for your top 3 operational metrics. Connect your data sources to Claude via API or a BI tool — it can write the narrative, flag anomalies, and send the summary to the right people every Monday morning with zero human input. Ops leaders who automate reporting get 3–4 hours/week back and catch issues faster because reports run daily, not weekly.'},
    {id:'ops_5', text:'What % of routine operational communications are AI-drafted or templated?', type:'single',
      desc:'Vendor responses, internal notices, status updates, compliance reminders, onboarding emails — anything sent repeatedly with slight variations.',
      options:[{text:'<25%',score:10},{text:'25–50%',score:35},{text:'50–75%',score:70},{text:'>75%',score:100},DK],
      imp:2, rec:'Build a communication library: 20–30 templated prompts for your most common ops messages, each pre-loaded with your tone, context, and variable fields. Claude fills in the specifics in seconds. One operations manager went from spending 90 min/day on routine comms to under 15 min — same quality, faster. Start with your top 5 most-repeated message types.'},
    {id:'ops_6', text:'Do your operations people use AI to build their own tools and automations?', type:'single',
      desc:'Can a finance manager build a custom dashboard? Can an HR lead automate their onboarding checklist? Or does everything require an engineer?',
      options:[{text:'Yes — ops people ship their own tools regularly',score:100},{text:'Some do, with help',score:50},{text:'No — they rely entirely on engineering or bought software',score:0}],
      imp:3, rec:'Teach your ops team to vibe-code with Claude. In 2026, a non-technical operations person can build internal tools, dashboards, automations, and scripts using Claude Code or Cursor — no engineering ticket required. Run a one-day workshop: give everyone Claude access, pick one painful manual process per person, and have them build a solution. Most people ship something useful on day one. This is the highest-leverage ops investment you can make — it turns every ops person into a builder.'},
  ]},
];

/* ═══════════════════════════════════════════
   DIAGNOSTIC-ONLY QUESTIONS (Full Engagement)
   These are NOT shown in the self-serve quiz.
   Reserved for the paid Codos AI Transformation diagnostic.
   ═══════════════════════════════════════════ */
const DIAGNOSTIC_QUESTIONS: Record<string, Question[]> = {
  org: [
    {id:'diag_org_budget', text:'How much does your company currently spend on AI tools per year?', type:'single',
      desc:'Current annual spending on AI subscriptions (ChatGPT, Claude, Copilot, etc.). Baseline for ROI calculation.',
      options:[{text:'<$10K',score:-2},{text:'$10K–$50K',score:-2},{text:'$50K–$100K',score:-2},{text:'$100K–$500K',score:-2},{text:'>$500K',score:-2},DK]},
    {id:'diag_org_cost', text:"What's the average annual cost per employee (salary + benefits) in your organization?", type:'single',
      desc:'Fully-loaded cost per employee. Essential for calculating productivity ROI.',
      options:[{text:'<$60K',score:-2},{text:'$60K–$80K',score:-2},{text:'$80K–$120K',score:-2},{text:'$120K–$150K',score:-2},{text:'>$150K',score:-2},DK]},
  ],
  eng: [
    {id:'diag_eng_maintenance', text:'What % of engineering time is spent on feature development vs. maintenance/bug fixes?', type:'single',
      desc:'AI testing and code quality tools can reduce maintenance from 60% to 20%, freeing up engineering capacity for innovation.',
      options:[{text:'>75% feature dev',score:100},{text:'50–75% feature dev',score:70},{text:'25–50% feature dev',score:35},{text:'<25% feature dev (mostly maintenance)',score:10},DK],
      imp:2, rec:'AI-powered testing and code review can dramatically shift the feature-to-maintenance ratio. Target: reduce maintenance burden from 60% to 20% within two quarters.'},
    {id:'diag_eng_deploy', text:"What's your average time from code complete to production?", type:'single',
      desc:'Time between "code is done" and "code is live for users." AI can automate testing, security scans, and deployment workflows.',
      options:[{text:'<1 day',score:100},{text:'1–3 days',score:70},{text:'3–7 days',score:35},{text:'1–4 weeks',score:10},{text:'>4 weeks',score:0},DK],
      imp:2, rec:'Long deployment pipelines indicate process bottlenecks. AI can automate testing, security scans, and deployment workflows to reduce this from weeks to hours.'},
  ],
  sales: [
    {id:'diag_sales_cycle', text:"What's your average sales cycle length?", type:'single',
      desc:'Average time from first contact to closed deal. AI can reduce cycles by automating follow-ups, proposals, and objection handling.',
      options:[{text:'<30 days',score:-2},{text:'30–90 days',score:-2},{text:'90–180 days',score:-2},{text:'180+ days',score:-2},DK]},
    {id:'diag_sales_winrate', text:"What's your typical win rate?", type:'single',
      desc:'% of qualified opportunities that close. AI call analysis and coaching can increase win rates 10–20%.',
      options:[{text:'>50%',score:-2},{text:'30–50%',score:-2},{text:'10–30%',score:-2},{text:'<10%',score:-2},DK]},
    {id:'diag_sales_source', text:'What % of your revenue comes from inbound vs. outbound?', type:'single',
      desc:'Shows where to focus AI investment. Heavy outbound = automate prospecting. Heavy inbound = automate lead qualification.',
      options:[{text:'>75% inbound',score:-2},{text:'50–75% inbound',score:-2},{text:'25–50% inbound',score:-2},{text:'<25% inbound (mostly outbound)',score:-2},DK]},
  ],
  marketing: [
    {id:'diag_mkt_volume', text:'How many pieces of content does your team create per month?', type:'single',
      desc:'Total content output across all channels. AI can 3–5x content production speed with same team.',
      options:[{text:'<10',score:-2},{text:'10–30',score:-2},{text:'30–100',score:-2},{text:'>100',score:-2},DK]},
    {id:'diag_mkt_blogtime', text:"What's the average time to create one blog post?", type:'single',
      desc:'AI can reduce blog creation time from 6 hours to 2 hours. At 20 posts/month, that\'s 80 hours saved.',
      options:[{text:'<2 hours',score:-2},{text:'2–4 hours',score:-2},{text:'4–8 hours',score:-2},{text:'8+ hours',score:-2},DK]},
    {id:'diag_mkt_seo', text:'What % of your website traffic comes from organic search (SEO)?', type:'single',
      desc:'AI-optimized SEO content can increase organic traffic 20–40%.',
      options:[{text:'<25%',score:-2},{text:'25–50%',score:-2},{text:'50–75%',score:-2},{text:'>75%',score:-2},DK]},
    {id:'diag_mkt_ads', text:"What's your monthly paid advertising spend?", type:'single',
      desc:'AI can improve ad ROAS by 15–30% through better targeting and creative.',
      options:[{text:'<$10K',score:-2},{text:'$10K–$50K',score:-2},{text:'$50K–$100K',score:-2},{text:'>$100K',score:-2},{text:'No paid ads',score:-2},DK]},
  ],
  product: [
    {id:'diag_prod_interviews', text:'How many user interviews or customer calls does your product team conduct per month?', type:'single',
      desc:'AI can analyze interview transcripts to extract insights 10x faster.',
      options:[{text:'<5',score:-2},{text:'5–20',score:-2},{text:'20–50',score:-2},{text:'>50',score:-2},DK]},
    {id:'diag_prod_feedback', text:'How do you analyze customer feedback for product insights?', type:'single',
      desc:'AI can analyze 10,000 support tickets in minutes to find top feature requests.',
      options:[{text:'Automated (AI-powered)',score:100},{text:'Manual review (PMs read through)',score:35},{text:'Ad-hoc (only when questions arise)',score:10},{text:'Not analyzed systematically',score:0},DK],
      imp:2, rec:'Deploy AI-powered feedback analysis to surface patterns across support tickets, NPS comments, and reviews automatically.'},
    {id:'diag_prod_velocity', text:"What's your average time from feature idea to production?", type:'single',
      desc:'AI-assisted spec writing, development, and testing can reduce feature time 30–50%.',
      options:[{text:'<1 month',score:-2},{text:'1–3 months',score:-2},{text:'3–6 months',score:-2},{text:'>6 months',score:-2},DK]},
  ],
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function fmtMoney(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n;
}

function scoreColor(s: number): string {
  if (s < 0) return '#737373';
  if (s <= 30) return '#f87171';
  if (s <= 50) return '#fb923c';
  if (s <= 70) return '#60a5fa';
  return '#4ade80';
}

function getSizeMult(orgSize: number): number {
  for (const [threshold, mult] of SIZE_MULTS) {
    if (orgSize <= threshold) return mult;
  }
  return 1.0;
}

function isScored(q: Question): boolean {
  if (q.type === 'number' || q.type === 'text') return false;
  if (q.type === 'multi') return q.scored === true;
  if (q.type === 'single' && q.options?.every(o => o.score === -2)) return false;
  return true;
}

/* Mini score ring for function cards */
function MiniRing({score, color, size = 40}: {score: number; color: string; size?: number}) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(score, 0) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        style={{transition:'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'}} />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const QuizPage: React.FC = () => {
  const [screen, setScreen] = useState<'landing'|'quiz'|'loading'|'email'|'results'>('landing');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, number[]>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [headcounts, setHeadcounts] = useState<Record<string, number>>({});
  const [currentBlock, setCurrentBlock] = useState(0);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRole, setLeadRole] = useState('');
  const [leadDream, setLeadDream] = useState('');
  const [leadTelegram, setLeadTelegram] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [expandedRecs, setExpandedRecs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  /* ── Visible blocks based on Q10 selection ── */
  const visibleBlocks = useMemo(() => {
    const sel = multiAnswers['org_10'] || [];
    const ids = new Set(['org', 'data']);
    if (sel.length === 0) {
      ALL_BLOCKS.forEach(b => ids.add(b.id));
    } else {
      sel.forEach(i => { const bid = FUNC_OPTIONS[i]?.[1]; if (bid) ids.add(bid); });
    }
    return ALL_BLOCKS.filter(b => ids.has(b.id));
  }, [multiAnswers]);

  /* ── Scoring ── */
  const computeBlockScore = useCallback((block: Block): number => {
    let sum = 0, count = 0;
    for (const q of block.questions) {
      if (!isScored(q)) continue;
      if (q.type === 'multi' && q.scored) {
        const sel = multiAnswers[q.id] || [];
        if (!sel.length) continue;
        const mx = Math.max(...sel.map(i => q.options![i]?.score ?? 0));
        if (mx === -1) continue;
        sum += mx; count++;
      } else if (q.type === 'single') {
        const ai = answers[q.id];
        if (ai === undefined) continue;
        const s = q.options![ai]?.score ?? 0;
        if (s === -1) continue;
        sum += s; count++;
      }
    }
    return count >= 2 ? Math.round(sum / count) : -1;
  }, [answers, multiAnswers]);

  const computeScores = useCallback(() => {
    const blockScores: Record<string, number> = {};
    visibleBlocks.forEach(b => { blockScores[b.id] = computeBlockScore(b); });
    const funcIds = visibleBlocks.filter(b => b.id !== 'org' && b.id !== 'data').map(b => b.id);
    const funcWeight = funcIds.length > 0 ? 0.65 / funcIds.length : 0;
    const weights: Record<string, number> = {org: 0.20, data: 0.15};
    funcIds.forEach(id => { weights[id] = funcWeight; });
    let wSum = 0, wTotal = 0;
    for (const b of visibleBlocks) {
      const s = blockScores[b.id];
      const w = weights[b.id] || 0;
      if (s >= 0 && w > 0) { wSum += s * w; wTotal += w; }
    }
    const overall = wTotal > 0 ? Math.round(wSum / wTotal) : 0;
    return {blockScores, overall};
  }, [visibleBlocks, computeBlockScore]);

  /* ── $ Estimation ── */
  const computeSavings = useCallback(() => {
    const {blockScores} = computeScores();
    const orgSize = headcounts['orgSize'] || 0;
    const revIdx = answers['org_2'] ?? -1;
    const sizeMult = getSizeMult(orgSize);
    const revCap = revIdx >= 0 ? REV_CAPS[revIdx] : 1500000;

    // Org/data readiness multiplier — low readiness = bigger untapped upside
    const orgScore = blockScores['org'] ?? 50;
    const dataScore = blockScores['data'] ?? 50;
    const readiness = orgScore * 0.6 + dataScore * 0.4;
    const readinessMult = readiness < 20 ? 2.5
      : readiness < 40 ? 2.0
      : readiness < 60 ? 1.5
      : readiness < 80 ? 1.2 : 1.0;

    const items: {blockId:string; name:string; hc:number; low:number; high:number}[] = [];
    let totalRaw = 0;
    for (const b of visibleBlocks) {
      const sph = BLOCK_SAVINGS[b.id];
      const hcKey = BLOCK_HC[b.id];
      if (!sph || !hcKey) continue;
      const hc = headcounts[hcKey] || 0;
      const score = blockScores[b.id] ?? 0;
      if (hc <= 0 || score < 0) continue;
      const gap = (100 - Math.max(score, 0)) / 100;
      const raw = hc * sph * gap * sizeMult * readinessMult;
      totalRaw += raw;
      items.push({blockId: b.id, name: b.name, hc, low: Math.round(raw * 0.6), high: Math.round(raw * 1.3)});
    }
    if (totalRaw * 1.3 > revCap) {
      const scale = revCap / (totalRaw * 1.3);
      items.forEach(it => { it.low = Math.round(it.low * scale); it.high = Math.round(it.high * scale); });
    }
    const totalLow = items.reduce((s, i) => s + i.low, 0);
    const totalHigh = items.reduce((s, i) => s + i.high, 0);
    return {items, totalLow, totalHigh};
  }, [computeScores, headcounts, answers, visibleBlocks]);

  /* ── Get recommendations for results ── */
  const getBlockRecs = useCallback((block: Block) => {
    const recs: {q:Question; answerText:string; score:number; isVisGap:boolean}[] = [];
    for (const q of block.questions) {
      if (!q.rec) continue;
      if (q.type === 'single') {
        const ai = answers[q.id];
        if (ai === undefined) continue;
        const opt = q.options![ai];
        if (opt.score === -1) {
          recs.push({q, answerText: opt.text, score: -1, isVisGap: true});
        } else if (opt.score < 60) {
          recs.push({q, answerText: opt.text, score: opt.score, isVisGap: false});
        }
      }
      if (q.type === 'multi' && q.scored) {
        const sel = multiAnswers[q.id] || [];
        if (!sel.length) continue;
        const mx = Math.max(...sel.map(i => q.options![i]?.score ?? 0));
        const txt = sel.map(i => q.options![i]?.text).join(', ');
        if (mx === -1) {
          recs.push({q, answerText: txt, score: -1, isVisGap: true});
        } else if (mx < 60) {
          recs.push({q, answerText: txt, score: mx, isVisGap: false});
        }
      }
    }
    return recs;
  }, [answers, multiAnswers]);

  /* ── Generate full report as Markdown ── */
  const generateMarkdown = useCallback(() => {
    const {blockScores, overall} = computeScores();
    const {items: savingsItems, totalLow, totalHigh} = computeSavings();
    const tier = TIERS.find(t => overall <= t.max) || TIERS[TIERS.length - 1];
    const lines: string[] = [];

    lines.push(`# AI Readiness Report`);
    lines.push('');
    lines.push(`**Overall Score: ${overall}/100 — ${tier.label}**`);
    lines.push('');
    lines.push(tier.msg);
    lines.push('');

    if (totalHigh > 0) {
      lines.push(`**Annual AI Opportunity: ${fmtMoney(totalLow)} – ${fmtMoney(totalHigh)}**`);
      lines.push('');
    }

    // Block scores summary
    lines.push('## Scores by Domain');
    lines.push('');
    for (const b of visibleBlocks) {
      const s = blockScores[b.id] ?? -1;
      const saving = savingsItems.find(it => it.blockId === b.id);
      const label = s >= 0 ? `${s}/100` : 'N/A';
      const savingStr = saving ? ` | Potential: ${fmtMoney(saving.low)}–${fmtMoney(saving.high)}/yr` : '';
      lines.push(`- **${b.name}**: ${label}${savingStr}`);
    }
    lines.push('');

    // Change Management Framework
    lines.push('## Change Management Framework');
    lines.push('');
    for (const quad of QUADRANT_MAP) {
      const filteredQIds = quad.qIds.filter(qId => {
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
      }).slice(0, 3);

      if (filteredQIds.length === 0) continue;
      lines.push(`### ${quad.icon} ${quad.label}`);
      lines.push('');
      for (const qId of filteredQIds) {
        const block = ALL_BLOCKS.find(bl => bl.questions.some(qq => qq.id === qId));
        const q = block?.questions.find(qq => qq.id === qId);
        if (!q || !q.rec) continue;
        lines.push(`- **${q.text}**`);
        lines.push(`  ${q.rec}`);
        if (q.tools) lines.push(`  Tools: ${q.tools}`);
        lines.push('');
      }
    }

    // Functional AI Opportunities
    lines.push('## Functional AI Opportunities');
    lines.push('');
    for (const b of visibleBlocks.filter(bl => !['org','data'].includes(bl.id))) {
      const s = blockScores[b.id] ?? -1;
      const saving = savingsItems.find(it => it.blockId === b.id);
      const recs = getBlockRecs(b);
      const allGaps = recs.filter(r => !r.isVisGap);
      const sorted = [...allGaps].sort((a, c) => {
        const impA = a.q.imp || 1, impC = c.q.imp || 1;
        if (impC !== impA) return impC - impA;
        return a.score - c.score;
      });
      const top = sorted.slice(0, 3);
      const visGaps = recs.filter(r => r.isVisGap);

      lines.push(`### ${b.name}${s >= 0 ? ` (Score: ${s}/100)` : ''}`);
      if (saving) lines.push(`Annual AI potential: ${fmtMoney(saving.low)}–${fmtMoney(saving.high)}`);
      lines.push('');

      if (top.length > 0) {
        lines.push('**Top initiatives:**');
        lines.push('');
        for (let i = 0; i < top.length; i++) {
          const {q} = top[i];
          const impLabel = q.imp === 3 ? 'High' : q.imp === 2 ? 'Med' : 'Low';
          lines.push(`${i + 1}. [${impLabel}] ${q.rec}`);
          if (q.tools) lines.push(`   Tools: ${q.tools}`);
        }
        lines.push('');
      }

      if (visGaps.length > 0) {
        lines.push('**Visibility gaps:**');
        for (const {q} of visGaps) {
          lines.push(`- ${q.text}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }, [computeScores, computeSavings, visibleBlocks, getBlockRecs, answers, multiAnswers]);

  const handleCopyMarkdown = useCallback(async () => {
    const md = generateMarkdown();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateMarkdown]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  /* ── Loading animation ── */
  useEffect(() => {
    if (screen !== 'loading') return;
    const labels = visibleBlocks.map(b => b.name).concat(['Opportunity Mapping']);
    let i = 0;
    const interval = setInterval(() => {
      setLoadingStep(i); i++;
      if (i >= labels.length) { clearInterval(interval); setTimeout(() => setScreen('email'), 600); }
    }, 400);
    return () => clearInterval(interval);
  }, [screen, visibleBlocks]);

  /* ── Score animation ── */
  useEffect(() => {
    if (screen !== 'results') return;
    const {overall} = computeScores();
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / 1800, 1);
      setAnimatedScore(Math.round(overall * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [screen, computeScores]);

  /* ── Inject premium CSS ── */
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

  /* ── Radar Chart ── */
  const renderRadar = (blockScores: Record<string, number>) => {
    const scored = visibleBlocks.filter(b => (blockScores[b.id] ?? -1) >= 0);
    if (scored.length < 3) return null;
    const size = 400, cx = size / 2, cy = size / 2, r = 110, n = scored.length;
    const vertex = (i: number, pct: number) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [cx + r * (pct / 100) * Math.cos(angle), cy + r * (pct / 100) * Math.sin(angle)];
    };
    const rings = [25,50,75,100].map(p => {
      const pts = Array.from({length:n},(_,i)=>vertex(i,p).join(',')).join(' ');
      return <polygon key={p} points={pts} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
    });
    const axes = Array.from({length:n},(_,i) => {
      const [x,y] = vertex(i,100);
      return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
    });
    const vals = scored.map(b => blockScores[b.id] || 0);
    const scorePts = vals.map((v,i)=>vertex(i,Math.max(v,3)).join(',')).join(' ');
    const labels = scored.map((b,i) => {
      const [x,y] = vertex(i,155);
      const s = blockScores[b.id] || 0;
      const anchor = x < cx - 10 ? 'end' : x > cx + 10 ? 'start' : 'middle';
      const col = BLOCK_COLORS[b.id] || '#888';
      return (
        <g key={b.id}>
          <text x={x} y={y} textAnchor={anchor} fontSize="11" fontWeight="600" fill={col} fontFamily="'Space Grotesk',sans-serif" letterSpacing="0.02em">{b.name}</text>
          <text x={x} y={y+15} textAnchor={anchor} fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="'JetBrains Mono',monospace">{s}</text>
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

  /* ═══════════════════════════════════════════════
     LANDING SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'landing') {
    const totalQ = visibleBlocks.reduce((s,b) => s + b.questions.length, 0);
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={{background:'#0a0a0f'}}>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{background:'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)'}} />

        <div className="max-w-xl w-full text-center relative z-10 q-fade">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-10 q-glass" style={{color:'#fb923c'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" style={{animation:'qPulse 2s ease infinite'}} />
            AI Readiness Diagnostic
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-[-0.04em] mb-6 leading-[1.05]" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            How AI-Ready Is<br />
            <span style={{background:'linear-gradient(135deg, #fb923c, #f97316, #ea580c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
              Your Organization
            </span>?
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md mx-auto" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Discover how much AI opportunity you're leaving on the table — with recommendations per function and dollar estimates.
          </p>

          <div className="flex justify-center gap-8 mb-12 text-xs text-gray-500 font-medium tracking-wide uppercase">
            {[`${totalQ} questions`, '15 min', 'Instant report'].map(b => (
              <span key={b} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-orange-500/60" />{b}
              </span>
            ))}
          </div>

          <button onClick={() => { setScreen('quiz'); setCurrentBlock(0); }}
            className="group relative px-10 py-4.5 rounded-2xl font-semibold text-base text-white transition-all duration-300"
            style={{background:'linear-gradient(135deg, #f97316, #ea580c)'}}>
            <span className="relative z-10 flex items-center gap-3">
              Start Diagnostic
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{boxShadow:'0 0 40px rgba(249,115,22,0.4), 0 0 80px rgba(249,115,22,0.15)'}} />
          </button>

          {/* Built by */}
          <div className="mt-14 mb-8 w-full max-w-lg mx-auto">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-600 mb-5 text-center" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Built by</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {name:'Dima Khanarin', photo:founderPhoto, href:'https://www.linkedin.com/in/dimakhanarin/',
                 lines:['CEO, Everclear Foundation ($5BN volume, Pantera-backed)','Consultant, McKinsey']},
                {name:'Gleb Sidora', photo:glebPhoto, href:'https://www.linkedin.com/in/arodiss',
                 lines:['ML Engineer, Meta','Founding engineer, Condukt (Lightspeed-backed)']},
              ].map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noreferrer"
                  className="q-glass rounded-xl p-3 text-left hover:border-orange-500/20 transition-all duration-300 block">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800">
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-0.5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{p.name}</p>
                  <p className="text-[9px] uppercase tracking-[0.12em] font-semibold mb-2" style={{color:'#f97316', fontFamily:"'Space Grotesk',sans-serif"}}>Co-founder</p>
                  {p.lines.map(l => (
                    <p key={l} className="text-[11px] text-gray-500 leading-relaxed" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{l}</p>
                  ))}
                </a>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Based on the{' '}
            <a href={PLAYBOOK_URL} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">AI-Native Playbook</a>
            {' \u00b7 '}
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
    const safeBlock = Math.min(currentBlock, visibleBlocks.length - 1);
    const block = visibleBlocks[safeBlock];
    const progress = ((safeBlock + 1) / visibleBlocks.length) * 100;

    return (
      <div className="min-h-screen text-white flex flex-col" style={{background:'#0a0a0f'}}>
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.04] px-6 py-4" style={{background:'rgba(10,10,15,0.7)'}}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => safeBlock > 0 ? setCurrentBlock(safeBlock - 1) : setScreen('landing')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-4 h-4" />{safeBlock > 0 ? 'Back' : 'Exit'}
            </button>
            <div className="flex-1 mx-8">
              <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{width:`${progress}%`, background:'linear-gradient(90deg, #f97316, #fb923c)'}} />
              </div>
            </div>
            <span className="text-xs font-mono tabular-nums" style={{color:'rgba(255,255,255,0.35)'}}>{safeBlock + 1}/{visibleBlocks.length}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
          <div className="q-fade" key={block.id}>
            {/* Accent-line section header */}
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-1 h-8 rounded-full" style={{background:'linear-gradient(180deg, #f97316, rgba(249,115,22,0.15))'}} />
              <h2 className="text-3xl font-bold tracking-[-0.03em]" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{block.name}</h2>
            </div>
            <p className="text-sm text-gray-400 mb-10 ml-[18px]" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{block.desc}</p>

            <div className="space-y-4">
              {block.questions.map((q, qi) => {
                const isAnswered =
                  q.type === 'number' ? (headcounts[q.key!] || 0) > 0 :
                  q.type === 'text' ? (textAnswers[q.id] || '').length > 0 :
                  q.type === 'multi' ? (multiAnswers[q.id] || []).length > 0 :
                  answers[q.id] !== undefined;
                const Icon = Q_ICONS[q.id];

                return (
                  <div key={q.id}
                    className="p-7 rounded-2xl transition-all duration-300"
                    style={{
                      background: isAnswered ? 'rgba(249,115,22,0.03)' : 'rgba(255,255,255,0.02)',
                      border: isAnswered ? '1px solid rgba(249,115,22,0.12)' : '1px solid rgba(255,255,255,0.05)',
                    }}>
                    <div className="flex items-start gap-3">
                      {Icon && <Icon className="w-[18px] h-[18px] mt-[2px] shrink-0" style={{color: isAnswered ? '#f97316' : 'rgba(255,255,255,0.2)'}} />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold leading-relaxed tracking-[-0.01em]">
                          <span className="text-gray-500 font-mono text-sm mr-2">{qi + 1}</span>
                          {q.text}
                        </p>
                        {q.desc && <p className="text-sm mt-1.5 leading-relaxed" style={{color:'rgba(255,255,255,0.55)', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{q.desc}</p>}
                        {q.tools && <p className="text-xs mt-1.5 font-mono" style={{color:'rgba(255,255,255,0.4)'}}>Tools: {q.tools}</p>}
                      </div>
                    </div>
                    {!q.desc && !q.tools && <div className="mb-2" />}

                    {/* Single select */}
                    {q.type === 'single' && (
                      <div className="flex flex-wrap gap-2 mt-4 ml-[30px]">
                        {q.options?.map((opt, oi) => (
                          <button key={oi} onClick={() => setAnswers({...answers, [q.id]: oi})}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                            style={answers[q.id] === oi
                              ? {background:'linear-gradient(135deg, #f97316, #ea580c)', color:'#fff', border:'1px solid transparent', boxShadow:'0 0 12px rgba(249,115,22,0.25)'}
                              : opt.score === -1
                                ? {background:'transparent', border:'1px solid rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.4)'}
                                : {background:'transparent', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.85)'}
                            }>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multi select */}
                    {q.type === 'multi' && (
                      <div className="flex flex-wrap gap-2 mt-4 ml-[30px]">
                        {q.options?.map((opt, oi) => {
                          const sel = (multiAnswers[q.id] || []).includes(oi);
                          return (
                            <button key={oi} onClick={() => {
                              const curr = multiAnswers[q.id] || [];
                              setMultiAnswers({...multiAnswers, [q.id]: sel ? curr.filter(i=>i!==oi) : [...curr, oi]});
                            }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                            style={sel
                              ? {background:'linear-gradient(135deg, #f97316, #ea580c)', color:'#fff', border:'1px solid transparent', boxShadow:'0 0 12px rgba(249,115,22,0.25)'}
                              : {background:'transparent', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.85)'}
                            }>
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Number */}
                    {q.type === 'number' && (
                      <div className="mt-4 ml-[30px]">
                        <input type="number" min={0} max={50000} placeholder={q.placeholder}
                          value={headcounts[q.key!] || ''}
                          onChange={e => setHeadcounts({...headcounts, [q.key!]: parseInt(e.target.value) || 0})}
                          className="bg-transparent rounded-xl px-5 py-3 text-base font-mono font-semibold text-white w-36 outline-none transition-all duration-300"
                          style={{border:'1px solid rgba(255,255,255,0.08)'}}
                          onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                        <p className="text-xs mt-2" style={{color:'rgba(255,255,255,0.4)'}}>Used to calculate dollar estimates</p>
                      </div>
                    )}

                    {/* Text */}
                    {q.type === 'text' && (
                      <div className="mt-4 ml-[30px]">
                        <input type="text" placeholder={q.placeholder}
                          value={textAnswers[q.id] || ''}
                          onChange={e => setTextAnswers({...textAnswers, [q.id]: e.target.value})}
                          className="bg-transparent rounded-xl px-5 py-3 text-base text-white w-full max-w-xs outline-none transition-all duration-300"
                          style={{border:'1px solid rgba(255,255,255,0.08)'}}
                          onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                      </div>
                    )}
                  </div>
                );
              })}

              {block.extra && (
                <div className="p-5 rounded-2xl q-glass" style={{borderColor:'rgba(249,115,22,0.08)'}}>
                  <p className="text-sm text-orange-400/60 leading-relaxed" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                    <span className="font-semibold text-orange-400/80">In a full Codos diagnostic:</span> {block.extra}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="sticky bottom-0 backdrop-blur-2xl border-t border-white/[0.04] px-6 py-5" style={{background:'rgba(10,10,15,0.7)'}}>
          <div className="max-w-2xl mx-auto flex justify-end">
            <button onClick={() => safeBlock < visibleBlocks.length - 1 ? setCurrentBlock(safeBlock + 1) : setScreen('loading')}
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all duration-300"
              style={{background:'linear-gradient(135deg, #f97316, #ea580c)'}}>
              {safeBlock === visibleBlocks.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     LOADING SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'loading') {
    const labels = visibleBlocks.map(b => b.name).concat(['Opportunity Mapping']);
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={{background:'#0a0a0f'}}>
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{background:'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', animation:'qPulse 3s ease infinite'}} />

        <div className="max-w-sm w-full text-center relative z-10">
          {/* Spinning ring */}
          <div className="mx-auto mb-10 w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full" style={{border:'2px solid rgba(255,255,255,0.04)'}} />
            <div className="absolute inset-0 rounded-full" style={{
              border:'2px solid transparent', borderTopColor:'#f97316', animation:'qSpin 1s linear infinite'
            }} />
          </div>

          <h2 className="text-2xl font-bold tracking-[-0.03em] mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Analyzing Your Organization</h2>
          <p className="text-sm text-gray-500 mb-12" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Mapping across {visibleBlocks.length} domains</p>

          <div className="text-left space-y-0.5">
            {labels.map((label, i) => (
              <div key={label}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500"
                style={{
                  opacity: i <= loadingStep ? 1 : 0,
                  transform: i <= loadingStep ? 'translateY(0)' : 'translateY(12px)',
                  transitionDelay: `${i * 50}ms`,
                }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={i <= loadingStep - 1
                    ? {background:'linear-gradient(135deg, #f97316, #ea580c)'}
                    : {border:'1.5px solid rgba(255,255,255,0.08)'}
                  }>
                  {i <= loadingStep - 1 && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm transition-colors duration-300"
                  style={{color: i <= loadingStep - 1 ? '#fb923c' : '#71717a', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     EMAIL GATE SCREEN
     ═══════════════════════════════════════════════ */
  if (screen === 'email') {
    const handleEmailSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!leadEmail.trim() || !leadName.trim() || leadSubmitting) return;
      setLeadSubmitting(true);
      try {
        const {blockScores: bs, overall: ov} = computeScores();
        const scoresSummary = visibleBlocks.map(b => `${b.name}: ${bs[b.id] ?? 'N/A'}`).join(', ');
        const savings = computeSavings();
        const {totalLow: tl, totalHigh: th} = savings;

        // Save lead info
        await supabase.from('atlas_submissions').insert({
          name: leadName.trim(),
          email: leadEmail.trim(),
          source: 'quiz',
          role: leadRole.trim(),
          team_size: String(headcounts['orgSize'] || ''),
          looking_for: `Dream outcome: ${leadDream.trim() || 'N/A'}. AI Readiness Score: ${ov}/100. ${scoresSummary}. Est. opportunity: ${fmtMoney(tl)}–${fmtMoney(th)}/yr`,
          telegram: leadTelegram.trim(),
        });

        // Save full quiz results
        await supabase.from('quiz_results').insert({
          email: leadEmail.trim(),
          name: leadName.trim(),
          role: leadRole.trim(),
          telegram: leadTelegram.trim(),
          dream_outcome: leadDream.trim() || null,
          overall_score: ov,
          block_scores: bs,
          answers,
          multi_answers: multiAnswers,
          headcounts,
          savings_low: tl,
          savings_high: th,
          savings_by_block: savings.items,
          text_answers: textAnswers,
          selected_blocks: visibleBlocks.map(b => b.id),
        });

        // Fetch the ID of the just-inserted row
        const { data: rows } = await supabase
          .from('quiz_results')
          .select('id')
          .eq('email', leadEmail.trim())
          .order('created_at', { ascending: false })
          .limit(1);
        if (rows?.[0]?.id) {
          setReportId(rows[0].id);
          window.history.replaceState(null, '', `/report/${rows[0].id}`);
        }
      } catch { /* silent */ }
      setLeadSubmitting(false);
      setLeadDone(true);
      setScreen('results');
    };

    return (
      <div className="min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden" style={{background:'#0a0a0f'}}>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{background:'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)'}} />

        <div className="max-w-md w-full relative z-10 q-fade">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.15)'}}>
              <Mail className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-[-0.03em] mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
              Your Report Is Ready
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Enter your details to see the full AI Readiness Report with scores, savings estimates, and personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input type="text" placeholder="Your name" required value={leadName}
              onChange={e => setLeadName(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{border:'1px solid rgba(255,255,255,0.08)'}}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="email" placeholder="work@company.com" required value={leadEmail}
              onChange={e => setLeadEmail(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{border:'1px solid rgba(255,255,255,0.08)'}}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="text" placeholder="Your role (e.g. Founder, CTO, VP Eng)" value={leadRole}
              onChange={e => setLeadRole(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{border:'1px solid rgba(255,255,255,0.08)'}}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <textarea placeholder="What is your dream outcome?" value={leadDream}
              onChange={e => setLeadDream(e.target.value)} rows={2}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600 resize-none"
              style={{border:'1px solid rgba(255,255,255,0.08)'}}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="text" placeholder="Telegram @handle (optional)" value={leadTelegram}
              onChange={e => setLeadTelegram(e.target.value)}
              className="w-full bg-transparent rounded-xl px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-600"
              style={{border:'1px solid rgba(255,255,255,0.08)'}}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <button type="submit" disabled={leadSubmitting || !leadEmail.trim() || !leadName.trim()}
              className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
              style={{background:'linear-gradient(135deg, #f97316, #ea580c)'}}>
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
  const {blockScores, overall} = computeScores();
  const {items: savingsItems, totalLow, totalHigh} = computeSavings();
  const tier = TIERS.find(t => overall <= t.max) || TIERS[TIERS.length - 1];
  const scoreCirc = 2 * Math.PI * 72;
  const scoreOffset = scoreCirc - (animatedScore / 100) * scoreCirc;

  return (
    <div className="min-h-screen text-white" style={{background:'#0a0a0f'}}>

      {/* ─── Score Hero ─── */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{background:`radial-gradient(ellipse at 50% 30%, ${tier.color}12, transparent 70%)`}} />

        <div className="relative z-10 text-center pt-20 pb-16 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-10" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            AI Readiness Score
          </p>

          {/* Score ring */}
          <div className="relative w-[200px] h-[200px] mx-auto mb-8">
            <svg viewBox="0 0 160 160" className="w-full h-full" style={{filter:`drop-shadow(0 0 30px ${tier.color}20)`}}>
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={tier.color} />
                  <stop offset="100%" stopColor={tier.color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle cx="80" cy="80" r="72" fill="none" stroke="url(#scoreGrad)" strokeWidth="5"
                strokeLinecap="round" strokeDasharray={scoreCirc} strokeDashoffset={scoreOffset}
                transform="rotate(-90 80 80)" style={{transition:'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)'}} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold font-mono tracking-tighter" style={{color:tier.color, fontFamily:"'JetBrains Mono',monospace"}}>
                {animatedScore}
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase mt-1" style={{color:tier.color, opacity:0.8}}>
                {tier.label}
              </span>
            </div>
          </div>

          <p className="text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            {tier.msg}
          </p>

          {totalHigh > 0 && (
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl q-glass">
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Annual AI opportunity</span>
              <span className="text-lg font-bold font-mono tracking-tight" style={{color:'#fb923c', fontFamily:"'JetBrains Mono',monospace"}}>
                {fmtMoney(totalLow)} – {fmtMoney(totalHigh)}
              </span>
            </div>
          )}

          <p className="text-[11px] text-gray-600 mt-3 max-w-sm mx-auto leading-relaxed" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Based on headcount × savings-per-role × (100% − your score) × org size factor, capped by revenue. Range reflects 0.6×–1.3× estimate.
          </p>
        </div>

        {/* Subtle divider */}
        <div className="h-px mx-auto max-w-5xl" style={{background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ─── Change Management Framework ─── */}
        <div className="mb-16 q-fade" style={{animationDelay:'0.1s'}}>
          <h3 className="text-2xl font-bold tracking-[-0.03em] mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            Change Management Framework
          </h3>
          <p className="text-sm text-gray-500 mb-6" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Key Organization Initiatives to Drive Change
          </p>

          {/* 2×2 quadrant grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUADRANT_MAP.map((quad, qi) => {
              const isTop = qi < 2;
              const accentCol = isTop ? BLOCK_COLORS.org : BLOCK_COLORS.data;
              return (
                <div key={quad.key} className="relative overflow-hidden rounded-2xl q-glass" style={{padding:'20px'}}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:`linear-gradient(90deg, ${accentCol}50, transparent)`}} />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[15px]">{quad.icon}</span>
                    <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{color:'#f97316', fontFamily:"'Space Grotesk',sans-serif"}}>{quad.label}</span>
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
                        style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)'}}
                        onClick={() => setExpandedRecs(prev => ({...prev, [qId]: !prev[qId]}))}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{color:col, background:`${col}15`, fontFamily:"'JetBrains Mono',monospace"}}>{qId.toUpperCase()}</span>
                        </div>
                        <p className="text-[13px] leading-[1.55] font-medium" style={{
                          fontFamily:"'Plus Jakarta Sans',sans-serif",
                          color:'rgba(255,255,255,0.72)',
                          ...(isExpanded ? {} : {display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const, overflow:'hidden'}),
                        }}>{q.rec}</p>
                        {!isExpanded && (
                          <p className="text-[12px] mt-1" style={{color:`${col}70`, fontFamily:"'Space Grotesk',sans-serif"}}>show more ▾</p>
                        )}
                        {q.tools && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.tools.split(', ').map(t => (
                              <span key={t} className="text-[12px] font-mono px-1.5 py-0.5 rounded"
                                style={{color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>
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
          <h3 className="text-2xl font-bold tracking-[-0.03em] mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            Functional AI Opportunities
          </h3>
          <p className="text-sm text-gray-500 mb-8" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Top initiatives per business function
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleBlocks.filter(b => !['org','data'].includes(b.id)).map((b, bi) => {
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
                  style={{animationDelay:`${0.1 + bi * 0.08}s`, background:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.05)'}}>

                  {/* Top gradient edge */}
                  <div className="h-[2px]" style={{background:`linear-gradient(90deg, ${col}60, ${col}20, transparent)`}} />

                  <div className="p-6">
                    {/* Header: name + color dot */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{background:col}} />
                      <h4 className="text-[15px] font-bold tracking-[-0.01em]" style={{color:col, fontFamily:"'Space Grotesk',sans-serif"}}>{b.name}</h4>
                    </div>

                    {/* Score progress bar */}
                    {s >= 0 && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.04)'}}>
                          <div className="h-full rounded-full transition-all duration-[1.5s] ease-out"
                            style={{width:`${Math.max(s, 2)}%`, background:`linear-gradient(90deg, ${barCol}, ${barCol}80)`}} />
                        </div>
                        <span className="text-xs font-bold font-mono" style={{color:'rgba(255,255,255,0.6)', fontFamily:"'JetBrains Mono',monospace", minWidth:'24px', textAlign:'right'}}>{s}</span>
                      </div>
                    )}

                    {/* $ Potential */}
                    {saving && (
                      <div className="mb-5">
                        <p className="text-[22px] font-bold font-mono tracking-tight leading-none" style={{color:col, fontFamily:"'JetBrains Mono',monospace"}}>
                          {fmtMoney(saving.low)}–{fmtMoney(saving.high)}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-600 font-semibold mt-1.5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Annual AI potential</p>
                      </div>
                    )}

                    {/* Top 3 initiatives — mini cards */}
                    {top3.length > 0 && (
                      <div>
                        <div className="h-px mb-4" style={{background:'rgba(255,255,255,0.04)'}} />
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-600 font-semibold mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Top initiatives</p>
                        <div className="space-y-2.5">
                          {top3.map(({q, score}, idx) => {
                            const impLabel = q.imp === 3 ? 'High' : q.imp === 2 ? 'Med' : 'Low';
                            const impColor = q.imp === 3 ? ['rgba(249,115,22,0.12)','#f97316'] : q.imp === 2 ? ['rgba(251,191,36,0.1)','#fbbf24'] : ['rgba(255,255,255,0.04)','#666'];
                            const isExpanded = expandedRecs[q.id] || false;
                            return (
                              <div key={q.id} className="rounded-xl p-3.5 cursor-pointer transition-all duration-200"
                                style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)'}}
                                onClick={() => setExpandedRecs(prev => ({...prev, [q.id]: !prev[q.id]}))}>
                                {/* Top row: number + impact + score */}
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[11px] font-bold font-mono flex items-center justify-center w-[22px] h-[22px] rounded-md shrink-0"
                                    style={{color:col, background:`${col}15`, fontFamily:"'JetBrains Mono',monospace"}}>{idx + 1}</span>
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded"
                                    style={{color:impColor[1], background:impColor[0], fontFamily:"'Space Grotesk',sans-serif"}}>{impLabel}</span>
                                </div>
                                {/* Rec text — clamped to 3 lines unless expanded */}
                                <p className="text-[13px] leading-[1.6] font-medium" style={{
                                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                                  color:'rgba(255,255,255,0.78)',
                                  ...(isExpanded ? {} : {display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const, overflow:'hidden'}),
                                }}>{q.rec}</p>
                                {!isExpanded && (
                                  <p className="text-[10px] mt-1.5" style={{color:`${col}70`, fontFamily:"'Space Grotesk',sans-serif"}}>show more ▾</p>
                                )}
                                {/* Tool tags */}
                                {q.tools && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {q.tools.split(', ').map(t => (
                                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                        style={{color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {remaining > 0 && (
                          <p className="text-xs mt-3 pt-2.5" style={{borderTop:'1px solid rgba(255,255,255,0.03)', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
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
                      <p className="text-sm text-gray-600" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>No critical gaps detected.</p>
                    )}

                    {/* Visibility gaps */}
                    {visGaps.length > 0 && (
                      <div className="mt-4 pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.03)'}}>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-gray-700 font-semibold mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Visibility gaps</p>
                        {visGaps.map(({q}) => (
                          <p key={q.id} className="text-xs text-gray-600 leading-relaxed" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{'·'} {q.text}</p>
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
        <div className="mb-16 q-fade" style={{animationDelay:'0.35s'}}>
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-4" style={{color:'#555', fontFamily:"'Space Grotesk',sans-serif"}}>AI Transformation Roadmap</p>
            <h3 className="text-3xl font-bold tracking-[-0.03em] mb-3" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
              From Diagnostic to{' '}
              <span style={{background:'linear-gradient(135deg,#fb923c,#f97316,#ea580c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>AI-Native Organization</span>
            </h3>
            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{color:'#666', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              A structured 9-month journey: diagnose, launch, scale, optimize. Every phase builds on the last.
            </p>
          </div>

          {/* Phase timeline bar */}
          <div className="flex gap-[3px] mb-6 rounded-lg overflow-hidden" style={{height:'6px'}}>
            {[{w:14,c:'#f97316'},{w:46,c:'#fb923c'},{w:25,c:'#fbbf24'},{w:15,c:'#34d399'}].map((p,i) => (
              <div key={i} style={{flex:p.w, background:p.c, opacity:0.6}} />
            ))}
          </div>

          {/* Phase rows — Gantt layout */}
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
              .filter(b => !['org','data'].includes(b.id))
              .map(b => b.name);

            const phases = [
              {
                label:'Phase 1', duration:'Days 1–14', title:'Full AI Diagnostics', color:'#f97316',
                tagline:'Map every opportunity before making a single change',
                milestones:[
                  'Leadership interviews (CEO, C-level and key heads)',
                  'Process mapping across all functions — shadow real workflows',
                  'Current state scoring — AI readiness per domain',
                  'Opportunity sizing — $ estimates per initiative with headcount-adjusted ROI',
                  'Build full transformation plan with 100+ initiatives and Chief AI Officer Agent',
                ],
                deliverables:['AI Readiness Dashboard','Initiative Map (100+ opportunities)','ROI Model','Detailed Roadmap'],
                impact: `Baseline established across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. Leadership aligned on opportunity size and priority stack.`,
              },
              {
                label:'Phase 2', duration:'Days 15–60', title:'Launch & Quick Wins', color:'#fb923c',
                tagline:'Launch the AI Office, ship the first wins, build momentum',
                milestones:[
                  'Establish AI Office — appoint CAIO or transformation lead',
                  'Launch Change Management Initiatives (4 Quadrants)',
                  {text:'Deploy enterprise AI access for 100% of employees', dyn:true},
                  {text:'Kick-off pilot: AI-first workflows — target <6h cycle time', dyn:true},
                  {text:'Create AI playbook per function (SKILLS.md)', dyn:true},
                  'First pilot results — measure against diagnostic baselines',
                ],
                deliverables:['AI Office charter','Change Management framework','Enterprise AI tools','3–5 pilots launched'],
                impact: `AI Champions network active across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. First measurable wins (30–50% time savings). Organization-wide AI access.`,
              },
              {
                label:'Phase 3', duration:'Q3 2026', title:'Scale & Automate', color:'#fbbf24',
                tagline:'Expand what works, automate what repeats, measure everything',
                milestones:[
                  'Expand successful pilots to full departments',
                  {text:'Deploy always-on agents for support triage — 75% auto-resolution', dyn:true, block:'support'},
                  {text:'Automate content pipeline end-to-end: research to publish', dyn:true, block:'marketing'},
                  {text:'AI-assisted sales: autonomous follow-ups, proposal generation', dyn:true, block:'sales'},
                  {text:'Build company-wide knowledge layer — every doc queryable by AI', dyn:true},
                  'Mid-point ROI review vs. diagnostic baselines',
                ],
                deliverables:['Always-on agents deployed','Automated pipelines','Knowledge layer','ROI report'],
                impact: `50–70% of identified opportunities captured. ${selectedFuncImpacts.length > 0 ? selectedFuncImpacts.join('. ') + '.' : 'Major efficiency gains across selected functions.'}`,
              },
              {
                label:'Phase 4', duration:'Q4 2026', title:'AI-Native Organization', color:'#34d399',
                tagline:'Not using AI — being AI. Every function, every workflow, every decision.',
                milestones:[
                  {text:'Orchestrate Orchestrators — meta-agents managing agent fleets, self-healing pipelines', dyn:true},
                  {text:'Long-Term Org Memory — compounding knowledge graph for every future AI action', dyn:true},
                  {text:'Agent-to-Employee ratio >2:1 — each person has 2+ dedicated AI agents', dyn:true},
                  {text:'AI-native hiring & onboarding — agent setup on Day 1, AI fluency required', dyn:true},
                  'End-of-year executive review: full ROI vs. diagnostic baseline, 2027 roadmap',
                ],
                deliverables:['Orchestrator-of-orchestrators','Org Memory knowledge graph','Agent ratio >2:1','2027 AI roadmap'],
                impact: `AI is the organization across ${phase2Funcs.length > 0 ? phase2Funcs.join(', ') : 'all functions'}. 80%+ opportunity captured. 3–5x output without headcount growth.`,
              },
            ];
            return (
              <div className="flex flex-col gap-4">
                {phases.map((phase, pi) => (
              <div key={pi} className="flex flex-col md:flex-row overflow-hidden q-glass rounded-2xl">
                {/* Left: phase info */}
                <div className="relative md:border-r md:w-[340px] md:min-w-[340px]" style={{padding:24, borderColor:'rgba(255,255,255,0.04)'}}>
                  <div className="absolute top-0 left-0 bottom-0" style={{width:3, background:phase.color}} />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{color:phase.color, fontFamily:"'JetBrains Mono',monospace"}}>{phase.label}</p>
                  <p className="text-lg font-bold tracking-[-0.02em] text-white mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{phase.title}</p>
                  <p className="font-mono text-xs mb-2.5" style={{color:phase.color, opacity:0.7, fontFamily:"'JetBrains Mono',monospace"}}>{phase.duration}</p>
                  <p className="text-[13px] leading-relaxed" style={{color:'#555', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{phase.tagline}</p>

                  {/* Expected Impact */}
                  <div className="mt-4 p-3.5 rounded-xl relative overflow-hidden" style={{borderLeft:`3px solid ${phase.color}`, background:`linear-gradient(135deg, ${phase.color}08, ${phase.color}03)`}}>
                    <div className="absolute -top-2.5 -right-2.5 w-[60px] h-[60px] pointer-events-none" style={{background:`radial-gradient(circle, ${phase.color}12, transparent 70%)`}} />
                    <p className="text-[10px] uppercase tracking-[0.12em] font-bold mb-1.5 flex items-center gap-1.5" style={{color:phase.color, fontFamily:"'Space Grotesk',sans-serif"}}>
                      <Zap className="w-3 h-3" /> Expected Impact
                    </p>
                    <p className="text-[13px] leading-relaxed" style={{color:'rgba(255,255,255,0.8)', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{phase.impact}</p>
                  </div>
                </div>

                {/* Right: milestones + deliverables */}
                <div className="flex-1 min-w-0 p-6">
                  <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-2.5" style={{color:'#555', fontFamily:"'Space Grotesk',sans-serif"}}>Key Milestones</p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {phase.milestones.filter(m => {
                      if (typeof m === 'string') return true;
                      if (m.block) return visibleBlocks.some(b => b.id === m.block);
                      return true;
                    }).map((m, mi) => {
                      const mText = typeof m === 'string' ? m : m.text;
                      const isDyn = typeof m !== 'string' && m.dyn;
                      return (
                        <div key={mi} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-[10px]" style={{background:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.03)'}}>
                          <span className="w-[22px] h-[22px] flex items-center justify-center rounded-[7px] font-mono text-[11px] font-bold shrink-0"
                            style={{color:phase.color, background:`${phase.color}15`, fontFamily:"'JetBrains Mono',monospace"}}>{mi + 1}</span>
                          <div className="flex-1">
                            <p className="text-[14px] leading-relaxed" style={{color:'rgba(255,255,255,0.7)', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{mText}</p>
                            {isDyn && (
                              <span className="inline-block mt-1 font-mono text-[9px] font-semibold tracking-[0.04em]"
                                style={{color:phase.color, opacity:0.5, fontFamily:"'JetBrains Mono',monospace"}}>from your diagnostic</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-2" style={{color:'#555', fontFamily:"'Space Grotesk',sans-serif"}}>Deliverables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.deliverables.map((d, di) => (
                      <span key={di} className="text-xs px-3 py-1.5 rounded-lg" style={{
                        color:phase.color, background:`${phase.color}10`, border:`1px solid ${phase.color}25`,
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
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
        <div className="text-center rounded-3xl p-14 mb-12 q-glass q-fade relative overflow-hidden" style={{animationDelay:'0.4s'}}>
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{background:'radial-gradient(ellipse, rgba(249,115,22,0.06), transparent 70%)'}} />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-[-0.03em] mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
              See the Full Picture
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed mb-8" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              A full Codos AI Transformation maps 100+ initiatives across every function — with interviews, validated dollar estimates, and a prioritized roadmap. Typically uncovers 3-5x more opportunity.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={CTA_URL} target="_blank" rel="noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-300 relative"
                style={{background:'linear-gradient(135deg, #f97316, #ea580c)'}}>
                <Phone className="w-4 h-4" />
                Book Your Diagnostic Call
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{boxShadow:'0 0 40px rgba(249,115,22,0.35)'}} />
              </a>
              <button onClick={handleCopyLink}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 q-glass"
                style={linkCopied ? {color:'#4ade80', borderColor:'rgba(74,222,128,0.3)'} : {color:'#9ca3af'}}>
                {linkCopied ? <><Check className="w-4 h-4" /> Link Copied!</> : <><Link2 className="w-4 h-4" /> Copy Link</>}
              </button>
              <button onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 q-glass"
                style={copied ? {color:'#4ade80', borderColor:'rgba(74,222,128,0.3)'} : {color:'#9ca3af'}}>
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Report</>}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 pb-12" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          Built with the{' '}
          <a href={PLAYBOOK_URL} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">AI-Native Playbook</a>
          {' \u00b7 '}
          <a href="https://codos.ai" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">Codos</a>
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
