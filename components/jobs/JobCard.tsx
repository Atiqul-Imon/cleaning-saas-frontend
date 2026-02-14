'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Badge, Avatar } from '@/components/ui';
import { Stack } from '@/components/layout';
import { cn } from '@/lib/utils';

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
  };
  onClick?: () => void;
}

const JobCard = React.memo(function JobCard({
  id,
  client,
  type,
  scheduledDate,
  scheduledTime,
  status,
  cleaner,
  onClick,
}: JobCardProps) {
  const statusConfig = {
    SCHEDULED: {
      variant: 'primary' as const,
      color: 'border-l-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    IN_PROGRESS: {
      variant: 'warning' as const,
      color: 'border-l-[var(--warning-500)]',
      bg: 'bg-[var(--warning-50)]',
    },
    COMPLETED: {
      variant: 'success' as const,
      color: 'border-l-[var(--success-500)]',
      bg: 'bg-[var(--success-50)]',
    },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/jobs/${id}`}>
      <Card variant="elevated" padding="md" hover className={cn('border-l-4', config.color)}>
        <Stack direction="row" justify="between" align="start" className="mb-3">
          <Stack direction="row" spacing="md" align="start" className="flex-1">
            <Avatar name={client.name} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[var(--gray-900)] text-lg mb-1 truncate">{client.name}</h3>
              <p className="text-sm text-[var(--gray-600)] font-medium mb-2">
                {type.replace('_', ' ')}
              </p>
              <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-600)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(scheduledDate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                {scheduledTime && (
                  <>
                    <span className="text-[var(--gray-400)]">•</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{scheduledTime}</span>
                  </>
                )}
              </Stack>
            </div>
          </Stack>
          <Badge variant={config.variant} size="md">
            {status.replace('_', ' ')}
          </Badge>
        </Stack>
        {cleaner && (
          <div className={cn('mt-3 pt-3 border-t border-[var(--gray-200)]', config.bg, 'px-3 py-2 rounded-lg')}>
            <Stack direction="row" spacing="sm" align="center">
              <svg className="w-4 h-4 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-[var(--gray-700)] font-medium">Assigned to: {cleaner.email}</span>
            </Stack>
          </div>
        )}
      </Card>
    </Link>
  );
});

export default JobCard;

