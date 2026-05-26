import React from 'react';
import { Download } from 'lucide-react';

const DownloadPage: React.FC = () => {
  return (
    <main className="theme-dark min-h-screen bg-bg text-text px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-caption font-body uppercase tracking-[0.25em] text-accent mb-4">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Codos OS
          </div>
          <h1 className="text-h1 font-bold tracking-tight mb-6">
            Download Codos OS
          </h1>
          <p className="text-body-lg text-muted max-w-2xl leading-relaxed">
            Install the desktop app and run Codos locally with your team setup.
          </p>
        </div>

        <div className="border border-border rounded-2xl bg-surface p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-text font-semibold text-xl">macOS (.dmg)</p>
              <p className="text-muted mt-2">
                Recommended for Apple Silicon and Intel Mac devices.
              </p>
            </div>
            <a
              href="/Codos_1.1.5_arm64-notarized.dmg"
              download
              className="inline-flex items-center justify-center gap-2 bg-text text-bg px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download .dmg
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DownloadPage;
