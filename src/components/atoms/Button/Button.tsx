'use client';

import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

// Type definitions
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    disabled && styles['button--disabled'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;