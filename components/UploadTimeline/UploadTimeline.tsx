import classNames from 'classnames';
import React, { memo } from 'react';

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
          <div className="w-5 h-5 rounded-full bg-lavenderGray relative top-3/4"></div>
        </div>

        {/* Upload */}
        <div>
          <div className="w-5 h-5 rounded-full bg-lavenderGray relative top-3/4"></div>
        </div>

        {/* Video link */}
        <div>
          <div className="w-5 h-5 rounded-full bg-lavenderGray relative top-3/4"></div>
        </div>

        {/* Elapsed time */}
        <div></div>

        {/* Progress bar */}
        <div
          className={classNames(`col-span-${colCount} justify-self-stretch`)}
        >
          <div className="h-1.5 w-1/12 bg-lavenderGray rounded-md transition-all duration-200"></div>
        </div>
      </div>
    );
  }
);
