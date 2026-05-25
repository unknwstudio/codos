import React from 'react';
import founderPhoto from '../dima profile pic.jpeg';
import glebPhoto from '../gleb2.png';
import logoMckinsey from '../misc/logos/image copy 3.png';
import logoMeta from '../meta4.png';
import logoCyberFund from '../misc/logos/image.png';
import logoEverclear from '../misc/logos/image copy 2.png';

const Founder: React.FC = () => {
  return (
    <section id="founder" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 bg-[#050507] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">The team</h2>
          <p className="text-lg text-gray-400 mt-4">McKinsey meets AI Lab and world-class privacy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'Dima Khanarin',
              title: 'Co-founder',
              photo: founderPhoto,
              alt: 'Dima Khanarin',
              lines: ['CEO, Everclear Foundation ($5BN volume, Pantera-backed)', 'Consultant, McKinsey']
            },
            {
              name: 'Gleb Sidora',
              title: 'Co-founder',
              photo: glebPhoto,
              alt: 'Gleb Sidora',
              lines: ['ML Engineer, Meta', 'Founding engineer, Condukt (Lightspeed-backed)'],
              initials: 'GS'
            }
          ].map((person) => (
            <div
              key={person.name}
              className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-full aspect-square rounded-2xl bg-gray-800 overflow-hidden relative mb-5">
                {person.photo ? (
                  <>
                    <img
                      src={person.photo}
                      alt={person.alt}
                      className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 text-white text-3xl font-semibold">
                    {person.initials}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {person.name === 'Dima Khanarin' ? (
                  <a
                    href="https://www.linkedin.com/in/dimakhanarin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-300 transition-colors border-b border-white/20 hover:border-orange-300"
                  >
                    {person.name}
                  </a>
                ) : person.name === 'Gleb Sidora' ? (
                  <a
                    href="https://www.linkedin.com/in/arodiss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-300 transition-colors border-b border-white/20 hover:border-orange-300"
                  >
                    {person.name}
                  </a>
                ) : (
                  person.name
                )}
              </h3>
              <p className="text-sm uppercase tracking-[0.25em] text-orange-400/80 mb-4">
                {person.title}
              </p>
              <div className="space-y-2">
                {person.lines.map((line) => (
                  <p key={line} className="text-gray-400">
                    {person.links?.[line] ? (
                      <a
                        href={person.links[line]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors border-b border-orange-400/50 hover:border-orange-300"
                      >
                        {line}
                      </a>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="h-12 w-40 flex items-center justify-center">
              <img src={logoMckinsey} alt="McKinsey & Company" className="h-10 w-auto object-contain invert" />
            </div>
            <div className="h-10 w-28 flex items-center justify-center bg-black rounded-md px-2">
              <img src={logoMeta} alt="Meta" className="h-7 w-auto object-contain" />
            </div>
            <div className="h-12 w-40 flex items-center justify-center">
              <img src={logoCyberFund} alt="cyber•Fund" className="h-10 w-auto object-contain invert" />
            </div>
            <a
              href="https://everclear.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-40 flex items-center justify-center"
            >
              <img src={logoEverclear} alt="Everclear" className="h-10 w-auto object-contain invert" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
