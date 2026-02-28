'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  /** @deprecated Icons removed for minimal design - prop ignored */
  leftIcon?: React.ReactNode;
  /** @deprecated Icons removed for minimal design - prop ignored */
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button Component
 *
 * Enhanced button with:
 * - Multiple variants (primary, secondary, ghost, danger, success)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full width option
 * - Accessible (ARIA labels, keyboard navigation)
 * - Touch-friendly (44px minimum)
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon: _leftIcon,
      rightIcon: _rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] touch-manipulation';

    const variants = {
      primary:
        'bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)] active:bg-[var(--primary-800)] focus:ring-[var(--primary-500)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-card)]',
      secondary:
        'bg-[var(--gray-100)] text-[var(--gray-800)] hover:bg-[var(--gray-200)] active:bg-[var(--gray-300)] focus:ring-[var(--gray-400)]',
      ghost:
        'bg-transparent text-[var(--gray-700)] hover:bg-[var(--gray-100)] active:bg-[var(--gray-200)] focus:ring-[var(--gray-400)]',
      danger:
        'bg-[var(--error-500)] text-white hover:bg-[var(--error-600)] active:bg-[var(--error-700)] focus:ring-[var(--error-500)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-card)]',
      success:
        'bg-[var(--success-500)] text-white hover:bg-[var(--success-600)] active:bg-[var(--success-700)] focus:ring-[var(--success-500)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-card)]',
    };

    const sizes = {
      sm: 'px-4 py-2.5 text-sm min-h-[48px]',
      md: 'px-6 py-3.5 text-base min-h-[48px]',
      lg: 'px-8 py-4.5 text-lg min-h-[52px]',
    };

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
