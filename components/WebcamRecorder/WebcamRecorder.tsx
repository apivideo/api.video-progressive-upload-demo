import classNames from 'classnames';
import prettyMilliseconds from 'pretty-ms';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useWebcamRecorder } from './useWebcamRecorder';

/**
 * We need a file size big enough to be able to compare the speed of
 * each upload strategy in this demo.
 * Thus, we force the webcam recording to a fixed duration.
 */
const recordingDurationMs = 60 * 1000; // 60 seconds

export type WebcamRecorderProps = {
  readonly isUploading?: boolean;
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void | undefined;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const WebcamRecorder: React.FC<WebcamRecorderProps> = memo(
  function WebcamRecorder(props) {
    const {
      isUploading,
      onRecordingStarted,
      onRecordingStopped,
      onRecordedDataReceived
    } = props;

    const {
      videoRef,
      isCameraStreamInitialized,
      isRecording,
      onStartCamera,
      onStartRecording,
      onStopRecording
    } = useWebcamRecorder({
      onRecordingStarted,
      onRecordingStopped,
      onRecordedDataReceived
    });

    const [recordingTimeLeftMs, setRecordingTimeLeftMs] =
      useState(recordingDurationMs);

    const statusLabel = useMemo(() => {
      if (isRecording) {
        return `Recording (${prettyMilliseconds(recordingTimeLeftMs)})...`;
      }
      if (isUploading) {
        return 'Recording stopped, finishing upload to api.video ...';
      }
    }, [isRecording, isUploading, recordingTimeLeftMs]);

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

    return (
      <div>
        <video
          className={classNames({ hidden: !isCameraStreamInitialized })}
          autoPlay
          ref={videoRef}
        ></video>
        <button
          className={classNames({ hidden: isCameraStreamInitialized })}
          onClick={onStartCamera}
        >
          Start Camera
        </button>
        <button
          className={classNames({
            hidden: !isCameraStreamInitialized || isRecording || isUploading
          })}
          onClick={onStartRecording}
        >
          Start a new Recording for {prettyMilliseconds(recordingDurationMs)}
        </button>
        {statusLabel !== undefined && <p>{statusLabel}</p>}
      </div>
    );
  }
);
