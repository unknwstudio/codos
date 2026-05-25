import React, { useState } from 'react';
import { Send, Bot, Sparkles, Command } from 'lucide-react';
import { askAtlas } from '../services/geminiService';
import { DemoState } from '../types';

const AtlasDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [state, setState] = useState<DemoState>(DemoState.IDLE);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setState(DemoState.LOADING);
    setResponse(null);

    const result = await askAtlas(input);
    
    setResponse(result);
    setState(DemoState.SUCCESS);
  };

  const suggestions = [
    "What is the status of the Q4 roadmap?",
    "Summarize the engineering standup.",
    "Draft a briefing for the board meeting.",
    "Are there any blockers in design?"
  ];

  return (
    <section id="demo" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Command Your OS</h2>
          <p className="text-gray-400">Experience the latency-free reasoning of Atlas. Ask anything.</p>
        </div>

        <div className="bg-space-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm relative">
            {/* Window Controls */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 text-xs text-gray-500 font-mono">atlas_kernel — bash — 80x24</div>
            </div>

            <div className="p-6 min-h-[400px] flex flex-col justify-between">
                
                {/* Chat History / Output Area */}
                <div className="flex-1 space-y-6 mb-6">
                    {state === DemoState.IDLE && (
                         <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 pt-10">
                            <Bot className="w-12 h-12 opacity-50" />
                            <p>Atlas is listening on port 3000...</p>
                         </div>
                    )}

                    {(state === DemoState.LOADING || state === DemoState.SUCCESS) && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-white">U</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">User</p>
                                <p className="text-white text-lg">{input}</p>
                            </div>
                        </div>
                    )}

                    {state === DemoState.LOADING && (
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="space-y-2 w-full">
                                <p className="text-sm text-indigo-400">Atlas is thinking...</p>
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            </div>
                        </div>
                    )}

                    {state === DemoState.SUCCESS && response && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-indigo-400">Atlas</p>
                                <p className="text-gray-100 leading-relaxed">{response}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div>
                    {state === DemoState.IDLE && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestions.map((s) => (
                                <button 
                                    key={s} 
                                    onClick={() => setInput(s)}
                                    className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <form onSubmit={handleAsk} className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Command className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Atlas to analyze your team's context..."
                            className="w-full bg-black/50 border border-white/10 text-white pl-12 pr-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                        />
                        <button 
                            type="submit"
                            disabled={!input || state === DemoState.LOADING}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AtlasDemo;