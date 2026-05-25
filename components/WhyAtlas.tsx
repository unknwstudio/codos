import React from 'react';

const WhyAtlas: React.FC = () => {
  return (
    <div className="relative z-10 space-y-32 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Section 5: Why Codos vs DIY */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Build vs. Buy Analysis</h2>
                <p className="text-xl text-gray-400 font-light">Strategic implications of internal development.</p>
            </div>
        </div>

        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0C]">
            {/* Header */}
            <div className="grid grid-cols-12 border-b border-white/10 text-xs font-mono font-medium text-gray-500 uppercase tracking-widest py-4 px-6 bg-white/[0.02]">
                <div className="col-span-4">Metric</div>
                <div className="col-span-4 border-l border-white/5 pl-6">In-house or using SaaS</div>
                <div className="col-span-4 border-l border-white/5 pl-6 text-orange-400">Codos</div>
            </div>

            {/* Rows */}
            {[
                ["Time to Value", "6-9 Months", "Days"],
                ["System Architecture", "Ad-hoc / Experimental", "Battle-tested / Scalable"],
                ["Data Privacy", "Weak / Cloud", "Strong / Local"],
                ["Workflow Adaptation", "Generic", "Bespoke Configuration"],
                ["Technical Support", "Internal Resource Drain", "Dedicated Concierge"]
            ].map(([metric, diy, codos], i) => (
                <div key={i} className="grid grid-cols-12 border-b border-white/5 last:border-0 py-6 px-6 items-center hover:bg-white/[0.02] transition-colors">
                    <div className="col-span-4 font-medium text-gray-200">{metric}</div>
                    <div className="col-span-4 border-l border-white/5 pl-6 text-gray-500">{diy}</div>
                    <div className="col-span-4 border-l border-white/5 pl-6 text-white font-semibold flex items-center gap-2">
                        {codos}
                        {i === 0 && <span className="flex h-2 w-2 rounded-full bg-green-500"></span>}
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default WhyAtlas;
