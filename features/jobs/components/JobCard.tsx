'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatDateBritishWithWeekday } from '@/lib/date-utils';

export interface JobCardProps {
  id: string;
  client: {
    id: string;
    name: string;
  };
  type: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  cleaner?: {
    id: string;
    email: string;
    name?: string;
  };
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const getCleanerName = (cleaner?: { name?: string; email?: string }) => {
  if (cleaner?.name) {
    return cleaner.name;
  }
  if (cleaner?.email) {
    const emailName = cleaner.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  return '';
};

const JobCard = React.memo(
  ({
    id,
    client,
    type,
    scheduledDate,
    scheduledTime,
    status,
    cleaner,
    selectable,
    selected,
    onSelect,
  }: JobCardProps) => {
    const jobDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    jobDate.setHours(0, 0, 0, 0);
    const isToday = jobDate.getTime() === today.getTime();
    const isOverdue = jobDate.getTime() < today.getTime() && status === 'SCHEDULED';

    const statusStyles = {
      SCHEDULED: { pill: 'bg-[var(--primary-50)]', text: 'text-[var(--primary-700)]' },
      IN_PROGRESS: { pill: 'bg-[var(--warning-50)]', text: 'text-[var(--warning-700)]' },
      COMPLETED: { pill: 'bg-[var(--success-50)]', text: 'text-[var(--success-700)]' },
    };
    const s = statusStyles[status];

    const cardContent = (
      <article
        className={cn(
          'relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]',
          'transition-all duration-300 ease-out',
          'hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5',
          'focus-within:ring-2 focus-within:ring-[var(--primary-400)] focus-within:ring-offset-2',
          selectable && selected && 'ring-2 ring-[var(--primary-500)] ring-offset-2',
        )}
      >
        {/* Header strip - client + status */}
        <div className="flex items-start justify-between gap-4 p-5 pb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {selectable && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect?.();
                }}
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors',
                  selected
                    ? 'bg-[var(--primary-600)]'
                    : 'bg-[var(--gray-200)] hover:bg-[var(--gray-300)]',
                )}
                aria-label={selected ? 'Deselect' : 'Select'}
              >
                {selected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-[var(--gray-900)] truncate leading-tight">
                {client.name}
              </h3>
              <p className="text-sm text-[var(--gray-500)] mt-0.5">{type.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <StatusBadge status={status} size="sm" />
        </div>

        {/* Body - date, time, cleaner */}
        <div className="px-5 pb-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', s.pill)}>
              <svg
                className={cn('w-4 h-4', s.text)}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className={cn('text-sm font-semibold', s.text)}>
                {isToday
                  ? 'Today'
                  : isOverdue
                    ? 'Overdue'
                    : formatDateBritishWithWeekday(scheduledDate)}
              </span>
              {scheduledTime && (
                <span className={cn('text-sm font-medium opacity-90', s.text)}>
                  · {scheduledTime}
                </span>
              )}
            </div>
          </div>

          {cleaner && (
            <div className="flex items-center gap-2 text-sm text-[var(--gray-600)]">
              <div className="w-6 h-6 rounded-full bg-[var(--gray-200)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--gray-600)]">
                  {getCleanerName(cleaner).charAt(0)}
                </span>
              </div>
              <span className="font-medium truncate">{getCleanerName(cleaner)}</span>
            </div>
          )}

          {isOverdue && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--error-50)]">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-semibold text-[var(--error-700)]">Overdue</span>
            </div>
          )}
        </div>
      </article>
    );

    if (selectable) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect?.();
            }
          }}
          className="h-full block cursor-pointer"
        >
          {cardContent}
        </div>
      );
    }

    return (
      <Link href={`/jobs/${id}`} className="h-full block focus:outline-none">
        {cardContent}
      </Link>
    );
  },
);

JobCard.displayName = 'JobCard';

export default JobCard;
