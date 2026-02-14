'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'subtle' | 'elevated';
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      padding = 'md',
      background = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: 'py-0',
      sm: 'py-6',
      md: 'py-10',
      lg: 'py-16',
      xl: 'py-20',
    };

    const backgrounds = {
      default: 'bg-white',
      subtle: 'bg-[var(--gray-50)]',
      elevated: 'bg-white shadow-sm',
    };

    return (
      <section
        ref={ref}
        className={cn(
          paddings[padding],
          backgrounds[background],
          'animate-fade-in',
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;

