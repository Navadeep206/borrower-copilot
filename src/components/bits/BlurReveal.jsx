/**
 * BlurReveal - React Bits style blur-to-focus text/content reveal animation.
 * Content enters from blurred + scaled-down state to clear on mount/trigger.
 * Inspired by reactbits.dev/text-animations/blur-text.
 * No external dependencies — pure CSS transitions.
 */
import { useState, useEffect, useRef } from 'react';

export default function BlurReveal({
  children,
  delay = 0,
  duration = 600,
  blur = 12,
  translateY = 8,
  once = true,
  className = '',
  style = {}
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : `blur(${blur}px)`,
        transform: visible ? 'translateY(0px)' : `translateY(${translateY}px)`,
        willChange: 'opacity, filter, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}
