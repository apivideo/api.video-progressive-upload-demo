import prettyMilliseconds from 'pretty-ms';
import React, { memo, useEffect, useRef } from 'react';
import {
  IconCheckRounded,
  IconPlaySvg,
  IconReload,
  IconStopSvg
} from '../../assets/svg';
import { Button } from '../../components/Button';

export type RecordButtonProps = {
  readonly recordingTimeLeftMs: number;
  readonly isRecording: boolean;
  readonly isUploading: boolean;
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const RecordButton: React.FC<RecordButtonProps> = memo(
  function RecordButton(props) {
    const { recordingTimeLeftMs, isRecording, isUploading, onClick } = props;

    const isFirstRecordingRef = useRef(true);
    useEffect(() => {
      if (isRecording) {
        isFirstRecordingRef.current = false;
      }
    }, [isRecording]);

    return (
      <>
        {isRecording && (
          <Button disabled={isRecording || isUploading} onClick={onClick}>
            <IconStopSvg className="inline-block pr-2 w-auto fill-current stroke-current text-botticelli" />
            Recording... ({prettyMilliseconds(recordingTimeLeftMs)} left)
          </Button>
        )}
        {!isRecording && isUploading && (
          <Button disabled={isRecording || isUploading} onClick={onClick}>
            <IconCheckRounded className="inline-block pr-2 w-auto fill-current stroke-fiord text-botticelli" />
            Recording completed
          </Button>
        )}
        {!isRecording && !isUploading && isFirstRecordingRef.current && (
          <Button disabled={isRecording || isUploading} onClick={onClick}>
            <IconPlaySvg className="inline-block pr-2 w-auto fill-current stroke-current text-white" />
            Start recording
          </Button>
        )}
        {!isRecording && !isUploading && !isFirstRecordingRef.current && (
          <Button
            variant="secondary"
            disabled={isRecording || isUploading}
            onClick={onClick}
          >
            <IconReload className="inline-block pr-2 w-auto" />
            Restart recording
          </Button>
        )}
      </>
    );
  }
);
