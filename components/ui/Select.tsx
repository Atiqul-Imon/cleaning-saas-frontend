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
  (
    {
      label,
      error,
      helperText,
      options,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-[var(--gray-700)] mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-lg border-2 px-4 py-3 text-[var(--gray-900)] min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-all duration-200 ease-out',
            'bg-white text-base md:text-sm', // Prevent zoom on iOS
            'disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed',
            error
              ? 'border-[var(--error-500)] focus:ring-[var(--error-500)] focus:border-[var(--error-600)]'
              : 'border-[var(--gray-300)] focus:ring-[var(--primary-500)] focus:border-[var(--primary-600)]',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
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
          <p
            id={`${selectId}-helper`}
            className="mt-2 text-sm text-[var(--gray-500)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

