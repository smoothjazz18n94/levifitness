import { useEffect, useRef } from 'react';

const COLORS = ['#39FF14', '#A855F7', '#F59E0B', '#3B82F6', '#EC4899', '#fff'];

export default function Confetti() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = [];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `-${10 + Math.random() * 20}px`;
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${6 + Math.random() * 8}px`;
      el.style.animationDuration = `${2 + Math.random() * 3}s`;
      el.style.animationDelay = `${Math.random() * 1.5}s`;
      el.style.opacity = '1';
      container.appendChild(el);
      pieces.push(el);
    }
    return () => pieces.forEach(p => p.remove());
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />;
}
