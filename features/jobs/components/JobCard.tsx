'use client';

import React from 'react';
import Link from 'next/link';
import { Card, StatusBadge } from '@/components/ui';
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
}

/**
 * JobCard Component
 *
 * Enhanced job card with:
 * - Cleaner design with better spacing
 * - Clear status indicators (color + icon)
 * - Priority/urgency indicators
 * - Better information hierarchy
 * - Mobile-optimized layout
 */
const JobCard = React.memo(
  ({ id, client, type, scheduledDate, scheduledTime, status, cleaner }: JobCardProps) => {
    const statusConfig = {
      SCHEDULED: {
        iconBg: 'bg-[var(--primary-50)]',
        iconColor: 'text-[var(--primary-600)]',
      },
      IN_PROGRESS: {
        iconBg: 'bg-[var(--warning-50)]',
        iconColor: 'text-[var(--warning-600)]',
      },
      COMPLETED: {
        iconBg: 'bg-[var(--success-50)]',
        iconColor: 'text-[var(--success-600)]',
      },
    };

    const config = statusConfig[status];

    // Extract cleaner name from email if name is not provided
    const getCleanerName = () => {
      if (cleaner?.name) {
        return cleaner.name;
      }
      if (cleaner?.email) {
        // Extract name from email (part before @)
        const emailName = cleaner.email.split('@')[0];
        // Capitalize first letter
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }
      return '';
    };

    // Check if job is today or overdue
    const jobDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    jobDate.setHours(0, 0, 0, 0);
    const isToday = jobDate.getTime() === today.getTime();
    const isOverdue = jobDate.getTime() < today.getTime() && status === 'SCHEDULED';

    return (
      <Link href={`/jobs/${id}`} className="h-full block touch-manipulation min-h-[88px]">
        <Card
          variant="elevated"
          padding="sm"
          hover
          clickable
          className="h-full flex flex-col transition-all duration-200"
        >
          <div className="flex flex-col flex-1 space-y-3">
            {/* Header: Client Name & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-[var(--gray-900)] mb-0.5 truncate">
                  {client.name}
                </h3>
                <p className="text-xs text-[var(--gray-600)] font-medium">
                  {type.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={status} size="sm" />
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--gray-600)]">
              <div className={cn('p-1 rounded', config.iconBg)}>
                <svg
                  className={cn('w-3.5 h-3.5', config.iconColor)}
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
              </div>
              <div className="flex-1">
                <span className="font-medium">
                  {isToday
                    ? 'Today'
                    : isOverdue
                      ? 'Overdue'
                      : formatDateBritishWithWeekday(scheduledDate)}
                </span>
                {scheduledTime && (
                  <span className="text-[var(--gray-500)] ml-1.5">• {scheduledTime}</span>
                )}
              </div>
            </div>

            {/* Spacer to ensure consistent card heights */}
            <div className="flex-1 min-h-[20px]" />

            {/* Cleaner Assignment */}
            {cleaner && (
              <div
                className={cn('flex items-center gap-1.5 px-2 py-1.5 rounded-md', config.iconBg)}
              >
                <svg
                  className={cn('w-3.5 h-3.5 flex-shrink-0', config.iconColor)}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className={cn('text-xs font-medium truncate', config.iconColor)}>
                  {getCleanerName()}
                </span>
              </div>
            )}

            {/* Urgency Indicator */}
            {isOverdue && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[var(--error-50)] rounded-md border border-[var(--error-200)]">
                <svg
                  className="w-3.5 h-3.5 text-[var(--error-600)] flex-shrink-0"
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
                <span className="text-xs font-medium text-[var(--error-700)]">
                  This job is overdue
                </span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  },
);
JobCard.displayName = 'JobCard';

export default JobCard;
