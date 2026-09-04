/**
 * Aurora - React Bits style animated aurora / mesh gradient background.
 * Creates flowing, layered radial gradient orbs that animate smoothly.
 * Inspired by reactbits.dev/backgrounds/aurora.
 * No external dependencies — pure CSS keyframe + React.
 */
import { useEffect, useRef } from 'react';

const AURORA_STYLES = `
@keyframes aurora-move-1 {
  0%   { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
  33%  { transform: translate(5%, -8%) scale(1.08); opacity: 0.8; }
  66%  { transform: translate(-4%, 6%) scale(0.95); opacity: 0.55; }
  100% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
}
@keyframes aurora-move-2 {
  0%   { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.5; }
  50%  { transform: translate(-6%, 10%) scale(1.12) rotate(8deg); opacity: 0.7; }
  100% { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.5; }
}
@keyframes aurora-move-3 {
  0%   { transform: translate(0%, 0%) scale(1); opacity: 0.4; }
  40%  { transform: translate(8%, 5%) scale(1.06); opacity: 0.65; }
  80%  { transform: translate(-3%, -7%) scale(0.98); opacity: 0.45; }
  100% { transform: translate(0%, 0%) scale(1); opacity: 0.4; }
}
@keyframes aurora-move-4 {
  0%   { transform: translate(0%, 0%) scale(1.1) rotate(0deg); opacity: 0.35; }
  60%  { transform: translate(-5%, -5%) scale(0.9) rotate(-6deg); opacity: 0.55; }
  100% { transform: translate(0%, 0%) scale(1.1) rotate(0deg); opacity: 0.35; }
}
`;

export default function Aurora({
  colorStops = ['#0284C7', '#7C3AED', '#38BDF8'],
  blend = 'screen',
  amplitude = 1.0,
  speed = 1.0,
  children,
  style = {}
}) {
  // Inject keyframes once
  useEffect(() => {
    const styleId = 'aurora-keyframes';
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style');
      el.id = styleId;
      el.textContent = AURORA_STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const [c1, c2, c3] = colorStops;

  const orbs = [
    {
      gradient: `radial-gradient(ellipse 70% 60% at 30% 40%, ${c1}CC 0%, transparent 70%)`,
      animation: `aurora-move-1 ${12 / speed}s ease-in-out infinite`,
      top: '-10%', left: '-10%', width: '70%', height: '70%',
    },
    {
      gradient: `radial-gradient(ellipse 60% 70% at 70% 60%, ${c2}AA 0%, transparent 65%)`,
      animation: `aurora-move-2 ${16 / speed}s ease-in-out infinite`,
      top: '10%', right: '-15%', width: '65%', height: '75%',
    },
    {
      gradient: `radial-gradient(ellipse 80% 50% at 50% 20%, ${c3}88 0%, transparent 70%)`,
      animation: `aurora-move-3 ${10 / speed}s ease-in-out infinite`,
      bottom: '-20%', left: '20%', width: '80%', height: '60%',
    },
    {
      gradient: `radial-gradient(ellipse 55% 55% at 20% 80%, ${c1}66 0%, transparent 65%)`,
      animation: `aurora-move-4 ${14 / speed}s ease-in-out infinite 2s`,
      bottom: '-5%', left: '-5%', width: '55%', height: '55%',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* Aurora orbs layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              background: orb.gradient,
              width: orb.width,
              height: orb.height,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              bottom: orb.bottom,
              animation: orb.animation,
              mixBlendMode: blend,
              filter: `blur(${40 * amplitude}px)`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
      {/* Content above aurora */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
