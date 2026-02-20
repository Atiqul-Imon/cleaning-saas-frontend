'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'subtle' | 'elevated';
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ padding = 'md', background = 'default', className, children, ...props }, ref) => {
    const paddings = {
      none: 'py-0',
      sm: 'py-6',
      md: 'py-10',
      lg: 'py-16',
      xl: 'py-20',
    };

    const getBackgroundStyle = () => {
      switch (background) {
        case 'subtle':
          return { backgroundColor: 'var(--bg-secondary)' };
        case 'elevated':
          return { backgroundColor: 'var(--bg-elevated)', boxShadow: 'var(--shadow-sm)' };
        default:
          return { backgroundColor: 'var(--bg-primary)' };
      }
    };

    return (
      <section
        ref={ref}
        className={cn(
          paddings[padding],
          'transition-colors duration-300',
          'animate-fade-in',
          className,
        )}
        style={getBackgroundStyle()}
        {...props}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = 'Section';

export default Section;
