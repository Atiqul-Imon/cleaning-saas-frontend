'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, ...props }, ref) => {
    const [selectId] = React.useState(
      () => id || `select-${Math.random().toString(36).substr(2, 9)}`,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-base font-bold text-[var(--gray-900)] mb-3"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-xl border-0 px-4 py-4 text-[var(--gray-900)] min-h-[56px] shadow-[var(--shadow-subtle)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--primary-500)]',
            'transition-all duration-200 ease-out',
            'bg-[var(--bg-tertiary)] text-base font-medium',
            'disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed',
            error && 'ring-2 ring-[var(--error-500)]',
            className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-2 text-sm text-[var(--error-600)] font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-2 text-sm text-[var(--gray-500)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
