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
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'warning' | 'purple';
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
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
      hover: 'hover:from-gray-200 hover:to-gray-300',
      text: 'text-gray-900',
      iconBg: 'bg-gray-300',
    },
    accent: {
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      hover: 'hover:from-indigo-600 hover:to-indigo-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      hover: 'hover:from-emerald-600 hover:to-emerald-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    info: {
      bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      hover: 'hover:from-cyan-600 hover:to-cyan-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      hover: 'hover:from-amber-600 hover:to-amber-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
    purple: {
      bg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      hover: 'hover:from-violet-600 hover:to-violet-700',
      text: 'text-white',
      iconBg: 'bg-white bg-opacity-20',
    },
  };

  const currentVariant = variants[variant];

  return (
    <Link href={href} className="h-full block">
      <Card
        variant="flat"
        padding="none"
        hover
        className={cn(
          'relative overflow-hidden transition-all duration-200 h-full',
          'p-4 sm:p-5 lg:p-6 xl:p-8', // Responsive padding: optimized for all devices
          currentVariant.bg,
          currentVariant.hover,
          currentVariant.text
        )}
      >
        <div className="relative flex flex-col h-full justify-center">
          {/* Mobile: Icon and text on same line, Desktop: Centered */}
          <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-0 flex-1 pr-6 sm:pr-0 sm:justify-center">
            <div className={cn('p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl flex-shrink-0', currentVariant.iconBg)}>
              <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">{icon}</div>
            </div>
            <div className="flex-1 sm:flex-none sm:w-full sm:mt-4 sm:text-center min-w-0">
              <h3 className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl truncate sm:truncate-none leading-tight">{title}</h3>
              {description && (
                <p className="text-xs sm:text-sm lg:text-base opacity-90 leading-relaxed hidden sm:block mt-2">{description}</p>
              )}
            </div>
          </div>
          {/* Arrow icon - positioned on the right */}
          <svg
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 opacity-80 flex-shrink-0"
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


