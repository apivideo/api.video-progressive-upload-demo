import { useEffect, useState } from 'react';
import { useScreencastRecorder } from '../../hooks/useScreencastRecorder';
// import { useWebcamRecorder } from '../../hooks/useWebcamRecorder';

/**
 * We need a file size big enough to be able to compare the speed of
 * each upload strategy in this demo.
 * Thus, we force the webcam recording to a fixed duration.
 */
const recordingDurationMs = 60 * 1000; // 60 seconds

export type UseMediaRecorderDemoArgs = {
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useMediaRecorderDemo = (args: UseMediaRecorderDemoArgs) => {
  const { onRecordingStarted, onRecordedDataReceived, onRecordingStopped } =
    args;

  const {
    videoRef,
    isStreamInitialized,
    isRecording,
    onRequestPermissions,
    onStartRecording,
    onStopRecording
  } = useScreencastRecorder({
    onRecordingStarted,
    onRecordingStopped,
    onRecordedDataReceived
  });

  const [recordingTimeLeftMs, setRecordingTimeLeftMs] =
    useState(recordingDurationMs);

  // Start the countdown when recording starts
  useEffect(() => {
    if (!isRecording) {
      return;
    }
    setRecordingTimeLeftMs(recordingDurationMs);
    const intervalId = window.setInterval(() => {
      setRecordingTimeLeftMs((prev) => prev - 1000);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  // Stop recording when the countdown reaches 0
  useEffect(() => {
    if (recordingTimeLeftMs > 0) {
      return;
    }
    onStopRecording();
  }, [onStopRecording, recordingTimeLeftMs]);

  return {
    videoRef,
    isStreamInitialized,
    isRecording,
    recordingTimeLeftMs,
    onRequestPermissions,
    onStartRecording
  };
};
