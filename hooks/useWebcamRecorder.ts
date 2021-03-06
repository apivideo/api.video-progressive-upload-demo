import { useCallback, useRef, useState } from 'react';
import { useMediaStreamRecorder } from './useMediaStreamRecorder';
import { useWebcamMediaStream } from './useWebcamMediaStream';

type UseWebcamRecorderArgs = {
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useWebcamRecorder = (args: UseWebcamRecorderArgs) => {
  const { onRecordingStarted, onRecordingStopped, onRecordedDataReceived } =
    args;

  const { onRequestWebcamStreamPermission } = useWebcamMediaStream();
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { isRecording, onStartRecording, onStopRecording } =
    useMediaStreamRecorder({
      stream: webcamStream,
      onRecordingStarted,
      onRecordedDataReceived,
      onRecordingStopped
    });

  const onRequestPermissions = useCallback(async () => {
    try {
      // Ask for user permission to use webcam media stream
      const stream = await onRequestWebcamStreamPermission();

      if (stream === undefined) {
        throw new Error('useWebcamRecorder: Failed request stream permission');
        return;
      }

      setWebcamStream(stream);

      // Set webcam stream to the given video element
      if (videoRef.current !== null) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('onRequestPermissions error', error);
      setWebcamStream(null);
      videoRef.current = null;
    }
    return null;
  }, [onRequestWebcamStreamPermission]);

  return {
    onRequestPermissions,
    onStartRecording,
    onStopRecording,
    videoRef,
    isStreamInitialized: webcamStream !== null,
    isRecording
  };
};
