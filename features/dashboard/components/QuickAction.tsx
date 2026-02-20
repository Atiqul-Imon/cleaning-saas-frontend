'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface QuickActionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'warning' | 'purple';
}

/**
 * QuickAction Component
 *
 * Simplified quick action button with:
 * - Clean, minimal design (no busy gradients)
 * - Subtle backgrounds with icons
 * - Clear labels
 * - Mobile-optimized (2 per row)
 * - Touch-friendly
 */
export default function QuickAction({
  title,
  description,
  icon,
  href,
  variant = 'primary',
}: QuickActionProps) {
  const variants = {
    primary: {
      bg: 'bg-[var(--primary-50)]',
      iconBg: 'bg-[var(--primary-100)]',
      iconColor: 'text-[var(--primary-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--primary-100)]',
    },
    secondary: {
      bg: 'bg-[var(--gray-50)]',
      iconBg: 'bg-[var(--gray-100)]',
      iconColor: 'text-[var(--gray-700)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--gray-100)]',
    },
    accent: {
      bg: 'bg-[var(--accent-50)]',
      iconBg: 'bg-[var(--accent-100)]',
      iconColor: 'text-[var(--accent-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--accent-100)]',
    },
    success: {
      bg: 'bg-[var(--success-50)]',
      iconBg: 'bg-[var(--success-100)]',
      iconColor: 'text-[var(--success-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--success-100)]',
    },
    info: {
      bg: 'bg-[var(--accent-50)]',
      iconBg: 'bg-[var(--accent-100)]',
      iconColor: 'text-[var(--accent-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--accent-100)]',
    },
    warning: {
      bg: 'bg-[var(--warning-50)]',
      iconBg: 'bg-[var(--warning-100)]',
      iconColor: 'text-[var(--warning-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--warning-100)]',
    },
    purple: {
      bg: 'bg-[var(--primary-50)]',
      iconBg: 'bg-[var(--primary-100)]',
      iconColor: 'text-[var(--primary-600)]',
      textColor: 'text-[var(--gray-900)]',
      hover: 'hover:bg-[var(--primary-100)]',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="w-full min-w-0">
      <Link href={href} className="h-full block w-full min-w-0">
        <Card
          variant="flat"
          padding="none"
          hover
          clickable
          className={cn(
            'relative overflow-hidden transition-all duration-200 h-full w-full min-w-0',
            'p-3 sm:p-4',
            currentVariant.bg,
            currentVariant.hover,
          )}
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={cn('p-2 rounded-lg flex-shrink-0', currentVariant.iconBg)}>
              <div className={cn('w-5 h-5 sm:w-6 sm:h-6', currentVariant.iconColor)}>{icon}</div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-semibold text-sm sm:text-base mb-0.5 break-words',
                  currentVariant.textColor,
                )}
              >
                {title}
              </h3>
              {description && (
                <p className="text-xs text-[var(--gray-600)] hidden sm:block break-words">
                  {description}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
