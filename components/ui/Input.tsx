'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

/**
 * Input Component
 *
 * Enhanced input field with:
 * - Label and helper text
 * - Error states with validation messages
 * - Icon support (left/right)
 * - Required field indicator
 * - Accessible (ARIA labels, error announcements)
 * - Mobile-optimized (prevents zoom on iOS)
 * - Theme-aware colors
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, required, className, id, ...props }, ref) => {
    const [inputId] = React.useState(
      () => id || `input-${Math.random().toString(36).substr(2, 9)}`,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold mb-2 transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
            {required && (
              <span className="text-[var(--error-500)] ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'transition-all duration-200 ease-out',
              'text-base md:text-sm', // Prevent zoom on iOS
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error
                ? 'border-[var(--error-500)] focus:ring-[var(--error-500)] focus:border-[var(--error-600)]'
                : 'focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            style={{
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              borderColor: error ? 'var(--error-500)' : 'var(--border-medium)',
            }}
            placeholder={props.placeholder}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm font-medium transition-colors duration-300"
            style={{ color: 'var(--error-600)' }}
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm transition-colors duration-300"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
