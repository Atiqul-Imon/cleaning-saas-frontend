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
}

const StatCard = React.memo(function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  onClick,
}: StatCardProps) {
  const variants = {
    default: {
      bg: 'bg-gradient-to-br from-[var(--gray-50)] to-[var(--gray-100)]',
      iconBg: 'bg-[var(--gray-200)]',
      iconColor: 'text-[var(--gray-700)]',
      valueColor: 'text-[var(--gray-900)]',
    },
    primary: {
      bg: 'bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]',
      iconBg: 'bg-[var(--primary-500)]',
      iconColor: 'text-white',
      valueColor: 'text-[var(--primary-700)]',
    },
    success: {
      bg: 'bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)]',
      iconBg: 'bg-[var(--success-500)]',
      iconColor: 'text-white',
      valueColor: 'text-[var(--success-700)]',
    },
    warning: {
      bg: 'bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)]',
      iconBg: 'bg-[var(--warning-500)]',
      iconColor: 'text-white',
      valueColor: 'text-[var(--warning-700)]',
    },
    error: {
      bg: 'bg-gradient-to-br from-[var(--error-50)] to-[var(--error-100)]',
      iconBg: 'bg-[var(--error-500)]',
      iconColor: 'text-white',
      valueColor: 'text-[var(--error-700)]',
    },
  };

  const currentVariant = variants[variant];

  return (
    <Card
      variant="flat"
      padding="lg"
      hover={!!onClick}
      onClick={onClick}
      className={cn('relative overflow-hidden', currentVariant.bg)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--gray-600)] mb-1">{title}</p>
          <p className={cn('text-3xl font-bold mb-2', currentVariant.valueColor)}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.value > 0 ? (
                <svg className="w-4 h-4 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              ) : trend.value < 0 ? (
                <svg className="w-4 h-4 text-[var(--error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
              )}
              <span
                className={cn(
                  'text-sm font-semibold',
                  trend.value > 0
                    ? 'text-[var(--success-600)]'
                    : trend.value < 0
                    ? 'text-[var(--error-600)]'
                    : 'text-[var(--gray-500)]'
                )}
              >
                {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', currentVariant.iconBg)}>
          <div className={cn('w-6 h-6', currentVariant.iconColor)}>{icon}</div>
        </div>
      </div>
    </Card>
  );
});

export default StatCard;

