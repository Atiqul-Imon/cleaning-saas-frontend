'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  /** Shown when collapsed */
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Progressive disclosure: hide optional/advanced content by default.
 * "Show more" pattern for forms - keeps focus on essential fields.
 */
export default function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-2 border-[var(--gray-200)] rounded-xl overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left bg-[var(--gray-50)] hover:bg-[var(--gray-100)] transition-colors touch-manipulation"
        aria-expanded={isOpen}
        aria-controls="collapsible-content"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--gray-900)]">{title}</span>
          {summary && !isOpen && (
            <span className="text-sm text-[var(--gray-500)]">— {summary}</span>
          )}
        </div>
        <svg
          className={cn(
            'w-5 h-5 text-[var(--gray-600)] transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          id="collapsible-content"
          className="p-5 pt-2 bg-white border-t border-[var(--gray-200)] animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
}
