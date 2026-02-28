'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface QuickActionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'warning' | 'purple';
}

const colorVariants = {
  primary:
    'border-teal-200 bg-teal-50/80 text-teal-700 hover:bg-teal-100 [&_svg]:text-teal-600 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  secondary:
    'border-border bg-muted/80 text-muted-foreground hover:bg-muted [&_svg]:text-muted-foreground',
  accent:
    'border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100 [&_svg]:text-cyan-600 dark:border-cyan-800 dark:bg-cyan-950/50',
  success:
    'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 [&_svg]:text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50',
  info: 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 [&_svg]:text-blue-600 dark:border-blue-800 dark:bg-blue-950/50',
  warning:
    'border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100 [&_svg]:text-amber-600 dark:border-amber-800 dark:bg-amber-950/50',
  purple:
    'border-violet-200 bg-violet-50/80 text-violet-700 hover:bg-violet-100 [&_svg]:text-violet-600 dark:border-violet-800 dark:bg-violet-950/50',
};

/**
 * QuickAction - Compact, colorful action buttons for dashboard
 * shadcn-inspired, sleek, grid-friendly on mobile
 */
export default function QuickAction({ title, icon, href, variant = 'primary' }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex min-h-10 w-full items-center justify-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-sm transition-all hover:shadow',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'touch-manipulation',
        colorVariants[variant],
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/70 [&>svg]:size-4">
        {icon}
      </span>
      <span className="truncate">{title}</span>
    </Link>
  );
}
