import React, { memo } from 'react';
import { IconApiVideoSvg } from '../../assets/svg';
import { TimelineDot } from './TimelineDot';
import { TimelineProgressBar } from './TimelineProgressBar';

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
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state="idle"
              variant={variant}
            />
          </div>

          {/* Upload */}
          <div>
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state="idle"
              variant={variant}
            />
          </div>

          {/* Video link */}
          <div>
            <TimelineDot
              className="transform -translate-x-1/2 -bottom-2"
              state="idle"
              variant={variant}
            />
          </div>

          {/* Elapsed time */}
          <div></div>

          {/* Progress bar */}
          {/* `col-span-5` needs to match `colCount` */}
          <div className="col-span-5 justify-self-stretch pt-1.5">
            <TimelineProgressBar variant={variant} widthPercent={undefined} />
          </div>
        </div>
      </>
    );
  }
);
