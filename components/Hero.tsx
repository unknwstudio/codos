import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onCtaClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-grid-white bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Background Glow - More Sophisticated */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-950/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center max-w-5xl mx-auto">

        {/* Version Badge - Sleek */}
        <div className="mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">For Teams 50-1000</span>
            </div>
        </div>

        {/* Headline - Executive Level */}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.95]">
          AI-Transformation <br />
          As Software
        </h1>

        <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed tracking-wide">
          Make your organization AI-native.
        </p>

        {/* Buttons - Metallic/Glass feel */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <a
            href="https://www.codos.ai/#book-demo"
            className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span>Talk to Founder</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030304] to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
