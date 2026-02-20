'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  exact?: boolean;
}

export interface SidebarProps {
  items: NavItem[];
  className?: string;
}

/**
 * Sidebar Navigation Component
 *
 * A responsive sidebar navigation with:
 * - Active state indication
 * - Icon support
 * - Badge notifications
 * - Theme-aware colors
 * - Accessible navigation
 */
export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <nav className="p-4 space-y-1" aria-label="Main navigation">
      {items.map((item) => {
        const active = isActive(item);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              'min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:ring-offset-2',
            )}
            style={{
              backgroundColor: active ? 'var(--primary-50)' : 'transparent',
              color: active ? 'var(--primary-700)' : 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className="flex-shrink-0 transition-colors duration-200"
              style={{
                color: active ? 'var(--primary-600)' : 'var(--text-tertiary)',
              }}
            >
              {item.icon}
            </span>
            <span className="flex-1 truncate font-semibold">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold transition-colors duration-200"
                style={{
                  backgroundColor: active ? 'var(--primary-600)' : 'var(--bg-tertiary)',
                  color: active ? '#ffffff' : 'var(--text-primary)',
                }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
