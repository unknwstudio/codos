import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Terminal, BrainCircuit, ScanSearch, Server, LayoutTemplate, Loader2, ChevronRight, AlertCircle, MapPin, Clock, Zap, CheckCircle2, FileText } from 'lucide-react';
import { askCodos } from '../services/geminiService';
import { DemoState } from '../types';

// --- Icons & Data ---

const icons = {
  telegram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
  slack: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52h-2.52zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52v-2.52zM17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" /></svg>,
  linear: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M11.968 1.638C12.115 1.096 11.711.5 11.127.5H2.873C2.29.5 1.885 1.096 2.032 1.638l3.755 13.923c.148.542.72.84 1.268.682l8.77-2.52c.548-.157.82-.75.586-1.258L11.968 1.638zm6.54 11.025l-2.023 7.502c-.147.542.257 1.137.842 1.137h8.254c.584 0 .989-.596.842-1.137l-3.755-13.924c-.147-.542-.72-.84-1.268-.682l-8.77 2.52c-.548.157-.82.75-.586 1.258l6.463 3.326z" /></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.675 1.65.255 2.88.135 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  drive: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12.01 1.485c-.66 0-1.26.36-1.58.93L2.57 16.375a1.8 1.8 0 0 0 .32 2.26l.05.05c.34.33.8.51 1.28.51h15.56c.99 0 1.8-.81 1.8-1.8 0-.48-.19-.94-.52-1.27l-7.46-7.46-1.59-2.75-1.59 2.75L12 1.485h.01zM10.42 2.415l7.46 7.46-1.59 2.75H4.16l6.26-10.21zM4.16 13.625h12.13l-1.59 2.75H8.44l-4.28-2.75z" /><path d="M7.76 17.55L4.47 11.87 2.99 14.43c-.16.27-.24.57-.24.87 0 .31.08.62.24.9l1.52 2.62c.32.55.91.88 1.54.88h3.3l-1.59-2.15zM15.54 11.87l-3.29 5.68 1.59 2.15h3.3c.64 0 1.23-.33 1.54-.88l1.52-2.62c.16-.27.24-.58.24-.89 0-.3-.08-.6-.24-.88l-1.48-2.56-3.18 0z" /><polygon points="12.01 1.49 8.23 8.04 15.79 8.04 12.01 1.49" /></svg>,
  gmail: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>,
};

type ToolStep = {
    name: string;
    status: string;
    detail: string;
    icon?: React.ReactNode;
};

type Scenario = {
    id: string;
    label: string;
    prompt: string;
    tools: ToolStep[];
    response: React.ReactNode;
};

type Category = 'Founders' | 'Teams';

