/**
 * CountUp - React Bits style animated number counter
 * Counts from 0 (or previous value) to target value with easing animation.
 * Uses requestAnimationFrame for smooth, performant animation.
 * No external dependencies.
 */
import { useState, useEffect, useRef } from 'react';

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function CountUp({
  to,
  from = 0,
  duration = 1200,
  delay = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  decimals = 0,
  className = '',
  style = {},
  onComplete
}) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const prevToRef = useRef(from);

  useEffect(() => {
    const startFrom = prevToRef.current;
    const target = Number(to) || 0;

    let delayTimer;
    if (delay > 0) {
      delayTimer = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    function startAnimation() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;

      rafRef.current = requestAnimationFrame(function tick(timestamp) {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = startFrom + (target - startFrom) * easedProgress;
        setValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setValue(target);
          prevToRef.current = target;
          onComplete?.();
        }
      });
    }

    return () => {
      clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration, delay]);

  const formatted = formatNumber(value, decimals, separator);

  return (
    <span className={className} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

function formatNumber(value, decimals, separator) {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const [intPart, decPart] = fixed.split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return decPart !== undefined ? `${withSep}.${decPart}` : withSep;
}
