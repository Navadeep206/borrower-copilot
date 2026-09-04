/**
 * SpotlightCard - React Bits style mouse-tracking radial spotlight card
 * Creates an illumination effect that follows the cursor over dark surfaces.
 * Highly iconic for the Batman / Dark Knight theme (Bat-Signal spotlight illumination).
 * Inspired by reactbits.dev/components/spotlight-card.
 */
import { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(245, 197, 24, 0.14)',
  borderColor = 'rgba(245, 197, 24, 0.35)',
  size = 320,
  style = {},
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {/* Spotlight glow layer */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity,
          transition: 'opacity 0.3s ease-out',
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      {/* Highlighted border outline that illuminates near cursor */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          opacity,
          transition: 'opacity 0.3s ease-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          background: `radial-gradient(${size * 0.8}px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 75%)`,
          zIndex: 2,
        }}
      />
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 3, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
