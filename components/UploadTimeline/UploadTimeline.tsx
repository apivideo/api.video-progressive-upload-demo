import classNames from 'classnames';
import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';
import React, { memo, useMemo } from 'react';
import { IconApiVideoSvg, IconPlaySvg } from '../../assets/svg';
import { SpeedTag } from './SpeedTag';
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
    return 4.25;
  }
  if (isRecording) {
    return 3;
  }
  return undefined;
}

export type UploadTimelineProps = {
  readonly title: React.ReactNode;
  readonly fileSizeBytes: number;
  readonly videoLink: string;
  readonly totalDurationMs: number;
  readonly isRecording: boolean;
  readonly isUploading: boolean;
  readonly timesFaster: number | undefined;
  readonly variant: 'gradient' | 'uni';
  readonly withHeader?: boolean;
  readonly shouldShowSpeedTag?: boolean;
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
      timesFaster,
      shouldShowSpeedTag,
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

    return (
      <>
        {/* Header row */}
        {withHeader && (
          // `grid-cols-5` needs to match `colCount`
          <div className="grid grid-cols-4 justify-items-end pb-8">
            <div className="font-bold justify-self-start">
              <IconApiVideoSvg className="inline-flex pr-1.5" />
              api.video
            </div>
            <div>File size</div>
            <div>Upload</div>
            <div>Video link</div>
          </div>
        )}
        {/* `grid-cols-5` needs to match `colCount` */}
        <div className="grid grid-cols-4 justify-items-end relative">
          {/* Title */}
          <div className="font-bold justify-self-start pb-4">{title}</div>

          {/* File size */}
          <div>
            <span className="absolute transform -translate-x-14">
              {fileSizeBytes > 0
                ? prettyBytes(fileSizeBytes)
                : isUploading && 'chunk uploaded'}
            </span>
            <TimelineDot
              className="transform -translate-x-10 -bottom-2"
              state={
                isRecording || isUploading || videoLink !== ''
                  ? 'active'
                  : 'idle'
              }
              isDone={isUploading || videoLink !== ''}
              variant={variant}
            />
          </div>

          {/* Upload */}
          <div>
            <TimelineDot
              className="transform -translate-x-10 -bottom-2"
              state={isUploading || videoLink !== '' ? 'active' : 'idle'}
              isDone={videoLink !== ''}
              variant={variant}
            />
          </div>

          {/* Elapsed time */}
          <div className="justify-self-end text-right">
            <span className="font-bold">
              {shouldShowElapsedTime &&
                prettyMilliseconds(totalDurationMs, {
                  keepDecimalsOnWholeSeconds: true,
                  secondsDecimalDigits: 2
                })}
            </span>
            {videoLink !== '' && shouldShowSpeedTag ? (
              <SpeedTag
                variant={'gradient'}
                timesFaster={timesFaster && timesFaster > 1 ? timesFaster : 2}
              />
            ) : null}
          </div>

          {/* Video link */}
          <div>
            <a
              href={videoLink !== '' ? videoLink : undefined}
              target="_blank"
              rel="noreferrer"
            >
              <TimelineDot
                className={classNames('transform -translate-x-8', {
                  '-bottom-2': videoLink === '',
                  '-bottom-3': videoLink !== ''
                })}
                state={videoLink !== '' ? 'active' : 'idle'}
                isDone={videoLink !== ''}
                size={videoLink !== '' ? 'xl' : 'md'}
                variant={variant}
                iconDone={
                  <IconPlaySvg className="text-white fill-current w-3.5 h-4" />
                }
              />
            </a>
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
