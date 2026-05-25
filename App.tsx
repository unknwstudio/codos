import React, { useEffect, useState } from 'react';
import EditorialLanding from './components/EditorialLanding';
import DownloadPage from './components/DownloadPage';
import QuizPage from './components/QuizPage';
import EngQuizPage from './components/EngQuizPage';
import ReportPage from './components/ReportPage';
import CTAFormModal from './components/CTAFormModal';

const App: React.FC = () => {
  const [isCtaOpen, setIsCtaOpen] = useState(false);
  const isDownloadPage = /^\/download\/?$/.test(window.location.pathname);
  const isQuizPage = /^\/quiz\/?$/.test(window.location.pathname);
  const isEngQuizPage = /^\/eng-quiz\/?$/.test(window.location.pathname);
  const isReportPage = /^\/report\/.+/.test(window.location.pathname);

  useEffect(() => {
    const checkUrlState = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const hasHash = hash === '#book-demo';
      const hasQuery =
        params.get('demo') === '1' ||
        params.get('book-demo') === '1' ||
        params.has('demo') ||
        params.has('book-demo');
      setIsCtaOpen(hasHash || hasQuery);
    };

    const timer = setTimeout(checkUrlState, 100);
    window.addEventListener('hashchange', checkUrlState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', checkUrlState);
    };
  }, []);

  const handleOpenCta = () => {
    setIsCtaOpen(true);
    window.location.hash = '#book-demo';
  };

  const handleCloseCta = () => {
    setIsCtaOpen(false);
    const url = new URL(window.location.href);
    if (url.hash === '#book-demo') url.hash = '';
    url.searchParams.delete('demo');
    url.searchParams.delete('book-demo');
    window.history.replaceState(null, '', url.toString());
  };

  if (isDownloadPage) return <DownloadPage />;
  if (isQuizPage) return <QuizPage />;
  if (isEngQuizPage) return <EngQuizPage />;
  if (isReportPage) return <ReportPage />;

  return (
    <>
      <EditorialLanding onCtaClick={handleOpenCta} />
      <CTAFormModal isOpen={isCtaOpen} onClose={handleCloseCta} />
    </>
  );
};

export default App;
