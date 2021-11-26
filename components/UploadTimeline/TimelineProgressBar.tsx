import classNames from 'classnames';
import React, { memo } from 'react';

export type TimelineProgressBarProps = {
  readonly variant: 'gradient' | 'uni';
  readonly widthPercent: number | undefined;
};

export const TimelineProgressBar: React.FC<TimelineProgressBarProps> = memo(
  function TimelineProgressBar(props) {
    const { variant, widthPercent } = props;
    return (
      <div
        className={classNames(
          'h-1.5 w-9 rounded-md',
          'transition-all duration-200',
          // Variant 'gradient'
          {
            'bg-w-screen bg-fixed': variant === 'gradient',
            'bg-gradient-to-r from-bittersweet via-cranberry to-seance':
              variant === 'gradient'
          },
          // Variant 'uni'
          {
            'bg-lavenderGray': variant === 'uni'
          }
        )}
        style={{
          width: widthPercent !== undefined ? `${widthPercent}%` : undefined
        }}
      />
    );
  }
);
