'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  exact?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

/**
 * Bottom Navigation Component
 *
 * A mobile-friendly bottom navigation bar with:
 * - Fixed positioning
 * - Active state indication
 * - Icon and label
 * - Badge notifications
 * - Safe area support for notched devices
 * - Accessible navigation
 */
export default function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (item: BottomNavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[var(--z-fixed)]',
        'bg-white border-t border-[var(--gray-200)]',
        'safe-area-bottom',
        'lg:hidden', // Hide on desktop
        className,
      )}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'min-w-[60px] min-h-[44px] px-3 py-2 rounded-lg',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2',
                active
                  ? 'text-[var(--primary-600)]'
                  : 'text-[var(--gray-600)] hover:text-[var(--gray-900)]',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <span
                  className={cn(
                    'flex-shrink-0',
                    active ? 'text-[var(--primary-600)]' : 'text-[var(--gray-500)]',
                  )}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1',
                      'px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white',
                      'bg-[var(--error-500)] min-w-[18px] text-center',
                    )}
                    aria-label={`${item.badge} notifications`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium truncate max-w-[60px]',
                  active ? 'text-[var(--primary-600)]' : 'text-[var(--gray-600)]',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
