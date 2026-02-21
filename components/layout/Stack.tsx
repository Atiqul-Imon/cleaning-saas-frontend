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
    ref,
  ) => {
    const directions = {
      row: 'flex-row',
      col: 'flex-col',
    };

    const spacings = {
      none: direction === 'row' ? 'space-x-0' : 'space-y-0',
      xs: direction === 'row' ? 'space-x-2' : 'space-y-2',
      sm: direction === 'row' ? 'space-x-3' : 'space-y-3',
      md: direction === 'row' ? 'space-x-5' : 'space-y-5',
      lg: direction === 'row' ? 'space-x-8' : 'space-y-8',
      xl: direction === 'row' ? 'space-x-10' : 'space-y-10',
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
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = 'Stack';

export default Stack;
