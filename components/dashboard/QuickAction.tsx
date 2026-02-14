'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface QuickActionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function QuickAction({
  title,
  description,
  icon,
  href,
  variant = 'primary',
}: QuickActionProps) {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)]',
      hover: 'hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-[var(--gray-100)] to-[var(--gray-200)]',
      hover: 'hover:from-[var(--gray-200)] hover:to-[var(--gray-300)]',
      text: 'text-[var(--gray-900)]',
      iconBg: 'bg-[var(--gray-300)]',
    },
    accent: {
      bg: 'bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)]',
      hover: 'hover:from-[var(--accent-600)] hover:to-[var(--accent-700)]',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
  };

  const currentVariant = variants[variant];

  return (
    <Link href={href}>
      <Card
        variant="flat"
        padding="lg"
        hover
        className={cn(
          'relative overflow-hidden transition-all duration-200',
          currentVariant.bg,
          currentVariant.hover,
          currentVariant.text
        )}
      >
        <div className="flex items-center space-x-4">
          <div className={cn('p-3 rounded-xl', currentVariant.iconBg)}>
            <div className="w-8 h-8">{icon}</div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
          </div>
          <svg
            className="w-5 h-5 opacity-80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}


