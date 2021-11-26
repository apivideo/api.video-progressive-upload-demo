import classNames from 'classnames';
import React, { memo } from 'react';

export type TimelineDotProps = {
  readonly className?: string;
  readonly state: 'idle' | 'done';
  readonly variant: 'gradient' | 'uni';
};

export const TimelineDot: React.FC<TimelineDotProps> = memo(
  function TimelineDot(props) {
    const { className, state, variant } = props;
    return (
      <div className={classNames('absolute w-5 h-5', className)}>
        <div
          className={classNames(
            'absolute',
            'w-full h-full rounded-full',
            'transition-opacity',
            'bg-fiord'
          )}
        />
        <div
          className={classNames(
            'absolute',
            'w-full h-full rounded-full',
            'transition-opacity',
            {
              'opacity-0': state === 'idle',
              'opacity-1': state === 'done'
            },
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
        />
      </div>
    );
  }
);
