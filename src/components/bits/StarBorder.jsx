/**
 * StarBorder - React Bits style moving glowing border light tracer
 * Cycles an animated gold luminous beam around the border perimeter.
 * Inspired by reactbits.dev/animations/star-border.
 */
import React from 'react';

export default function StarBorder({
  as: Component = 'div',
  className = '',
  color = '#F5C518',
  speed = '4s',
  children,
  style = {},
  ...props
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        position: 'relative',
        borderRadius: 'inherit',
        overflow: 'hidden',
        padding: '1px',
        ...style,
      }}
      {...props}
    >
      <div
        className="star-border-beam"
        style={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          opacity: 0.8,
          bottom: '-11px',
          right: '-250%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 10%, transparent 60%)`,
          animation: `star-border-sweep ${speed} linear infinite alternate`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        className="star-border-beam-top"
        style={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          opacity: 0.8,
          top: '-10px',
          left: '-250%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 10%, transparent 60%)`,
          animation: `star-border-sweep ${speed} linear infinite alternate reverse`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          borderRadius: 'inherit',
          zIndex: 2,
          height: '100%',
        }}
      >
        {children}
      </div>
    </Component>
  );
}
