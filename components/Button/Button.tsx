import classNames from 'classnames';
import React, { memo } from 'react';

export type ButtonProps = {
  readonly variant?: 'primary' | 'secondary';
  readonly size?: 'small' | 'default';
} & Pick<React.InputHTMLAttributes<HTMLButtonElement>, 'onClick'>;

export const Button: React.FC<ButtonProps> = memo(function Button(props) {
  const { children, variant = 'primary', size = 'default', onClick } = props;

  return (
    <button
      className={classNames('py-3 px-5 rounded-md font-bold', {
        // variants
        'bg-outrageousOrange': variant === 'primary',
        'text-white': variant === 'primary',

        'bg-lavenderGray': variant === 'secondary',
        'text-firefly': variant === 'secondary',

        // sizes
        'py-2 px-4 text-sm leading-3 ': size === 'small',
        'py-3 px-5 text-base leading-snug ': size === 'default'
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
