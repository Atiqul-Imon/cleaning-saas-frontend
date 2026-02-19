'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    // Use useMemo to generate ID only once per component instance
    const [checkboxId] = React.useState(
      () => id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
    );

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                'w-4 h-4 rounded border-2',
                'text-[var(--primary-600)]',
                'focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-0',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error ? 'border-[var(--error-500)]' : 'border-[var(--gray-300)]',
                className,
              )}
              aria-invalid={error ? 'true' : 'false'}
              {...props}
            />
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'ml-3 text-sm font-medium',
                error ? 'text-[var(--error-600)]' : 'text-[var(--gray-700)]',
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--error-600)] font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
