import classNames from 'classnames';
import React, { memo } from 'react';

export type SpeedTagProps = {
  readonly variant: 'gradient' | 'uni';
  readonly timesFaster: number;
};

export const SpeedTag: React.FC<SpeedTagProps> = memo(function SpeedTag(props) {
  const { variant, timesFaster } = props;
  return (
    <div
      className={classNames(
        'text-xs font-bold py-1 px-1.5 uppercase rounded-t rounded-b inline-block ml-2',
        {
          'bg-gradient-to-r from-bittersweet via-cranberry to-cerise':
            variant === 'gradient',
          'text-firefly bg-lavenderGray': variant === 'uni'
        }
      )}
    >
      {timesFaster > 1 ? 'Faster' : 'Slower'}
    </div>
  );
});
