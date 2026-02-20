'use client';

import { cn } from '@/lib/utils';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  className?: string;
}

/**
 * FilterBar Component
 *
 * A horizontal filter bar with:
 * - Multiple filter options
 * - Active state indication
 * - Optional count badges
 * - Responsive layout
 */
export default function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 sm:gap-3 pb-4 border-b border-[var(--gray-200)]',
        className,
      )}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'min-h-[44px] min-w-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)]',
              isActive
                ? 'bg-[var(--primary-600)] text-white shadow-md'
                : 'bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]',
            )}
            aria-pressed={isActive}
          >
            <span className="flex items-center gap-2">
              {filter.label}
              {filter.count !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--gray-200)] text-[var(--gray-600)]',
                  )}
                >
                  {filter.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
