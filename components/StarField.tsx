import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseA: number;
  twkAmp: number;
  twkFreq: number;
  phase: number;
  cr: number;
  cg: number;
  cb: number;
  speed: number;
}

const StarField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

    const starColor = (t: number): [number, number, number] => {
      // Subtle blue tint ("blue dots")
      const cool = [200, 220, 255]; 
      const neutral = [255, 255, 255];
      const warm = [255, 250, 240];

      const lerp = (x: number, y: number, k: number) => x + (y - x) * k;

      if (t < 0) {
        const k = -t;
        return [
          lerp(neutral[0], cool[0], k),
          lerp(neutral[1], cool[1], k),
          lerp(neutral[2], cool[2], k),
        ];
      }

      const k = t;
      return [
        lerp(neutral[0], warm[0], k),
        lerp(neutral[1], warm[1], k),
        lerp(neutral[2], warm[2], k),
      ];
    };

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];

    const buildStars = () => {
      stars = [];
      const area = w * h;
      const totalStars = Math.floor(area * 0.00035);
      
      // 90% of stars: Background layer
      const slowCount = Math.floor(totalStars * 0.90);
      
      // 10% of stars: Foreground layer (closer)
      const fastCount = totalStars - slowCount;

      // Slow Stars (Background - 90%)
      for (let i = 0; i < slowCount; i += 1) {
        const r = rand(0.5, 1.2);
        const tint = rand(-0.2, 0.2);
        const [cr, cg, cb] = starColor(tint);
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          r,
          baseA: rand(0.1, 0.4),
          twkAmp: rand(0.05, 0.15),
          twkFreq: rand(0.005, 0.02),
          phase: rand(0, Math.PI * 2),
          cr,
          cg,
          cb,
          speed: rand(0.05, 0.3) // Extremely slow drift
        });
      }

      // Fast Stars (Foreground - 10%)
      for (let i = 0; i < fastCount; i += 1) {
        const r = rand(1.0, 1.6);
        const tint = rand(-0.2, 0.2);
        const [cr, cg, cb] = starColor(tint);
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          r,
          baseA: rand(0.4, 0.8),
          twkAmp: rand(0.1, 0.3),
          twkFreq: rand(0.02, 0.06),
          phase: rand(0, Math.PI * 2),
          cr,
          cg,
          cb,
          speed: rand(0.4, 0.8) // Significantly slowed down from previous (1.5-3.0)
        });
      }
    };

    const resize = () => {
      w = Math.floor(container.clientWidth);
      h = Math.floor(container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const drawLuminosityBand = () => {
      const bandGrad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.7
      );
      bandGrad.addColorStop(0, 'rgba(20, 20, 30, 0.0)'); 
      bandGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, 0, w, h);
    };

    let lastFrameTime: number | null = null;
    
    const frame = (now: number) => {
      animationRef.current = requestAnimationFrame(frame);
      
      if (lastFrameTime === null) {
          lastFrameTime = now;
          return;
      }

      const delta = now - lastFrameTime;
      const cappedDelta = Math.min(delta, 100);
      const dt = cappedDelta / 1000;

      lastFrameTime = now;

      ctx.clearRect(0, 0, w, h);

      drawLuminosityBand();

      for (const s of stars) {
        // Move star
        s.y -= s.speed * dt;
        
        // Wrap around
        if (s.y < -5) {
            s.y = h + 5;
            s.x = rand(0, w);
        }

        const tw = prefersReducedMotion ? 0 : Math.sin(now * 0.001 * s.twkFreq + s.phase);
        const a = clamp(s.baseA + s.twkAmp * (0.5 + 0.5 * tw), 0, 1);

        ctx.fillStyle = `rgba(${s.cr | 0},${s.cg | 0},${s.cb | 0},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    animationRef.current = requestAnimationFrame(frame);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-black pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default StarField;