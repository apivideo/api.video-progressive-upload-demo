import { useCallback, useEffect, useRef, useState } from 'react';

export const useStopWatch = () => {
  const [durationMs, setDurationMs] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // We also expose a ref just in case the consumer needs the value without any re-render
  const durationMsRef = useRef(0);

  const start = useCallback((withReset?: boolean) => {
    if (withReset) {
      setDurationMs(0);
      durationMsRef.current = 0;
    }
    setIsStarted(true);
  }, []);

  const stop = useCallback(() => setIsStarted(false), []);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isStarted) {
      intervalId = window.setInterval(() => {
        setDurationMs((prev) => {
          const newDurationMs = prev + 10;
          durationMsRef.current = newDurationMs;
          return newDurationMs;
        });
      }, 10);
    } else {
      window.clearInterval(intervalId);
    }
    return () => window.clearInterval(intervalId);
  }, [isStarted]);

  return {
    durationMs,
    durationMsRef,
    start,
    stop
  };
};
