import React from 'react';

type NavbarProps = {
  onCtaClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onCtaClick }) => {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 backdrop-blur-md bg-black/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-8 h-8 bg-black rounded-lg border border-orange-500/60 flex items-center justify-center">
              <span className="text-orange-500 font-mono text-sm font-bold">{'>_'}</span>
            </div>
            <span className="text-xl font-medium tracking-tight text-white">Codos</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#approach" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Solution</a>
              <a href="#founder" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Team</a>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={onCtaClick}
              className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Talk to founders
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;