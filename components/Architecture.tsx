import React, { useState } from 'react';
import {
  Database, Cpu, Zap, ArrowDown, Plus,
  Calendar, CheckSquare, Clock, Search, MessageSquare, BarChart2,
  Brain, FileEdit, Users, FileSearch, ChevronDown, ChevronUp
} from 'lucide-react';

const allSkills = [
  // Initial 4 (always visible)
  { command: '/brief', icon: Calendar, description: 'Morning briefing with calendar, inbox highlights, and priority actions' },
  { command: '/qmd', icon: FileSearch, description: 'Hybrid search - BM25 + vectors + LLM reranking' },
  { command: '/research', icon: Search, description: 'Multi-agent deep dive with orchestrated web search' },
  { command: '/memory', icon: Brain, description: 'Capture facts from conversations to CRM profiles' },
  // Expanded (hidden initially)
  { command: '/schedule', icon: Clock, description: 'Find available slot, create event, send calendar invite' },
  { command: '/review', icon: BarChart2, description: 'Weekly reflection with wins, failures, and learnings' },
  { command: '/msg', icon: MessageSquare, description: 'Quick send via Telegram, Slack, or Email' },
  { command: '/draft', icon: FileEdit, description: 'Polished messages with research and iteration' },
  { command: '/call-prep', icon: Users, description: 'Meeting prep with research + YC-style questions' },
  { command: '/todo', icon: CheckSquare, description: 'Generate daily tasks from brief + carryover items' },
];

interface ArchitectureProps {
  variant?: 'default' | 'embedded';
}

const Architecture: React.FC<ArchitectureProps> = ({ variant = 'default' }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const visibleSkills = showAllSkills ? allSkills : allSkills.slice(0, 4);

  const connectors = [
    {
      name: 'Telegram',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#26A5E4" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    },
    {
      name: 'Slack',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
          <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
          <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
          <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
        </svg>
      )
    },
    {
      name: 'Gmail',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
        </svg>
      )
    },
    {
      name: 'Calendar',
      icon: (
        <svg viewBox="0 0 200 200" className="w-6 h-6">
          <g transform="translate(3.75 3.75)">
            <path fill="#FFFFFF" d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579l5.263-53.947L148.882,43.618z"/>
            <path fill="#1A73E8" d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421C73.408,129.263,69.145,127.934,65.211,125.276z"/>
            <path fill="#1A73E8" d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z"/>
            <path fill="#EA4335" d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z"/>
            <path fill="#34A853" d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z"/>
            <path fill="#4285F4" d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75H12.039z"/>
            <path fill="#188038" d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z"/>
            <path fill="#FBBC04" d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z"/>
            <path fill="#1967D2" d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z"/>
          </g>
        </svg>
      )
    },
    {
      name: 'Linear',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#5E6AD2" d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/>
        </svg>
      )
    },
    {
      name: 'Notion',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#000000" d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#ffffff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      )
    },
    {
      name: 'Drive',
      icon: (
        <svg viewBox="0 0 87.3 78" className="w-6 h-6">
          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
          <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
        </svg>
      )
    },
    {
      name: 'X',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#ffffff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Granola',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="0" y="0" width="24" height="24" rx="6" fill="#79d65e"/>
          <path d="M7 9c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5v1h-2.5V9c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-1.5h-1.5v-2H15v3.5c0 2-1.5 3.5-4 3.5s-4-1.5-4-3.5V9z" fill="#004126"/>
        </svg>
      )
    },
    {
      name: '+more',
      icon: (
        <Plus className="w-6 h-6 text-orange-400" />
      )
    }
  ];

  const sectionClassName =
    variant === 'embedded'
      ? 'relative z-10 py-16'
      : 'relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-space-900/50 border-y border-white/5';

  return (
    <section id={variant === 'default' ? 'solution' : undefined} className={sectionClassName}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What's inside Codos OS</h2>
        </div>

        <div className="relative flex flex-col gap-4">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/0 via-orange-500/50 to-orange-500/0 -translate-x-1/2 hidden md:block" />

            {/* Layer 1: Connectors */}
            <div className="relative group">
                <div className="absolute inset-0 bg-orange-500/5 rounded-2xl blur-xl group-hover:bg-orange-500/10 transition-all" />
                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-orange-400 font-mono text-sm mb-2">
                                <Database className="w-4 h-4" /> LAYER 1
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Connectors</h3>
                            <p className="text-gray-400 text-sm">All your data, ingested automatically. Updated every morning.</p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full">
                            {connectors.map(tool => (
                                <div key={tool.name} className="bg-white/5 border border-white/5 rounded-lg py-3 px-2 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 hover:scale-105 group/item cursor-default">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        {tool.icon}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium group-hover/item:text-gray-200">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center py-2 relative z-10">
                <ArrowDown className="w-6 h-6 text-gray-600" />
            </div>

            {/* Layer 2: Memory */}
            <div className="relative group">
                <div className="absolute inset-0 bg-orange-500/5 rounded-2xl blur-xl group-hover:bg-orange-500/10 transition-all" />
                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-orange-400 font-mono text-sm mb-2">
                                <Cpu className="w-4 h-4" /> LAYER 2
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Memory</h3>
                            <p className="text-gray-400 text-sm">Codos remembers everything. Context never resets.</p>
                        </div>
                        <div className="md:w-2/3 w-full space-y-3">
                             <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-xl">
                                <span className="text-orange-300 font-semibold block mb-1">Core Memory</span>
                                <span className="text-xs text-gray-400">Who you are, goals, preferences, decision framework</span>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                                    <span className="text-gray-300 text-sm font-medium">Context Graph</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                                    <span className="text-gray-300 text-sm font-medium">CRM</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                                    <span className="text-gray-300 text-sm font-medium">Projects</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center py-2 relative z-10">
                <ArrowDown className="w-6 h-6 text-gray-600" />
            </div>

            {/* Layer 3: Skills */}
            <div className="relative group">
                <div className="absolute inset-0 bg-green-500/5 rounded-2xl blur-xl group-hover:bg-green-500/10 transition-all" />
                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-green-400 font-mono text-sm mb-2">
                                <Zap className="w-4 h-4" /> LAYER 3
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Skills</h3>
                            <p className="text-gray-400 text-sm">Not prompts. 100+ executable workflows that actually do things - library is constantly updated.</p>
                        </div>
                        <div className="md:w-2/3 w-full">
                            {/* Skills Grid - Clawdlist style */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {visibleSkills.map(skill => (
                                    <div
                                        key={skill.command}
                                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500/30 hover:bg-white/[0.07] transition-all cursor-default"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <skill.icon className="w-6 h-6 text-green-400" />
                                            <span className="text-white font-semibold">{skill.command}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {skill.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Show more button */}
                            <button
                                onClick={() => setShowAllSkills(!showAllSkills)}
                                className="mt-4 w-full py-2 text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                {showAllSkills ? (
                                    <>Show less <ChevronUp className="w-4 h-4" /></>
                                ) : (
                                    <>Show more skills <ChevronDown className="w-4 h-4" /></>
                                )}
                            </button>

                            {/* Additional skills box - only show when expanded */}
                            {showAllSkills && (
                                <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-xl p-5 text-center">
                                    <span className="text-green-300 font-semibold text-sm">And 30+ Skills more</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
