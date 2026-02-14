'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-[var(--gray-200)] shadow-sm',
      elevated: 'bg-white border border-[var(--gray-200)] shadow-lg',
      outlined: 'bg-transparent border-2 border-[var(--gray-300)]',
      flat: 'bg-[var(--gray-50)] border-0',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200 ease-out',
          variants[variant],
          paddings[padding],
          hover && 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

