'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader Component
 *
 * A consistent header component for all pages with:
 * - Title and optional description
 * - Back navigation
 * - Action buttons
 * - Responsive layout
 */
export default function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 sm:mb-8', className)}>
      {/* Back Button */}
      {backHref && (
        <Link href={backHref} className="inline-block mb-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            {backLabel}
          </Button>
        </Link>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--gray-900)] mb-2 break-words">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-[var(--gray-600)] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
