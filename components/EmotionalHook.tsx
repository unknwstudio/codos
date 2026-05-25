import React, { useEffect, useRef, useState } from 'react';

const EmotionalHook: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            // Sequence of reveals
            const t1 = setTimeout(() => setVisibleLines(1), 200);
            const t2 = setTimeout(() => setVisibleLines(2), 1200);
            const t3 = setTimeout(() => setVisibleLines(3), 2200);

            return () => {
              clearTimeout(t1);
              clearTimeout(t2);
              clearTimeout(t3);
            };
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center bg-black px-4 sm:px-6 py-24">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <h2 className={`text-2xl md:text-5xl font-light text-gray-500 tracking-tight transition-all duration-1000 ease-out transform ${visibleLines >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Feeling FOMO about AI?
        </h2>

        <h2 className={`text-2xl md:text-4xl font-light text-white tracking-tight transition-all duration-1000 ease-out transform ${visibleLines >= 2 ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-sm'}`}>
          Thinking team should move faster?
        </h2>

        <div className={`transition-all duration-1000 ease-out transform ${visibleLines >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 tracking-tight">
            Time to accelerate
          </h2>
        </div>
      </div>
    </section>
  );
};

export default EmotionalHook;
