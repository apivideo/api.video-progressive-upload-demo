import { useCallback, useEffect, useRef, useState } from 'react';
import { getPreferredVideoMimeType } from './getPreferredVideoMimeType';

type UseWebcamRecorderArgs = {
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useWebcamRecorder = (args: UseWebcamRecorderArgs) => {
  const { onRecordingStarted, onRecordingStopped, onRecordedDataReceived } =
    args;

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [supportedMimeType, setSupportedMimeType] =
    useState<ReturnType<typeof getPreferredVideoMimeType>>();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    const supportedMimeType = getPreferredVideoMimeType();
    console.log(`Detect supported video mime type`, supportedMimeType);
    setSupportedMimeType(supportedMimeType);
  }, []);

  const onStartCamera = useCallback(async () => {
    try {
      // Ask for user permission to use webcam media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setCameraStream(stream);

      // Set webcam stream to the given video element
      if (videoRef.current !== null) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setCameraStream(null);
      videoRef.current = null;
    }
  }, []);

  const onStartRecording = useCallback(() => {
    if (cameraStream === null) {
      return;
    }

    const recorder = new MediaRecorder(cameraStream, {
      mimeType: supportedMimeType?.name
    });

    if (onRecordingStarted !== undefined) {
      recorder.addEventListener('start', onRecordingStarted);
    }

    if (onRecordedDataReceived !== undefined) {
      recorder.addEventListener('dataavailable', (event) => {
        const isLastData = isStoppingRef.current;
        onRecordedDataReceived(event.data, isLastData);
      });
    }

    if (onRecordingStopped !== undefined) {
      recorder.addEventListener('stop', onRecordingStopped);
    }

    recorder.start(1000); // Start recording 1 second of video into each Blob

    isStoppingRef.current = false;
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }, [
    cameraStream,
    onRecordedDataReceived,
    onRecordingStarted,
    onRecordingStopped,
    supportedMimeType?.name
  ]);

  const onStopRecording = useCallback(() => {
    if (mediaRecorderRef.current !== null) {
      isStoppingRef.current = true;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return {
    onStartCamera,
    onStartRecording,
    onStopRecording,
    videoRef,
    isCameraStreamInitialized: cameraStream !== null,
    isRecording
  };
};
