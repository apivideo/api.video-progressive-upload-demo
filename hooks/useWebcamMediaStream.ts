import { useCallback } from 'react';

export const useWebcamMediaStream = () => {
  const onRequestWebcamStreamPermission = useCallback(async () => {
    // Ask for user permission to use webcam media stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    return stream;
  }, []);

  return { onRequestWebcamStreamPermission };
};
