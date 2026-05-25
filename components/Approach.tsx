import React, { useState } from 'react';
import VideoDemo from './VideoDemo';
import Architecture from './Architecture';

const Approach: React.FC = () => {
  const [showPlatformDetails, setShowPlatformDetails] = useState(false);

  return (
    <section id="approach" className="relative z-10 bg-black px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-400/80 mb-6">
            Our approach
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            <span className="text-orange-400">Codos</span> helps you become
            AI-native and win the market.
          </h2>
        </div>

        <div className="space-y-8">
          <div className="group relative border border-white/10 rounded-2xl p-8 pr-24 bg-white/[0.02] hover:bg-[#FF7A1A] hover:border-[#FF7A1A] transition-colors duration-500 ease-out">
            <div className="pointer-events-none absolute top-14 right-6 opacity-70 transition-colors duration-500 ease-out group-hover:text-black">
              <svg
                className="h-16 w-16 text-white/70 transition-colors duration-500 ease-out group-hover:text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="22" cy="22" r="12" />
                <line x1="31" y1="31" x2="42" y2="42" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 transition-colors duration-500 ease-out group-hover:text-black">
              Diagnostics
            </h3>
            <div className="h-px w-full bg-white/10 mb-4 transition-colors duration-500 ease-out group-hover:bg-black/20" />
            <p className="text-gray-400 leading-relaxed transition-colors duration-500 ease-out group-hover:text-black/80">
              We deploy AI agents that scan your organization, run interviews, analyze the org chart and key metrics to come up with high-ROI initiatives.
            </p>
          </div>

          <div className="group relative border border-white/10 rounded-2xl p-8 pr-24 bg-white/[0.02] hover:bg-[#FF7A1A] hover:border-[#FF7A1A] transition-colors duration-500 ease-out">
            <div className="pointer-events-none absolute top-14 right-6 opacity-70 transition-colors duration-500 ease-out group-hover:text-black">
              <svg
                className="h-16 w-16 text-white/70 transition-colors duration-500 ease-out group-hover:text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 41L27 21" />
                <path d="M20 14l7-7 12 12-7 7z" />
                <path d="M13 33l-6 8 9-4" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 transition-colors duration-500 ease-out group-hover:text-black">
              Transformation
            </h3>
            <div className="h-px w-full bg-white/10 mb-4 transition-colors duration-500 ease-out group-hover:bg-black/20" />
            <p className="text-gray-400 leading-relaxed transition-colors duration-500 ease-out group-hover:text-black/80">
              We build the context graph and deploy CAIO agent that accelerates the team and drives the transformation across all functions.
            </p>
          </div>

          <div className="group relative border border-white/10 rounded-2xl p-8 pr-24 bg-white/[0.02] hover:bg-[#FF7A1A] hover:border-[#FF7A1A] transition-colors duration-500 ease-out">
            <div className="pointer-events-none absolute top-14 right-6 opacity-70 transition-colors duration-500 ease-out group-hover:text-black">
              <svg
                className="h-16 w-16 text-white/70 transition-colors duration-500 ease-out group-hover:text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="8" y="8" width="12" height="12" />
                <rect x="28" y="8" width="12" height="12" />
                <rect x="8" y="28" width="12" height="12" />
                <rect x="28" y="28" width="12" height="12" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 transition-colors duration-500 ease-out group-hover:text-black">
              Codos OS access
            </h3>
            <div className="h-px w-full bg-white/10 mb-4 transition-colors duration-500 ease-out group-hover:bg-black/20" />
            <p className="text-gray-400 leading-relaxed transition-colors duration-500 ease-out group-hover:text-black/80">
              Subscription-style support and access to the latest tooling
              developed by Codos, including an AI OS for founders.
            </p>
            <button
              type="button"
              onClick={() => setShowPlatformDetails((prev) => !prev)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition-colors duration-500 ease-out hover:text-white hover:border-white/30 group-hover:text-black group-hover:border-black/30"
              aria-expanded={showPlatformDetails}
            >
              {showPlatformDetails ? 'Hide details' : 'Learn more'}
            </button>
          </div>

          {showPlatformDetails && (
            <div className="space-y-12">
              <VideoDemo variant="embedded" />
              <Architecture variant="embedded" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Approach;
