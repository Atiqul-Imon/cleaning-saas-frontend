'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const [inputId] = React.useState(
      () => id || `input-${Math.random().toString(36).substr(2, 9)}`,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--gray-700)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-[var(--gray-900)] min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-all duration-200 ease-out',
              'placeholder:text-[var(--gray-400)]',
              'text-base md:text-sm', // Prevent zoom on iOS
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error
                ? 'border-[var(--error-500)] focus:ring-[var(--error-500)] focus:border-[var(--error-600)]'
                : 'border-[var(--gray-300)] focus:ring-[var(--primary-500)] focus:border-[var(--primary-600)]',
              'disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed',
              className,
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-[var(--error-600)] font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-[var(--gray-500)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
