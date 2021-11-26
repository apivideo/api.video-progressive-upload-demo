import classNames from 'classnames';
import React, { memo } from 'react';
import { IconCheck } from '../../assets/svg';

export type TimelineDotProps = {
  readonly className?: string;
  readonly state: 'idle' | 'active';
  readonly isDone: boolean;
  readonly variant: 'gradient' | 'uni';
};

export const TimelineDot: React.FC<TimelineDotProps> = memo(
  function TimelineDot(props) {
    const { className, state, variant, isDone } = props;
    const isInProgress = state === 'active' && !isDone;
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
              'opacity-1': state === 'active'
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
            },
            // Pulse animation
            {
              'animate-pulse-shadow-cranberry':
                isInProgress && variant === 'gradient',
              'animate-pulse-shadow-lavenderGray':
                isInProgress && variant === 'uni'
            }
          )}
        />
        <div
          className={classNames('absolute transform transition-transform', {
            'scale-0': !isDone,
            'scale-1': isDone
          })}
        >
          <IconCheck />
        </div>
      </div>
    );
  }
);
