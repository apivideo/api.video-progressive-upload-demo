import { useCallback, useEffect, useState } from 'react';

export const useStopWatch = () => {
  const [durationMs, setDurationMs] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const start = useCallback((withReset?: boolean) => {
    if (withReset) {
      setDurationMs(0);
    }
    setIsStarted(true);
  }, []);

  const stop = useCallback(() => setIsStarted(false), []);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isStarted) {
      intervalId = window.setInterval(() => {
        setDurationMs((prev) => prev + 50);
      }, 50);
    } else {
      window.clearInterval(intervalId);
    }
    return () => window.clearInterval(intervalId);
  }, [isStarted]);

  return {
    durationMs,
    start,
    stop
  };
};
