import classNames from 'classnames';
import prettyBytes from 'pretty-bytes';
import React, { memo } from 'react';
import { useWebcamRecorder } from './useWebcamRecorder';

export type WebcamRecorderProps = Record<string, unknown>;

export const WebcamRecorder: React.FC<WebcamRecorderProps> = memo(
  function WebcamRecorder() {
    const {
      videoRef,
      isCameraStreamInitialized,
      isRecording,
      totalRecordedBytes,
      supportedMimeType,
      downloadLink,
      onStartCamera,
      onStartRecording,
      onStopRecording
    } = useWebcamRecorder({});

    return (
      <div>
        <p>Mime Type: {supportedMimeType?.name}</p>
        <p>Total size recorded: {prettyBytes(totalRecordedBytes)}</p>
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
        <a
          className={classNames({
            hidden: downloadLink === undefined || isRecording
          })}
          download={`demo.${supportedMimeType?.extension}`}
          href={downloadLink}
        >
          Download Video
        </a>
      </div>
    );
  }
);
