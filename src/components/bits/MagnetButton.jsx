/**
 * MagnetButton - React Bits style magnetic hover effect on buttons.
 * The button follows the cursor with a smooth spring-like attraction.
 * Inspired by reactbits.dev/animations/magnet.
 * No external dependencies.
 */
import { useRef, useState } from 'react';

export default function MagnetButton({
  children,
  strength = 0.35,
  radius = 100,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12);

    setOffset({ x: currentRef.current.x, y: currentRef.current.y });

    const dx = Math.abs(currentRef.current.x - targetRef.current.x);
    const dy = Math.abs(currentRef.current.y - targetRef.current.y);

    if (dx > 0.05 || dy > 0.05) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      animRef.current = null;
    }
  }

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      targetRef.current = {
        x: dx * strength,
        y: dy * strength
      };

      if (!animRef.current) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
  }

  function handleMouseLeave() {
    setIsHovering(false);
    targetRef.current = { x: 0, y: 0 };
    if (!animRef.current) {
      animRef.current = requestAnimationFrame(animate);
    }
  }

  function handleMouseEnter() {
    setIsHovering(true);
  }

  return (
    <div
      ref={ref}
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button
        className={className}
        onClick={onClick}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: isHovering ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          ...style
        }}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