const CATEGORY_SCENARIOS: Record<Category, Scenario[]> = {
    Founders: [
        {
            id: 'daily_brief',
            label: 'Daily Brief',
            prompt: "Generate my daily brief for today",
            tools: [
              { name: "mcp/gmail", status: "scanning", detail: "priority inbox..." },
              { name: "mcp/slack", status: "pulling", detail: "highlights from 6 channels..." },
              { name: "mcp/telegram", status: "checking", detail: "DMs + founder groups..." },
              { name: "mcp/calendar", status: "loading", detail: "today's schedule..." },
              { name: "mcp/linear", status: "fetching", detail: "blockers + updates..." }
            ],
            response: (
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className="bg-red-500/10 border-l-2 border-red-500 p-2 rounded-r mb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-red-300 font-semibold text-[10px] uppercase tracking-wide">Critical</span>
                    </div>
                    <p className="text-gray-300 text-[11px]">Series A wire from Framework still pending. <span className="opacity-50">via Gmail</span></p>
                  </div>

                  <div className="space-y-1.5">
                     <div className="flex gap-3 items-start p-2 bg-white/5 rounded border border-white/5">
                        <div className="w-3 h-3 rounded bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1 h-1 bg-orange-500 rounded-full"></div></div>
                        <div className="text-gray-300 text-[11px]">
                           <span className="text-white font-medium block">3 Priority Calls</span>
                           Standup, Uniswap demo, Investor draft
                        </div>
                     </div>
                     <div className="flex gap-3 items-start p-2 bg-white/5 rounded border border-white/5">
                        <div className="w-3 h-3 rounded bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><div className="w-1 h-1 bg-green-500 rounded-full"></div></div>
                        <div className="text-gray-300 text-[11px]">
                           <span className="text-white font-medium block">Growth Update</span>
                           @mike: "DAU up 34% post-launch"
                        </div>
                     </div>
                  </div>
                </div>
              )
        },
        {
            id: 'crm',
            label: 'Context Graph',
            prompt: "Who's NM from Pantera? What's our history?",
            tools: [
              { name: "mcp/telegram", status: "found", detail: "23 messages with NM" },
              { name: "mcp/granola", status: "found", detail: "2 meeting transcripts" },
              { name: "mcp/gmail", status: "found", detail: "4 email threads" },
              { name: "mcp/calendar", status: "found", detail: "1 past meeting (Token2049)" },
              { name: "web/search", status: "enriching", detail: "via web search..." }
            ],
            response: (
                <div className="flex flex-col gap-2 w-full max-w-sm">
                   <div className="flex items-start gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-[10px]">NM</div>
                      <div>
                         <h4 className="text-white font-bold text-xs">Nick M.</h4>
                         <p className="text-orange-400 text-[10px]">Partner @ Pantera Capital</p>
                      </div>
                   </div>

                   <div className="space-y-1 text-[10px] text-gray-400 pl-1">
                      <div className="flex gap-2 items-center">
                         <MapPin className="w-3 h-3 shrink-0 text-gray-500" />
                         <span>Met at Token2049 Singapore</span>
                      </div>
                      <div className="flex gap-2 items-center">
                         <Clock className="w-3 h-3 shrink-0 text-gray-500" />
                         <span>Last contact: 2 days ago (Telegram)</span>
                      </div>
                      <div className="flex gap-2 items-center">
                         <Zap className="w-3 h-3 shrink-0 text-yellow-500" />
                         <span className="text-gray-300">Sentiment: Warm, waiting on metrics</span>
                      </div>
                   </div>

                   <div className="pt-2 border-t border-white/5">
                      <p className="text-gray-500 text-[10px] italic">"Want me to draft a follow-up?"</p>
                   </div>
                </div>
             )
        },
        {
            id: 'meetings',
            label: 'Meetings Prep',
            prompt: "Prep me for the Uniswap call at 2pm",
            tools: [
              { name: "system", status: "Invoking", detail: "/call-prep..." },
              { name: "mcp/calendar", status: "loading", detail: "event details..." },
              { name: "mcp/gmail", status: "found", detail: "3 threads with uniswap.org" },
              { name: "mcp/granola", status: "found", detail: "no prior meetings found" },
              { name: "web/search", status: "researching", detail: "\"Uniswap v4 hooks roadmap\"" }
            ],
            response: (
                <div className="space-y-2 w-full max-w-sm">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[9px] font-mono border border-orange-500/20">RESEARCH COMPLETE</span>
                   </div>
                   <div>
                      <span className="text-white font-bold text-[11px] block">Context</span>
                      <p className="text-gray-400 text-[10px] leading-relaxed">Intro via Hayden's tweet. Active interest in aggregator integrations.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 p-2 rounded border border-white/5">
                         <span className="text-[9px] text-gray-500 uppercase tracking-wide block mb-1">Their Goals</span>
                         <p className="text-gray-300 text-[10px]">Gas optimization, MEV protection</p>
                      </div>
                      <div className="bg-white/5 p-2 rounded border border-white/5">
                         <span className="text-[9px] text-gray-500 uppercase tracking-wide block mb-1">Your Angle</span>
                         <p className="text-gray-300 text-[10px]">12% Arb volume, hook-native.</p>
                      </div>
                   </div>
                </div>
              )
        },
        {
            id: 'schedule_meeting',
            label: 'Schedule Meeting',
            prompt: "Find time with NM next week, 30 min, afternoon PT",
            tools: [
              { name: "system", status: "Invoking", detail: "/schedule..." },
              { name: "mcp/calendar", status: "loading", detail: "your availability..." },
              { name: "mcp/telegram", status: "checking", detail: "Joey's response patterns..." },
              { name: "system", status: "calculating", detail: "timezone (SF = PT)..." },
              { name: "system", status: "generating", detail: "slots..." }
            ],
            response: (
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-mono rounded border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors">Tue 3pm</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-mono rounded border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors">Wed 4pm</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-mono rounded border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors">Thu 2pm PT</span>
                </div>

                <div className="relative group pl-2 border-l border-white/20">
                   <p className="text-gray-300 text-[10px] italic">
                     "Hey NM — would love to share what's happened since Token2049. Free Tue 3pm or Thu 2pm?"
                   </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="flex items-center gap-1.5 text-[10px] bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded transition-colors font-medium">
                     <div className="w-3 h-3">{icons.telegram}</div>
                     Send
                  </button>
                  <button className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded transition-colors border border-white/10">Edit</button>
                </div>
              </div>
            )
        }
    ],
    Teams: [
        {
            id: 'orchestration',
            label: 'Agent Orchestration',
            prompt: "Ship the token gating feature this week. Coordinate with the team.",
            tools: [
              { name: "/plan", status: "Invoking", detail: "" },
              { name: "linear", status: "reading", detail: "backlog..." },
              { name: "github", status: "reading", detail: "/contracts..." },
              { name: "calendar", status: "checking", detail: "team availability..." },
              { name: "system", status: "Spawning swarm", detail: "5 agents initialized..." },
              { name: "agent", status: "Orchestrator", detail: "defining workflows...", icon: <BrainCircuit className="w-full h-full" /> },
              { name: "agent", status: "Researcher", detail: "analyzing requirements...", icon: <ScanSearch className="w-full h-full" /> },
              { name: "agent", status: "Backend Agent", detail: "scaffolding API endpoints...", icon: <Server className="w-full h-full" /> },
              { name: "agent", status: "Front End Agent", detail: "generating UI components...", icon: <LayoutTemplate className="w-full h-full" /> }
            ],
            response: (
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-orange-300 text-[11px] font-bold">
                        <div className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                        </div>
                        5 Agents Active
                     </div>
                     <div className="flex items-center gap-1 text-[9px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        <div className="w-2.5 h-2.5 opacity-70">{icons.linear}</div>
                        Synced
                     </div>
                  </div>

                  <p className="text-gray-400 text-[10px] leading-relaxed">
                     Orchestrator initialized. Plan synced to Linear <span className="text-orange-400 font-mono ml-1">#PROJ-124</span>.
                     Quality Reviewer is standing by.
                  </p>

                  <div className="flex gap-1 mt-1">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-0.5 flex-1 bg-orange-500/20 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500 w-3/4 animate-pulse"></div>
                        </div>
                     ))}
                  </div>
                </div>
              )
        },
        {
            id: 'data_ingestion',
            label: 'Data Ingestion',
            prompt: "Connect all my tools",
            tools: [
              { name: "system", status: "Initializing", detail: "connectors..." },
              { name: "mcp/slack", status: "auth", detail: "4 workspaces authenticated", icon: icons.slack },
              { name: "mcp/telegram", status: "indexing", detail: "12 groups + DMs", icon: icons.telegram },
              { name: "mcp/linear", status: "synced", detail: "3 teams synced", icon: icons.linear },
              { name: "mcp/github", status: "connected", detail: "8 repos connected", icon: icons.github },
              { name: "mcp/gmail", status: "complete", detail: "OAuth complete", icon: icons.gmail },
              { name: "mcp/calendar", status: "access", detail: "read/write access", icon: icons.calendar }
            ],
            response: (
               <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className="flex items-center gap-2 text-green-400 text-[11px] font-bold">
                     <CheckCircle2 className="w-3 h-3" />
                     All Connectors Live
                  </div>
                  <p className="text-gray-400 text-[10px]">Unified context ready. 90 days of history indexed.</p>

                  <div className="grid grid-cols-6 gap-1 mt-1">
                     {['slack', 'telegram', 'linear', 'github', 'gmail', 'calendar'].map((t: any) => (
                        <div key={t} className="aspect-square rounded bg-white/5 border border-white/5 flex items-center justify-center relative group">
                            <div className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors">
                               {/* @ts-ignore */}
                               {icons[t]}
                            </div>
                            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-green-500 rounded-full"></div>
                        </div>
                     ))}
                  </div>
               </div>
            )
        },
        {
            id: 'cobrain',
            label: 'Org Co-Brain',
            prompt: "Our wallet is draining $500 every 10 min. Investigate.",
            tools: [
                { name: "system", status: "Investigating...", detail: "" },
                { name: "mcp/slack", status: "searching", detail: "#engineering, #alerts..." },
                { name: "mcp/github", status: "recent commits", detail: "/wallets, /swaps..." },
                { name: "mcp/linear", status: "checking", detail: "infra tickets..." },
                { name: "mcp/granola", status: "scanning", detail: "last 5 eng syncs..." },
                { name: "mcp/telegram", status: "checking", detail: "dev DMs..." },
                { name: "system", status: "Found correlation...", detail: "" },
                { name: "Github", status: "commit", detail: "\"Solana<>Ton swaps\" by @vishant (Dec 12)" },
                { name: "Granola", status: "sync", detail: "Dec 12 — \"Vishant testing Ton wallet\"" }
            ],
            response: (
                <div className="space-y-2 w-full max-w-sm">
                   <div className="bg-red-500/10 border border-red-500/30 p-2 rounded flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-red-300 text-[10px] font-bold">Root Cause Identified</span>
                   </div>
                   <p className="text-gray-300 text-[10px] leading-relaxed">
                      Yesterday Vishant created a Ton wallet to test Solana swaps. He forgot to set the limit.
                   </p>
                   <div className="bg-[#050505] p-2 rounded border border-white/10 font-mono text-[9px] text-green-400">
                      {'>'} config.set('swap_limit', 100)
                   </div>
                </div>
             )
        },
        {
            id: 'ppt_prep',
            label: 'PPT/Doc Prep',
            prompt: "Update the pitch deck for my Redis meeting — add our latest metrics",
            tools: [
                { name: "system", status: "Invoking", detail: "/research Redis Inc..." },
                { name: "web/search", status: "researching", detail: "\"Redis Inc enterprise priorities\"" },
                { name: "mcp/gdrive", status: "loading", detail: "\"Series A Deck v4.pdf\"...", icon: icons.drive },
                { name: "mcp/linear", status: "pulling", detail: "latest metrics from dashboard..." },
                { name: "system", status: "Generating slides...", detail: "" },
                { name: "Slide 7", status: "updating", detail: "ARR → $2.4M" },
                { name: "Slide 12", status: "adding", detail: "Redis-specific use case" }
            ],
            response: (
               <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                     <FileText className="w-3 h-3 text-white" />
                     <span className="text-white font-bold text-[10px]">Series A Deck v4_Redis.pdf</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                     <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-[9px] rounded">+ Slide 12 (Use Case)</span>
                     <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] rounded">ARR Updated</span>
                  </div>
                  <p className="text-gray-400 text-[10px] mt-1">Want me to export to PDF or open in Google Slides?</p>
                  <div className="flex gap-2 mt-1">
                     <button className="text-[9px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors">Open Slides</button>
                     <button className="text-[9px] bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded transition-colors">Export PDF</button>
                  </div>
               </div>
            )
        }
    ]
};

