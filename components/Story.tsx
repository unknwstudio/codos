import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const Story: React.FC = () => {
  return (
    <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="font-mono text-xs text-orange-400 uppercase tracking-[0.25em]">Codos Story</span>
            <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>

            <div className="relative bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="mb-16 text-center md:text-left">
                        <p className="text-xl md:text-3xl leading-relaxed text-gray-200 font-light">
                            <span className="text-white font-medium">Codos</span> was initially co-developed by <a href="https://twitter.com/dimakhanarin" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-medium hover:text-orange-300 transition-colors border-b border-orange-400/50 hover:border-orange-300 pb-0.5">@dimakhanarin</a> and <a href="https://twitter.com/cyntro_py" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-medium hover:text-orange-300 transition-colors border-b border-orange-400/50 hover:border-orange-300 pb-0.5">@cyntro_py</a> to accelerate <a href="https://twitter.com/everclearorg" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-medium hover:text-orange-300 transition-colors border-b border-orange-400/50 hover:border-orange-300 pb-0.5">@everclearorg</a> and <a href="https://twitter.com/cyberfund_" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-medium hover:text-orange-300 transition-colors border-b border-orange-400/50 hover:border-orange-300 pb-0.5">@cyberfund_</a>, but turned to be helpful to others.
                        </p>
                    </div>

                    {/* Timeline / Evolution */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { step: "Fall 2024", text: "Simple n8n agents" },
                            { step: "Spring 2025", text: "Cursor-based Cybos prototype", link: "https://www.cybos.ai/" },
                            { step: "Fall 2025", text: "Cloud-based OS Metacortex", link: "https://metacortex.to/" },
                            { step: "2026", text: "Codos", active: true }
                        ].map((item, i, arr) => (
                            <div key={i} className="relative flex flex-col gap-4 p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                <div className="text-xs font-mono text-gray-600 uppercase tracking-wider">{item.step}</div>
                                <div className={`text-sm md:text-base font-medium ${item.active ? 'text-orange-400' : 'text-gray-300'}`}>
                                    {item.link ? (
                                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors border-b border-gray-600 hover:border-orange-400">
                                        {item.text}
                                      </a>
                                    ) : (
                                      item.text
                                    )}
                                </div>
                                {item.active && (
                                    <div className="absolute top-4 right-4">
                                        <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                                    </div>
                                )}
                                {i < arr.length - 1 && (
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
                                        <ArrowRight className="w-4 h-4 text-gray-700" />
                                    </div>
                                )}
                                {/* Mobile connector */}
                                {i < arr.length - 1 && (
                                    <div className="w-px h-6 bg-white/10 mx-auto md:hidden my-[-16px] relative z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-lg md:text-xl text-gray-400 font-light italic">
                            "We spent 18 months iterating so you don't have to."
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
