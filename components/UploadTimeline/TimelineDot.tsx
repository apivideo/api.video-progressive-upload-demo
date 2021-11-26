import classNames from 'classnames';
import React, { memo } from 'react';
import { IconCheck } from '../../assets/svg';

export type TimelineDotProps = {
  readonly className?: string;
  readonly state: 'idle' | 'active';
  readonly isDone: boolean;
  readonly variant: 'gradient' | 'uni';
  readonly size?: 'md' | 'xl';
  readonly iconDone?: React.ReactNode;
};

export const TimelineDot: React.FC<TimelineDotProps> = memo(
  function TimelineDot(props) {
    const { className, state, variant, isDone, iconDone, size = 'md' } = props;
    const isInProgress = state === 'active' && !isDone;
    return (
      <div
        className={classNames(
          'absolute transition-all',
          {
            'w-5 h-5': size === 'md',
            'w-8 h-8': size === 'xl'
          },
          className
        )}
      >
        <div
          className={classNames(
            'absolute',
            'w-full h-full rounded-full',
            'transition-opacity',
            'bg-fiord',
            {
              'opacity-0': state === 'active',
              'opacity-1': state === 'idle'
            }
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
          className={classNames(
            'absolute left-1/2 top-1/2',
            'transform transition-transform -translate-x-1/2 -translate-y-1/2',
            {
              'scale-0': !isDone,
              'scale-1': isDone
            }
          )}
        >
          {iconDone !== undefined ? iconDone : <IconCheck />}
        </div>
      </div>
    );
  }
);