// Types for the Chat History
type Message =
  | { type: 'text'; role: 'codos' | 'user'; content: string | React.ReactNode }
  | { type: 'tool_sequence'; tools: ToolStep[] }
  | { type: 'response'; content: React.ReactNode };

const LiveSystemInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentButtons, setCurrentButtons] = useState<'categories' | Category | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const [activeTools, setActiveTools] = useState<ToolStep[]>([]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, activeTools, isTyping]);

  // Initial Boot Sequence
  useEffect(() => {
    let mounted = true;
    const bootSequence = async () => {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800)); // Boot delay

        if (mounted) {
            setHistory([
                {
                    type: 'text',
                    role: 'codos',
                    content: "Hi, I'm Codos, a Claude Code-based AI operating system for founders and teams.\n\nI aggregate context from your tools (Slack, Telegram, Gmail, Calendar, Notion, etc.) and run your workday — morning briefs, research, messaging, meeting prep.\n\nWhich use-cases you'd like to explore?"
                }
            ]);
            setIsTyping(false);
            setCurrentButtons('categories');
        }
    };
    bootSequence();
    return () => { mounted = false; };
  }, []);

  const handleCategorySelect = async (category: Category) => {
    setCurrentButtons(null);

    // 1. User Message
    setHistory(prev => [...prev, { type: 'text', role: 'user', content: `Explore: For ${category}` }]);

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));

    // 2. Codos Response
    setHistory(prev => [...prev, {
        type: 'text',
        role: 'codos',
        content: `Great, here's a short-list of some of the workflows you can automate with Codos — the list is not exhaustive and is extending every day! Choose which one you want:`
    }]);

    setIsTyping(false);
    setCurrentButtons(category);
  };

  const handleScenarioSelect = async (scenario: Scenario) => {
      // Don't allow multiple runs at once
      if (isTyping) return;

      setCurrentButtons(null); // Hide buttons during execution

      // 1. User Prompt
      setHistory(prev => [...prev, { type: 'text', role: 'user', content: scenario.prompt }]);
      setInput('');

      // 2. Run Simulation (Tools)
      setIsTyping(true);

      setActiveTools([]);

      for (const tool of scenario.tools) {
          await new Promise(r => setTimeout(r, 500));
          setActiveTools(prev => [...prev, tool]);
      }

      await new Promise(r => setTimeout(r, 800));

      // 3. Finalize
      setHistory(prev => [
          ...prev,
          { type: 'tool_sequence', tools: scenario.tools }, // Commit the full tool list to history
          { type: 'response', content: scenario.response }
      ]);
      setActiveTools([]); // Clear active animation
      setIsTyping(false);

      // Re-enable buttons for the same category
      const category = (Object.keys(CATEGORY_SCENARIOS) as Category[]).find(cat =>
          CATEGORY_SCENARIOS[cat].some(s => s.id === scenario.id)
      );
      if (category) {
          setCurrentButtons(category);
      }
  };

  const handleCustomAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [...prev, { type: 'text', role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);
    setCurrentButtons(null);

    // Generic Simulation
    const genericTools: ToolStep[] = [
        { name: "system", status: "analyzing", detail: "intent recognition..." },
        { name: "security", status: "verifying", detail: "whitelist check..." },
        { name: "codos_core", status: "processing", detail: "generating response..." }
    ];

    setActiveTools([]);
    for (const tool of genericTools) {
        await new Promise(r => setTimeout(r, 400));
        setActiveTools(prev => [...prev, tool]);
    }

    const realResponse = await askCodos(input);
    const disclaimer = "\n\n(Note: For demo purposes, we stick to only whitelisted use-cases. Full system access is restricted in this environment.)";

    setHistory(prev => [
        ...prev,
        { type: 'tool_sequence', tools: genericTools },
        { type: 'response', content: realResponse + disclaimer }
    ]);
    setActiveTools([]);
    setIsTyping(false);
    // Default back to categories
    setCurrentButtons('categories');
  };

  return (
    <section id="demo" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
           <div className="h-px w-12 bg-gray-700"></div>
           <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Live System Interface</h2>
           <div className="h-px w-12 bg-gray-700"></div>
        </div>

        <div className="bg-[#050505] border border-white/10 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-[400px]">

            {/* Terminal Header */}
            <div className="bg-[#111] px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-mono text-gray-500">codos_core // interactive_session</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Grid inside terminal */}
                <div className="absolute inset-0 bg-grid-white bg-[size:20px_20px] opacity-[0.03] pointer-events-none"></div>

                {/* Chat History Area */}
                <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-sm scrollbar-hide">

                    {history.map((msg, idx) => (
                        <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {msg.type === 'text' && (
                                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-wider">
                                        {msg.role === 'user' ? <span>Input Source: User</span> : <span className='flex items-center gap-1'><Bot className="w-3 h-3"/> Codos System</span>}
                                    </div>
                                    <div className={`py-2 px-3 rounded max-w-[85%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/10' : 'text-gray-300'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )}

                            {msg.type === 'tool_sequence' && (
                                <div className="space-y-1 mt-2 pl-4 border-l border-orange-500/20 py-2">
                                    {msg.tools.map((tool, tIdx) => (
                                        <ToolRow key={tIdx} tool={tool} />
                                    ))}
                                </div>
                            )}

                            {msg.type === 'response' && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex items-center gap-2 text-orange-400 text-[10px] uppercase tracking-wider">
                                        <Bot className="w-3 h-3" />
                                        <span>Codos Output</span>
                                    </div>
                                    <div className="pl-4 border-l border-orange-500 py-3 bg-orange-950/10 rounded-r-lg">
                                        {/* Render rich ReactNode content */}
                                        <div className="text-orange-100 leading-relaxed text-sm">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Active Typing / Tools Animation Area */}
                    {activeTools.length > 0 && (
                        <div className="space-y-1 mt-2 pl-4 border-l border-orange-500/20 py-2 animate-in fade-in">
                             {activeTools.map((tool, tIdx) => (
                                <ToolRow key={tIdx} tool={tool} />
                            ))}
                             <div className="pl-8 pt-2">
                                <div className="h-1 w-2 rounded bg-orange-500/50 animate-pulse"></div>
                            </div>
                        </div>
                    )}

                    {isTyping && activeTools.length === 0 && (
                        <div className="flex items-center gap-2 text-gray-600 animate-pulse">
                            <Bot className="w-4 h-4" />
                            <span className="text-xs">Codos is thinking...</span>
                        </div>
                    )}

                    {/* Spacer for auto-scroll visual comfort */}
                    <div className="h-4"></div>
                </div>

                {/* Input / Controls Area */}
                <div className="p-4 border-t border-white/10 bg-[#0A0A0C] shrink-0 z-20 min-h-[80px]">

                    {/* Dynamic Buttons */}
                    {!isTyping && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                            {currentButtons === 'categories' && (
                                <>
                                    {(['Founders', 'Teams'] as Category[]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="whitespace-nowrap flex items-center gap-2 text-[11px] uppercase tracking-wide bg-orange-500/10 hover:bg-orange-500/20 hover:text-orange-200 text-orange-300 border border-orange-500/20 px-4 py-2 rounded transition-all font-mono"
                                        >
                                            For {cat} <ChevronRight className="w-3 h-3" />
                                        </button>
                                    ))}
                                </>
                            )}

                            {currentButtons && currentButtons !== 'categories' && (
                                <>
                                    <button
                                        onClick={() => setCurrentButtons('categories')}
                                        className="whitespace-nowrap text-[10px] bg-white/5 hover:bg-white/10 text-gray-500 px-3 py-2 rounded transition-all font-mono mr-2 border border-transparent hover:border-white/10"
                                    >
                                        ← Back
                                    </button>
                                    {CATEGORY_SCENARIOS[currentButtons].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleScenarioSelect(s)}
                                            className="whitespace-nowrap text-[10px] uppercase tracking-wide bg-white/5 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-500/30 text-gray-400 border border-white/10 px-3 py-2 rounded transition-all font-mono"
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleCustomAsk} className="relative flex items-center gap-4">
                        <span className="text-orange-500 font-mono text-lg">{'>'}</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isTyping ? "System processing..." : "Execute custom command..."}
                            disabled={isTyping}
                            className="w-full bg-transparent text-white font-mono focus:outline-none placeholder:text-gray-700 disabled:opacity-50"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!input || isTyping}
                            className="p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                        >
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for tool rows
const ToolRow: React.FC<{ tool: ToolStep }> = ({ tool }) => (
    <div className="flex items-start gap-3 text-[11px] animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="text-gray-500 shrink-0 flex items-center gap-2 w-5 pt-0.5">
            {tool.icon ? (
                <div className="w-3 h-3 text-gray-400 opacity-70">{tool.icon}</div>
            ) : (
                <span className="text-orange-500 opacity-70">→</span>
            )}
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-2">
            <span className="text-gray-500 font-medium">{tool.name}</span>
            <span className="text-gray-600">{tool.status}</span>
            <span className="text-gray-400">{tool.detail}</span>
        </div>
    </div>
);

export default LiveSystemInterface;
