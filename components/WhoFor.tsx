import React from 'react';

const WhoFor: React.FC = () => {
  const audiences = [
    {
      title: 'Mid-sized Teams (50-1000)',
      desc: 'Big enough to start slowing down. Small enough to become AI-native fast.',
      icon: '🏢',
    },
    {
      title: 'Founders',
      desc: 'You know AI matters. We know how your team can get 10x leverage with it.',
      icon: '👤',
    },
    {
      title: 'Human-heavy Businesses',
      desc: 'Your business runs on people. Most of their time is spent on work AI can do.',
      icon: '⚙️',
    },
  ];

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Who is it for?</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Built for builders who want leverage, not another tool to manage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {audiences.map((item) => (
          <div
            key={item.title}
            className="group bg-white/5 border border-white/10 p-8 rounded-2xl transition-colors duration-500 ease-out hover:bg-[#FF7A1A] hover:border-[#FF7A1A]"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 transition-colors duration-500 ease-out group-hover:bg-black/10 group-hover:border-black/20">
              <span className="text-2xl transition-colors duration-500 ease-out group-hover:text-black">{item.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-500 ease-out group-hover:text-black">
              {item.title}
            </h3>
            <p className="text-gray-400 transition-colors duration-500 ease-out group-hover:text-black/80">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoFor;
