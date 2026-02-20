'use client';

import Badge from './Badge';
import { cn } from '@/lib/utils';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';

export interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * StatusBadge Component
 *
 * A semantic status badge with:
 * - Automatic type detection from status
 * - Consistent styling
 * - Icon support (optional)
 * - Accessible labels
 */
export default function StatusBadge({ status, type, size = 'md', className }: StatusBadgeProps) {
  // Auto-detect type from status if not provided
  const detectedType: StatusType =
    type ||
    (status.toUpperCase().includes('COMPLETED') || status.toUpperCase().includes('PAID')
      ? 'success'
      : status.toUpperCase().includes('PROGRESS') || status.toUpperCase().includes('PENDING')
        ? 'warning'
        : status.toUpperCase().includes('CANCELLED') || status.toUpperCase().includes('FAILED')
          ? 'error'
          : status.toUpperCase().includes('SCHEDULED')
            ? 'info'
            : 'neutral');

  const typeConfig = {
    success: {
      variant: 'success' as const,
      className: 'bg-[var(--success-50)] text-[var(--success-700)] border-[var(--success-200)]',
    },
    warning: {
      variant: 'warning' as const,
      className: 'bg-[var(--warning-50)] text-[var(--warning-700)] border-[var(--warning-200)]',
    },
    error: {
      variant: 'error' as const,
      className: 'bg-[var(--error-50)] text-[var(--error-700)] border-[var(--error-200)]',
    },
    info: {
      variant: 'primary' as const,
      className: 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]',
    },
    primary: {
      variant: 'primary' as const,
      className: 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]',
    },
    neutral: {
      variant: 'default' as const,
      className: 'bg-[var(--gray-100)] text-[var(--gray-700)] border-[var(--gray-200)]',
    },
  };

  const config = typeConfig[detectedType];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={cn('border font-medium', config.className, className)}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
