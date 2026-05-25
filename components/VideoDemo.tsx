import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoDemoProps {
  variant?: 'default' | 'embedded';
}

const VideoDemo: React.FC<VideoDemoProps> = ({ variant = 'default' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const sectionClassName =
    variant === 'embedded'
      ? 'relative z-10 py-12'
      : 'relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden';

  return (
    <section ref={containerRef} className={sectionClassName}>
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center mb-12 relative z-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          See Codos OS in Action
        </h2>
      </div>

      <div className="max-w-5xl mx-auto relative z-20">
        <div
          className="relative aspect-video bg-[#0A0A0C] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.15)] group cursor-pointer"
          onClick={togglePlay}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src="/CodosVideo.mp4"
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            controls
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play/Pause Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="relative group/play">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20 shadow-2xl">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-2 fill-white" />
                    )}
                </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={toggleMute}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;
