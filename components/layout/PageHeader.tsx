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
  /** Optional refresh callback - shows mobile-only refresh button (Phase 3) */
  onRefresh?: () => void | Promise<unknown>;
  isRefreshing?: boolean;
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
  onRefresh,
  isRefreshing = false,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 sm:mb-10', className)}>
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
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-3 break-words leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-base text-[var(--text-tertiary)] leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {/* Mobile refresh button - Phase 3: 48px touch target */}
          {onRefresh && (
            <button
              type="button"
              onClick={() => onRefresh()}
              disabled={isRefreshing}
              className="flex-shrink-0 md:hidden flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-[var(--gray-100)] hover:bg-[var(--gray-200)] active:scale-95 transition-all touch-manipulation"
              aria-label={isRefreshing ? 'Refreshing' : 'Refresh'}
            >
              <svg
                className={`w-6 h-6 text-[var(--text-tertiary)] ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
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
