import classNames from 'classnames';
import React, { memo } from 'react';
import { TimelineDot } from './TimelineDot';

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
  // withHeader?: boolean;
};

export const UploadTimeline: React.FC<UploadTimelineProps> = memo(
  function UploadTimeline(props) {
    // const { label, currentStep, durationMs, videoLink } = props;
    const { title } = props;

    return (
      <div
        className={classNames(
          `grid grid-cols-${colCount} h-24 justify-items-center`
        )}
      >
        {/* Header row */}
        <div></div>
        <div>File size</div>
        <div>Upload</div>
        <div>Video link</div>
        <div></div>

        {/* Title */}
        <div className="font-bold justify-self-start">{title}</div>

        {/* File size */}
        <div>
          <TimelineDot state="idle" variant="gradient" />
        </div>

        {/* Upload */}
        <div>
          <TimelineDot state="idle" variant="gradient" />
        </div>

        {/* Video link */}
        <div>
          <TimelineDot state="idle" variant="gradient" />
        </div>

        {/* Elapsed time */}
        <div></div>

        {/* Progress bar */}
        <div
          className={classNames(`col-span-${colCount} justify-self-stretch`)}
        >
          <div
            className={classNames(
              'h-1.5 w-1/12 rounded-md ',
              'transition-all duration-200',
              // 'bg-lavenderGray',
              'bg-w-screen bg-fixed',
              'bg-gradient-to-r from-bittersweet via-cranberry to-seance'
            )}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  }
);
