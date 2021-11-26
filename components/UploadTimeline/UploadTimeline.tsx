import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';
import React, { memo, useMemo } from 'react';
import { IconApiVideoSvg } from '../../assets/svg';
import { TimelineDot } from './TimelineDot';
import { TimelineProgressBar } from './TimelineProgressBar';

/**
 * Number of columns in the timeline grid
 * 1 Title / 2 Filesize / 3 Upload / 4 Link / 5 Elapsed time
 */
const colCount = 5;

function getProgressBarColIndexFromState(
  isRecording: boolean,
  isUploading: boolean,
  videoLink: string
) {
  if (videoLink !== '') {
    return 5;
  }
  if (isUploading) {
    return 3;
  }
  if (isRecording) {
    return 2;
  }
  return undefined;
}

export type UploadTimelineProps = {
  readonly title: React.ReactNode;
  readonly fileSizeBytes: number;
  readonly videoLink: string;
  readonly totalDurationMs: number;
  readonly recordingDurationMs: number;
  readonly isRecording: boolean;
  readonly isUploading: boolean;
  readonly variant: 'gradient' | 'uni';
  readonly withHeader?: boolean;
};

export const UploadTimeline: React.FC<UploadTimelineProps> = memo(
  function UploadTimeline(props) {
    const {
      title,
      variant,
      withHeader,
      fileSizeBytes,
      videoLink,
      totalDurationMs,
      recordingDurationMs,
      isRecording,
      isUploading
    } = props;

    const progressBarIndex = useMemo(
      () =>
        getProgressBarColIndexFromState(isRecording, isUploading, videoLink),
      [isRecording, isUploading, videoLink]
    );

    const progressBarPercentageWidth = useMemo(() => {
      if (progressBarIndex === undefined) {
        return;
      }
      if (progressBarIndex === colCount) {
        return 100;
      }
      return (progressBarIndex * 100) / colCount - 100 / colCount / 2;
    }, [progressBarIndex]);

    // Show elapsed time only when recording is finished.
    // Also subtract recording duration from total time.
    const shouldShowElapsedTime = totalDurationMs > 0 && !isRecording;
    const elapsedTimeMs = totalDurationMs - recordingDurationMs;

    return (
      <>
        {/* Header row */}
        {withHeader && (
          // `grid-cols-5` needs to match `colCount`
          <div className="grid grid-cols-5 justify-items-center pb-8">
            <div className="font-bold justify-self-start">
              <IconApiVideoSvg className="inline-flex pr-1.5" />
              api.video
            </div>
            <div>File size</div>
            <div>Upload</div>
            <div>Video link</div>
            <div></div>
          </div>
        )}
        {/* `grid-cols-5` needs to match `colCount` */}
        <div className="grid grid-cols-5 justify-items-center relative">
          {/* Title */}
          <div className="font-bold justify-self-start pb-4">{title}</div>

          {/* File size */}
          <div>
            <span className="absolute transform -translate-x-1/2">
              {prettyBytes(fileSizeBytes)}
            </span>
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state={
                isRecording || isUploading || videoLink !== '' ? 'done' : 'idle'
              }
              variant={variant}
            />
          </div>

          {/* Upload */}
          <div>
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state={isUploading || videoLink !== '' ? 'done' : 'idle'}
              variant={variant}
            />
          </div>

          {/* Video link */}
          <div>
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state={videoLink !== '' ? 'done' : 'idle'}
              variant={variant}
            />
          </div>

          {/* Elapsed time */}
          <div>
            {shouldShowElapsedTime &&
              elapsedTimeMs > 0 &&
              prettyMilliseconds(elapsedTimeMs, {
                keepDecimalsOnWholeSeconds: true,
                secondsDecimalDigits: 2
              })}
          </div>

          {/* Progress bar */}
          {/* `col-span-5` needs to match `colCount` */}
          <div className="col-span-5 justify-self-stretch pt-1.5">
            <TimelineProgressBar
              variant={variant}
              widthPercent={progressBarPercentageWidth}
            />
          </div>
        </div>
      </>
    );
  }
);
