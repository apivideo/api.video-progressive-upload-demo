import { useCallback, useEffect, useRef, useState } from 'react';
import { getPreferredVideoMimeType } from '../utils/getPreferredVideoMimeType';

type UseMediaStreamRecorderArgs = {
  readonly stream: MediaStream | null;
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useMediaStreamRecorder = (args: UseMediaStreamRecorderArgs) => {
  const {
    stream,
    onRecordingStarted,
    onRecordingStopped,
    onRecordedDataReceived
  } = args;

  const [supportedMimeType, setSupportedMimeType] =
    useState<ReturnType<typeof getPreferredVideoMimeType>>();

  useEffect(() => {
    const supportedMimeType = getPreferredVideoMimeType();
    console.log(`Detect supported video mime type`, supportedMimeType);
    setSupportedMimeType(supportedMimeType);
  }, []);

  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isStoppingRef = useRef(false);

  const onStartRecording = useCallback(
    (forceStream?: MediaStream) => {
      const recordStream = stream || forceStream;

      if (!recordStream) {
        return;
      }

      const recorder = new MediaRecorder(recordStream, {
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
    },
    [
      onRecordedDataReceived,
      onRecordingStarted,
      onRecordingStopped,
      stream,
      supportedMimeType?.name
    ]
  );

  const onStopRecording = useCallback(() => {
    if (mediaRecorderRef.current !== null) {
      isStoppingRef.current = true;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return {
    onStartRecording,
    onStopRecording,
    isRecording
  };
};
