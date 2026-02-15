'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  children: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'col',
      spacing = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const directions = {
      row: 'flex-row',
      col: 'flex-col',
    };

    const spacings = {
      none: direction === 'row' ? 'space-x-0' : 'space-y-0',
      xs: direction === 'row' ? 'space-x-1' : 'space-y-1',
      sm: direction === 'row' ? 'space-x-2' : 'space-y-2',
      md: direction === 'row' ? 'space-x-4' : 'space-y-4',
      lg: direction === 'row' ? 'space-x-6' : 'space-y-6',
      xl: direction === 'row' ? 'space-x-8' : 'space-y-8',
    };

    const aligns = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    const justifies = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directions[direction],
          spacings[spacing],
          aligns[align],
          justifies[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export default Stack;





