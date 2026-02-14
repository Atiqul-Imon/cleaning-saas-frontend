'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
      primary: 'bg-[var(--primary-100)] text-[var(--primary-700)]',
      success: 'bg-[var(--success-100)] text-[var(--success-700)]',
      warning: 'bg-[var(--warning-100)] text-[var(--warning-700)]',
      error: 'bg-[var(--error-100)] text-[var(--error-700)]',
      info: 'bg-[var(--accent-100)] text-[var(--accent-700)]',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;


