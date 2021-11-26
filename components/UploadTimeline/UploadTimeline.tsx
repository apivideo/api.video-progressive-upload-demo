import classNames from 'classnames';
import React, { memo } from 'react';
import { TimelineDot } from './TimelineDot';
import { TimelineProgressBar } from './TimelineProgressBar';

/**
 * Number of columns in the timeline grid
 * Title / Filesize / Upload / Link / Elapsed time
 */
const colCount = 5;

export type UploadTimelineProps = {
  title: React.ReactNode;
  // currentStep: string;
  // fileSizeBytes: number;
  // videoLink: string | undefined;
  // durationMs: number;
  variant: 'gradient' | 'uni';
  withHeader?: boolean;
};

export const UploadTimeline: React.FC<UploadTimelineProps> = memo(
  function UploadTimeline(props) {
    // const { label, currentStep, durationMs, videoLink } = props;
    const { title, variant, withHeader } = props;

    return (
      <>
        {/* Header row */}
        {withHeader && (
          <div
            className={classNames(
              `grid grid-cols-${colCount} justify-items-center pb-2`
            )}
          >
            <div></div>
            <div>File size</div>
            <div>Upload</div>
            <div>Video link</div>
            <div></div>
          </div>
        )}

        <div
          className={classNames(
            `grid grid-cols-${colCount} h-16 justify-items-center`
          )}
        >
          {/* Title */}
          <div className="font-bold justify-self-start">{title}</div>

          {/* File size */}
          <div>
            <TimelineDot state="idle" variant={variant} />
          </div>

          {/* Upload */}
          <div>
            <TimelineDot state="idle" variant={variant} />
          </div>

          {/* Video link */}
          <div>
            <TimelineDot state="idle" variant={variant} />
          </div>

          {/* Elapsed time */}
          <div></div>

          {/* Progress bar */}
          <div
            className={classNames(`col-span-${colCount} justify-self-stretch`)}
          >
            <TimelineProgressBar variant={variant} widthPercent={undefined} />
          </div>
        </div>
      </>
    );
  }
);
