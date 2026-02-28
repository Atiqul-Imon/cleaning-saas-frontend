'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const [textareaId] = React.useState(
      () => id || `textarea-${Math.random().toString(36).substr(2, 9)}`,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-[var(--gray-700)] mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl border-0 px-4 py-3 text-[var(--gray-900)] shadow-[var(--shadow-subtle)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--primary-500)]',
            'transition-all duration-200 ease-out',
            'placeholder:text-[var(--gray-400)]',
            'resize-y min-h-[100px] text-base md:text-sm bg-[var(--bg-tertiary)]',
            'disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed',
            error && 'ring-2 ring-[var(--error-500)]',
            className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-[var(--error-600)] font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-2 text-sm text-[var(--gray-500)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
