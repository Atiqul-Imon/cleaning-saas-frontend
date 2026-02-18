'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      spacing = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const variants = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    const spacings = {
      none: orientation === 'horizontal' ? 'my-0' : 'mx-0',
      sm: orientation === 'horizontal' ? 'my-3' : 'mx-3',
      md: orientation === 'horizontal' ? 'my-6' : 'mx-6',
      lg: orientation === 'horizontal' ? 'my-8' : 'mx-8',
    };

    if (orientation === 'vertical') {
      return (
        <div
          ref={ref as any}
          className={cn(
            'border-l border-[var(--gray-200)]',
            variants[variant],
            spacings[spacing],
            'h-full',
            className
          )}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'border-0 border-t border-[var(--gray-200)]',
          variants[variant],
          spacings[spacing],
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;







