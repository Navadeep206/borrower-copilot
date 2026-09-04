/**
 * ShinyText - React Bits style dynamic metallic sheen text effect
 * Creates a sweeping gold / chrome light glint across text.
 * Fits the Dark Knight / Wayne Enterprises luxury armored aesthetic.
 * Inspired by reactbits.dev/text-animations/shiny-text.
 */
import React from 'react';

export default function ShinyText({
  children,
  disabled = false,
  speed = 3,
  className = '',
  color = '#F5C518',
  shineColor = '#FFFFFF',
  style = {},
  ...props
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${className}`}
      style={{
        display: 'inline-block',
        background: disabled
          ? color
          : `linear-gradient(110deg, ${color} 30%, ${shineColor} 50%, ${color} 70%)`,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: disabled ? 'none' : `shineSweep ${animationDuration} linear infinite`,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
