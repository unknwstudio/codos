import React from 'react';

const Process: React.FC = () => {
  return (
    <section className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">From zero to running in days</h2>
          <p className="text-lg text-gray-400">A clear path from diagnosis to durable leverage.</p>
        </div>

        <div className="relative">
             {/* Line */}
             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 hidden md:block" />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                {[
                    { week: "Days", title: "Diagnostics", desc: "Agentic interviews and data analysis to find lowest-hanging fruits." },
                    { week: "Weeks", title: "Pilot", desc: "Initial CAIO agent and Codos OS deployment." },
                    { week: "Months", title: "Transformation", desc: "Rollout of successful pilots and CAIO agent improvements." }
                ].map((step, i) => (
                    <div key={i} className="relative bg-black/60 p-7 md:p-8 border border-white/10 rounded-2xl z-10 hover:border-orange-500/40 transition-colors backdrop-blur-sm">
                        <div className="text-xs font-bold text-orange-500 uppercase tracking-[0.25em] mb-3">{step.week}</div>
                        <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                        <div className="h-px w-10 bg-white/20 mb-4" />
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </section>
  );
};

export default Process;