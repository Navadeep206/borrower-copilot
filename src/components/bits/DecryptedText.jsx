/**
 * DecryptedText - React Bits style Batcomputer / Wayne Tech cipher decryption animation
 * Letters scramble through cryptographic symbols before resolving to clear text.
 * Inspired by reactbits.dev/text-animations/decrypted-text.
 */
import { useEffect, useState, useRef } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 12,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'mount', // 'mount' | 'hover' | 'both'
  revealDirection = 'start', // 'start' | 'end' | 'center'
  sequential = true,
  useOriginalCharsOnly = false,
  style = {},
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);

  const getAvailableChars = () => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split('').filter((c) => c !== ' ')));
    }
    return characters.split('');
  };

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    iterationRef.current = 0;
    setIsScrambling(true);

    const availableChars = getAvailableChars();
    const length = text.length;

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1;
      const progress = iterationRef.current;

      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            let isResolved = false;
            if (sequential) {
              const charThreshold = (index / length) * maxIterations;
              isResolved = progress >= charThreshold + 3;
            } else {
              isResolved = progress >= maxIterations;
            }

            if (isResolved) {
              return char;
            }

            const randChar =
              availableChars[Math.floor(Math.random() * availableChars.length)] || '#';
            return randChar;
          })
          .join('');
      });

      if (iterationRef.current >= maxIterations + (sequential ? 6 : 0)) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  // Trigger on mount or when text changes
  useEffect(() => {
    if (animateOn === 'mount' || animateOn === 'both') {
      startScramble();
    } else {
      setDisplayText(text);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if ((animateOn === 'hover' || animateOn === 'both') && !isScrambling) {
      startScramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      className={parentClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', cursor: animateOn !== 'mount' ? 'pointer' : 'default', ...style }}
      {...props}
    >
      <span className={isScrambling ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
}
