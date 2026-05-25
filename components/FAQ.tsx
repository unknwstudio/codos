import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

type FAQProps = {
  onCtaClick: () => void;
};

const FAQ: React.FC<FAQProps> = ({ onCtaClick }) => {
  const faqs = [
    { q: "What's the primary value of Codos?", a: "Real productivity gains from deep custom integration, knowledge transfer to build your internal AI excellence, and absolute privacy where data never leaves your devices." },
    { q: "Is it easy to build this myself?", a: "Getting easier every day! But Codos is 12 months of research + 6 months of building. We save you months of iteration and handle the complex architecture." },
    { q: "Does my team need to be technical?", a: "No. We handle the technical setup. Your team just uses it." },
  ];

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
            {faqs.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
                    <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                    <p className="text-gray-400">{item.a}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-orange-900/50 to-black border border-orange-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.2),transparent_50%)]" />
        <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to run your business like code?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Book a 30-minute discovery call. We'll show you exactly how Codos would work for your team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={onCtaClick}
                    className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
                >
                    Talk to founders
                    <ArrowRight className="w-5 h-5" />
                </button>
                <a href="mailto:dima@codos.ai" className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-4 transition-colors">
                    <Mail className="w-5 h-5" />
                    dima@codos.ai
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;