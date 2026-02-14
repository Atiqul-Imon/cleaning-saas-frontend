'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 3,
      gap = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      12: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
    };

    const gaps = {
      none: 'gap-0',
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colClasses[cols],
          gaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;

