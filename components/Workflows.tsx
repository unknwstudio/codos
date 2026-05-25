import React from 'react';
import { FileText, Users, CalendarCheck, Activity, User } from 'lucide-react';

const Workflows: React.FC = () => {
  const workflows = [
    {
      icon: FileText,
      title: "Morning Brief",
      desc: "Every morning at 8am, Atlas reads your Telegram, Slack, Gmail, Calendar, and call transcripts. Surfaces what matters. Flags risks. Tells you who to follow up with.",
      visual: (
        <div className="space-y-3 font-mono text-xs">
            <div className="text-gray-500 border-b border-white/10 pb-2">atlas_brief_2024-05-24.md</div>
            <div className="space-y-1">
                <div className="text-indigo-400 font-bold"># 🌅 Morning Briefing</div>
                <div className="text-white">High Priority:</div>
                <div className="text-gray-400">- Board meeting deck due today (linear-124)</div>
                <div className="text-gray-400">- Sam (Delphi) asked about roadmap via Telegram</div>
                <div className="text-white mt-2">Schedule:</div>
                <div className="text-gray-400">- 10:00am: Sync with Eng</div>
                <div className="text-gray-400">- 2:00pm: Call with Konstantin</div>
            </div>
        </div>
      )
    },
    {
      icon: Users,
      title: "Meeting Prep",
      desc: "Before every call, Atlas pulls everything you know about the person — past conversations, their company, your shared history. Generates questions. You walk in prepared.",
      visual: (
            <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                    <div className="text-white font-bold">Meeting: Konstantin</div>
                    <div className="text-gray-500">In 15 mins</div>
                </div>
            </div>
            <div className="bg-indigo-900/20 p-3 rounded border border-indigo-500/20">
                <div className="text-indigo-300 font-bold mb-1">Context:</div>
                <p className="text-gray-400 leading-tight">Last spoke 3 weeks ago about API latency. He mentioned they are scaling to 10k users. Ask about their new infra migration.</p>
            </div>
        </div>
      )
    },
    {
      icon: CalendarCheck,
      title: "Task Execution",
      desc: "Say 'schedule a call with Konstantin next week' and Atlas checks both calendars, finds a slot, sends the invite, and confirms.",
      visual: (
        <div className="flex flex-col gap-3">
             <div className="self-end bg-indigo-600 text-white px-3 py-2 rounded-lg rounded-tr-none text-xs max-w-[80%]">
                Schedule call with Konstantin next week.
             </div>
             <div className="self-start bg-gray-800 text-gray-200 px-3 py-2 rounded-lg rounded-tl-none text-xs max-w-[90%]">
                <p className="mb-2">Checking calendars...</p>
                <div className="flex items-center gap-2 bg-black/30 p-2 rounded border border-white/10">
                    <CalendarCheck className="w-3 h-3 text-green-400" />
                    <span>Invite sent: Tue, 2:00 PM EST</span>
                </div>
             </div>
        </div>
      )
    },
    {
      icon: Activity,
      title: "AI Command Center",
      desc: "Track your team's focus and progress. Get alerts when things slip. AI-powered 1:1 prep.",
      visual: (
        <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-800 p-2 rounded border border-white/10">
                <div className="text-gray-500 mb-1">Team Velocity</div>
                <div className="text-green-400 font-bold text-lg">+12%</div>
            </div>
            <div className="bg-gray-800 p-2 rounded border border-white/10">
                <div className="text-gray-500 mb-1">Blockers</div>
                <div className="text-red-400 font-bold text-lg">3</div>
            </div>
            <div className="col-span-2 bg-gray-800 p-2 rounded border border-white/10">
                <div className="text-gray-500 mb-1">Focus Area</div>
                <div className="text-white">Q4 Roadmap, Mobile App</div>
            </div>
        </div>
      )
    }
  ];

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See it in action</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workflows.map((flow, i) => (
            <div key={i} className="group bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-all">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <flow.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{flow.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{flow.desc}</p>
                    </div>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 shadow-inner min-h-[140px] flex flex-col justify-center">
                    {flow.visual}
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default Workflows;