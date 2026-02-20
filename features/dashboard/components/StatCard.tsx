'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  highlight?: boolean;
}

/**
 * StatCard Component
 *
 * Enhanced stat card with:
 * - Cleaner, minimal design
 * - Better icon placement
 * - Trend indicators
 * - Clickable support
 * - Highlight option for important stats
 * - Mobile-optimized
 */
const StatCard = React.memo(
  ({
    title,
    value,
    icon,
    trend,
    variant = 'default',
    onClick,
    highlight = false,
  }: StatCardProps) => {
    const variants = {
      default: {
        bg: 'bg-white',
        border: 'border-[var(--gray-200)]',
        iconBg: 'bg-[var(--gray-100)]',
        iconColor: 'text-[var(--gray-700)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      primary: {
        bg: 'bg-white',
        border: 'border-[var(--primary-200)]',
        iconBg: 'bg-[var(--primary-50)]',
        iconColor: 'text-[var(--primary-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      success: {
        bg: 'bg-white',
        border: 'border-[var(--success-200)]',
        iconBg: 'bg-[var(--success-50)]',
        iconColor: 'text-[var(--success-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      warning: {
        bg: 'bg-white',
        border: 'border-[var(--warning-200)]',
        iconBg: 'bg-[var(--warning-50)]',
        iconColor: 'text-[var(--warning-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      error: {
        bg: 'bg-white',
        border: 'border-[var(--error-200)]',
        iconBg: 'bg-[var(--error-50)]',
        iconColor: 'text-[var(--error-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
    };

    const currentVariant = variants[variant];

    return (
      <Card
        variant="default"
        padding="md"
        hover={!!onClick}
        clickable={!!onClick}
        onClick={onClick}
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          highlight && 'ring-2 ring-[var(--primary-500)] ring-offset-2',
          currentVariant.bg,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p
              className={cn('text-sm font-semibold mb-3 tracking-wide', currentVariant.titleColor)}
            >
              {title}
            </p>
            <p
              className={cn('text-4xl sm:text-5xl font-extrabold mb-2', currentVariant.valueColor)}
            >
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1.5">
                {trend.value > 0 ? (
                  <svg
                    className="w-4 h-4 text-[var(--success-600)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                ) : trend.value < 0 ? (
                  <svg
                    className="w-4 h-4 text-[var(--error-600)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17l5-5m0 0l-5-5m5 5H6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-[var(--gray-400)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14"
                    />
                  </svg>
                )}
                <span
                  className={cn(
                    'text-xs font-semibold',
                    trend.value > 0
                      ? 'text-[var(--success-600)]'
                      : trend.value < 0
                        ? 'text-[var(--error-600)]'
                        : 'text-[var(--gray-500)]',
                  )}
                >
                  {trend.value !== 0 && `${Math.abs(trend.value)}%`} {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 sm:p-4 rounded-xl flex-shrink-0', currentVariant.iconBg)}>
            <div className={cn('w-7 h-7 sm:w-8 sm:h-8', currentVariant.iconColor)}>{icon}</div>
          </div>
        </div>
      </Card>
    );
  },
);
StatCard.displayName = 'StatCard';

export default StatCard;
