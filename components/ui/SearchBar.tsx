'use client';

import Input from './Input';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchBar Component
 *
 * A specialized search input with:
 * - Search icon
 * - Clear button
 * - Accessible labels
 * - Mobile-optimized
 */
export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  ...props
}: SearchBarProps) {
  const showClear = value && String(value).length > 0;

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : undefined
        }
        aria-label="Search"
        {...props}
      />
    </div>
  );
}
