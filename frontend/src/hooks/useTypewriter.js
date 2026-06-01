import { useState, useEffect, useRef } from 'react';

/**
 * Animates text character by character, like a typing effect
 * @param {string} text   - The full string to type out
 * @param {number} speed  - Ms per character (default 30)
 */
export const useTypewriter = (text, speed = 30) => {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, isDone };
};
