'use client';

import React from 'react';
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
        iconBg: 'bg-[var(--gray-100)]',
        iconColor: 'text-[var(--gray-700)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      primary: {
        iconBg: 'bg-[var(--primary-50)]',
        iconColor: 'text-[var(--primary-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      success: {
        iconBg: 'bg-[var(--success-50)]',
        iconColor: 'text-[var(--success-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      warning: {
        iconBg: 'bg-[var(--warning-50)]',
        iconColor: 'text-[var(--warning-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
      error: {
        iconBg: 'bg-[var(--error-50)]',
        iconColor: 'text-[var(--error-600)]',
        valueColor: 'text-[var(--gray-900)]',
        titleColor: 'text-[var(--gray-600)]',
      },
    };

    const v = variants[variant];

    return (
      <div
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={cn(
          'w-full text-left rounded-2xl p-6 bg-white shadow-[var(--shadow-card)]',
          'transition-all duration-300 ease-out',
          onClick && 'cursor-pointer hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5',
          highlight && 'ring-2 ring-[var(--primary-400)] ring-offset-2',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-semibold mb-2', v.titleColor)}>{title}</p>
            <p className={cn('text-3xl sm:text-4xl font-extrabold tracking-tight', v.valueColor)}>
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1.5 mt-2">
                {trend.value > 0 ? (
                  <svg
                    className="w-4 h-4 text-[var(--success-600)]"
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
                    className="w-4 h-4 text-[var(--error-600)]"
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
                    className="w-4 h-4 text-[var(--gray-400)]"
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
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              v.iconBg,
            )}
          >
            <div className={cn('w-6 h-6', v.iconColor)}>{icon}</div>
          </div>
        </div>
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';

export default StatCard;
