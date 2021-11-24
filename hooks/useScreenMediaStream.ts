import { useCallback } from 'react';

export const useScreenMediaStream = () => {
  const onRequestScreenStreamPermission = useCallback(async () => {
    // Ask for user permission to capture screen
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    return stream;
  }, []);

  return {
    onRequestScreenStreamPermission
  };
};
