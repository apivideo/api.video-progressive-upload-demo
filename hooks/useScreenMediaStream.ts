import { useCallback } from 'react';

export const useScreenMediaStream = () => {
  const onRequestScreenStreamPermission = useCallback(async () => {
    try {
      // Ask for user permission to capture screen
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      return stream;
    } catch (error) {
      console.error('onRequestScreenStreamPermission error', error);
    }
  }, []);

  return {
    onRequestScreenStreamPermission
  };
};
