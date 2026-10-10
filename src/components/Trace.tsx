import { useEffect, useRef } from 'react';

const G = 2;              // pixel size, matches the rest of the page
const PX_PER_M = 3780;    // CSS pixels per metre (96 dpi)
const FADE = 3500;        // ms before a trail pixel is gone
const MAX = 1500;         // most trail pixels kept at once
const INK = '#2430E0';

export const sayWandered = (px: number) => {
  const m = px / PX_PER_M;
  return m < 0.5 ? 'Might as well say hi:' : `You’ve wandered ${m.toFixed(1)} m. Might as well say hi:`;
};

/**
 * A pixel trail behind the cursor that dissolves after a few seconds,
 * plus a running total of how far the visitor has moved (cursor on
 * desktop, scrolling on phones). The total is written into the element
 * with id `wanderId`. Hidden when the visitor prefers reduced motion;
 * the counter still works.
 */
const Trace: React.FC<{ wanderId: string }> = ({ wanderId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    // Test environments (jsdom) have no canvas or matchMedia; skip quietly.
    if (!c || typeof window.matchMedia !== 'function' || /jsdom/i.test(navigator.userAgent)) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(hover: none)');
    let pts: [number, number, number, number][] = [];
    let last: [number, number] | null = null;
    let dist = 0;
    let raf = 0;
    let lastY = window.scrollY;

    const say = () => {
      const out = document.getElementById(wanderId);
      if (out) out.textContent = sayWandered(dist);
    };
    const size = () => {
      const dpr = window.devicePixelRatio || 1;
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      last = null;
    };
    // Each pixel gets its own random cutoff, so the trail dissolves bit by bit.
    const add = (px: number, py: number, t: number) => {
      pts.push([Math.floor(px / G) * G, Math.floor(py / G) * G, t, Math.random()]);
      if (pts.length > MAX) pts.splice(0, pts.length - MAX);
    };
    const frame = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = INK;
      pts = pts.filter((p) => now - p[2] < FADE);
      pts.forEach((p) => {
        if ((now - p[2]) / FADE < p[3] * 0.7 + 0.3) ctx.fillRect(p[0], p[1], G, G);
      });
      raf = pts.length ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const px = e.clientX;
      const py = e.clientY;
      if (last) {
        const d = Math.hypot(px - last[0], py - last[1]);
        if (d <= 200) {
          if (!still.matches) {
            const t = performance.now();
            const n = Math.max(1, Math.ceil(d / G));
            for (let i = 1; i <= n; i++) add(last[0] + ((px - last[0]) * i) / n, last[1] + ((py - last[1]) * i) / n, t);
            if (!raf) raf = requestAnimationFrame(frame);
          }
          dist += d;
          say();
        }
      }
      last = [px, py];
    };
    const onScroll = () => {
      if (touch.matches) {
        dist += Math.abs(window.scrollY - lastY);
        say();
      }
      lastY = window.scrollY;
    };

    size();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', size);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', size);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wanderId]);

  return <canvas ref={canvasRef} className="ab-trace" aria-hidden="true" />;
};

export default Trace;
