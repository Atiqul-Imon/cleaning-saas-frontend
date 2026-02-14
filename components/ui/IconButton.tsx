'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]',
      ghost: 'bg-transparent text-[var(--gray-600)] hover:bg-[var(--gray-100)]',
      primary: 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]',
      danger: 'bg-[var(--error-500)] text-white hover:bg-[var(--error-600)]',
    };

    const sizes = {
      sm: 'w-10 h-10 min-w-[44px] min-h-[44px]',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;

