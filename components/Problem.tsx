import React from 'react';
import { MessageSquareOff, DatabaseZap, BrainCircuit, ArrowDown, AlertCircle } from 'lucide-react';

const Problem: React.FC = () => {
  return (
    <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Ambience - Reddish for 'Problem' state */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          ChatGPT promised you a copilot. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.35)]">
            You got a chatbot.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-10">
        {[
          {
            icon: MessageSquareOff,
            title: "Lack of privacy",
            desc: "Everything you share is not private anymore."
          },
          {
            icon: DatabaseZap,
            title: "No access to your actual data",
            desc: "It can't see your Telegram, Meeting notes or private information."
          },
          {
            icon: BrainCircuit,
            title: "Lack of execution",
            desc: "It talks, but doesn't do. You still have to do the actual work yourself."
          }
        ].map((item, i) => (
          <div key={i} className="group relative bg-black/40 border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Hover Gradient Border Effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-red-500/20 rounded-3xl transition-colors pointer-events-none" />
            
            {/* Subtle inner glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/0 to-red-900/0 group-hover:to-red-900/10 transition-all duration-500" />

            <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-red-500/30 transition-all duration-300 shadow-lg">
                  <item.icon className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-50 transition-colors">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="inline-block relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black ring-1 ring-white/10 rounded-lg px-8 py-4">
                <p className="text-xl md:text-2xl text-indigo-100 font-light">
                Atlas is different. It's not a chat — <span className="text-white font-medium">it's an operating system.</span>
                </p>
            </div>
        </div>
        
        <div className="mt-12 flex justify-center animate-bounce opacity-30">
            <ArrowDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Problem;