import { useCallback, useEffect, useState } from 'react';
import { useScreencastRecorder } from '../../hooks/useScreencastRecorder';
import { useWebcamRecorder } from '../../hooks/useWebcamRecorder';

export type UseMediaRecorderDemoArgs = {
  readonly recordingDurationMs: number;
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useMediaRecorderDemo = (args: UseMediaRecorderDemoArgs) => {
  const {
    recordingDurationMs,
    onRecordingStarted,
    onRecordedDataReceived,
    onRecordingStopped
  } = args;

  const urlParams =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search);

  const useRecorder =
    urlParams && urlParams.get('screencast')
      ? useScreencastRecorder
      : useWebcamRecorder;

  const {
    videoRef,
    isStreamInitialized,
    isRecording,
    onRequestPermissions,
    onStartRecording,
    onStopRecording
  } = useRecorder({
    onRecordingStarted,
    onRecordingStopped,
    onRecordedDataReceived
  });

  const onMaybeStartRecording = useCallback(async () => {
    if (!isStreamInitialized) {
      const stream = await onRequestPermissions();
      if (stream !== null) {
        onStartRecording(stream);
      }
      return;
    }
    onStartRecording();
  }, [isStreamInitialized, onRequestPermissions, onStartRecording]);

  const [recordingTimeLeftMs, setRecordingTimeLeftMs] =
    useState(recordingDurationMs);

  // Ask for permissions on mount
  useEffect(() => {
    onRequestPermissions();
  }, [onRequestPermissions]);

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
  }, [isRecording, recordingDurationMs]);

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
    onStartRecording: onMaybeStartRecording
  };
};
