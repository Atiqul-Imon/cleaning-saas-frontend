'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

/**
 * Card Component
 *
 * Enhanced card with:
 * - Multiple variants (default, elevated, outlined, flat)
 * - Padding options (none, sm, md, lg)
 * - Hover effects
 * - Clickable state
 * - Smooth transitions
 * - Accessible (role, tabIndex when clickable)
 */

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      clickable = false,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: 'shadow-[var(--shadow-subtle)]',
      elevated: 'shadow-[var(--shadow-card)]',
      outlined: 'border-2 shadow-[var(--shadow-subtle)]',
      flat: 'border-0 shadow-none',
    };

    const getVariantStyles = () => {
      const baseStyle = {
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-light)',
      };

      if (variant === 'outlined') {
        return { ...baseStyle, borderColor: 'var(--border-medium)' };
      }
      if (variant === 'flat') {
        return { ...baseStyle, backgroundColor: 'var(--bg-tertiary)', borderColor: 'transparent' };
      }
      return baseStyle;
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-5',
      md: 'p-7',
      lg: 'p-9',
    };

    const isInteractive = clickable || hover || onClick;

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={cn(
          'rounded-2xl transition-all duration-200 ease-out border-2',
          variants[variant],
          paddings[padding],
          (hover || clickable) &&
            'hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 cursor-pointer active:scale-[0.98]',
          isInteractive &&
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:ring-offset-2',
          className,
        )}
        style={getVariantStyles()}
        onClick={onClick}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.(e as any);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
