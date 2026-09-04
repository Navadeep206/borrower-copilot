/**
 * Squares - React Bits style interactive tactical grid background
 * Interactive canvas grid with hover lighting and ambient Batcave tactical console pulses.
 * Inspired by reactbits.dev/backgrounds/squares.
 */
import { useRef, useEffect } from 'react';

export default function Squares({
  direction = 'right',
  speed = 0.5,
  borderColor = 'rgba(255, 255, 255, 0.05)',
  squareSize = 40,
  hoverFillColor = 'rgba(245, 197, 24, 0.12)',
  activeSquareColor = 'rgba(245, 197, 24, 0.22)',
  style = {},
  className = '',
}) {
  const canvasRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      // Draw hover square
      if (hoveredSquare.current) {
        ctx.fillStyle = hoverFillColor;
        ctx.fillRect(
          hoveredSquare.current.x + (gridOffset.current.x % squareSize),
          hoveredSquare.current.y + (gridOffset.current.y % squareSize),
          squareSize,
          squareSize
        );
        // Golden outline on hovered square
        ctx.strokeStyle = activeSquareColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          hoveredSquare.current.x + (gridOffset.current.x % squareSize),
          hoveredSquare.current.y + (gridOffset.current.y % squareSize),
          squareSize,
          squareSize
        );
      }

      // Draw grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = borderColor;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x - (gridOffset.current.x % squareSize), 0);
        ctx.lineTo(x - (gridOffset.current.x % squareSize), canvas.height);
        ctx.stroke();
      }

      for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y - (gridOffset.current.y % squareSize));
        ctx.lineTo(canvas.width, y - (gridOffset.current.y % squareSize));
        ctx.stroke();
      }

      // Slow drift
      if (direction === 'right') gridOffset.current.x = (gridOffset.current.x + speed) % squareSize;
      if (direction === 'left') gridOffset.current.x = (gridOffset.current.x - speed) % squareSize;
      if (direction === 'down') gridOffset.current.y = (gridOffset.current.y + speed) % squareSize;
      if (direction === 'up') gridOffset.current.y = (gridOffset.current.y - speed) % squareSize;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
        hoveredSquare.current = null;
        return;
      }

      const hoveredGridX = Math.floor((mouseX - (gridOffset.current.x % squareSize)) / squareSize) * squareSize;
      const hoveredGridY = Math.floor((mouseY - (gridOffset.current.y % squareSize)) / squareSize) * squareSize;

      hoveredSquare.current = { x: hoveredGridX, y: hoveredGridY };
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, borderColor, hoverFillColor, activeSquareColor, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`squares-canvas ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
