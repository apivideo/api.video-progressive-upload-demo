import classNames from 'classnames';
import React, { memo } from 'react';
import { useWebcamRecorder } from './useWebcamRecorder';

export type WebcamRecorderProps = {
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void | undefined;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const WebcamRecorder: React.FC<WebcamRecorderProps> = memo(
  function WebcamRecorder(props) {
    const { onRecordingStarted, onRecordingStopped, onRecordedDataReceived } =
      props;

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
            hidden: !isCameraStreamInitialized || isRecording
          })}
          onClick={onStartRecording}
        >
          Start Recording
        </button>
        <button
          className={classNames({ hidden: !isRecording })}
          onClick={onStopRecording}
        >
          Stop Recording
        </button>
      </div>
    );
  }
);
