import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Countdown/countup timer hook
 * @param {number} initialSeconds  - 0 for countup, positive for countdown
 * @param {function} onExpire      - called when countdown hits 0
 */
export const useTimer = (initialSeconds = 0, onExpire) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);
  const isCountdown = initialSeconds > 0;

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (isCountdown) {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            onExpire?.();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);
  }, [isCountdown, onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(initialSeconds);
  }, [stop, initialSeconds]);

  useEffect(() => () => stop(), [stop]);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const isWarning = isCountdown && seconds <= 300 && seconds > 60;
  const isDanger = isCountdown && seconds <= 60;

  return { seconds, formatted: format(seconds), start, stop, reset, isWarning, isDanger };
};
