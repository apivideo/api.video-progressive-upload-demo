import classNames from 'classnames';
import React, { memo } from 'react';

export type ButtonProps = {
  readonly variant?: 'primary' | 'secondary';
  readonly size?: 'small' | 'default';
} & Pick<React.InputHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'>;

export const Button: React.FC<ButtonProps> = memo(function Button(props) {
  const {
    children,
    disabled,
    variant = 'primary',
    size = 'default',
    onClick
  } = props;

  return (
    <button
      className={classNames('py-3 px-5 rounded-md font-bold transition-all', {
        // variants
        'bg-outrageousOrange': !disabled && variant === 'primary',
        'text-white': !disabled && variant === 'primary',

        'bg-lavenderGray': !disabled && variant === 'secondary',
        'text-firefly': !disabled && variant === 'secondary',

        // disabled
        'bg-fiord': disabled,
        'text-botticelli': disabled,
        'pointer-events-none': disabled,

        // sizes
        'py-2 px-4 text-sm leading-3 ': size === 'small',
        'py-3 px-5 text-base leading-snug ': size === 'default'
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
