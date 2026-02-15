'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Avatar, Badge } from '@/components/ui';
import { Stack } from '@/components/layout';
import { cn } from '@/lib/utils';

export interface ClientCardProps {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  jobCount?: number;
  onClick?: () => void;
}

const ClientCard = React.memo(function ClientCard({
  id,
  name,
  phone,
  address,
  jobCount,
  onClick,
}: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/clients/${id}`}>
      <Card variant="elevated" padding="lg" hover className="h-full">
        <Stack direction="row" spacing="md" align="start">
          <Avatar name={name} size="lg" />
          <div className="flex-1 min-w-0">
            <Stack direction="row" justify="between" align="start" className="mb-2">
              <h3 className="text-lg font-bold text-[var(--gray-900)] truncate">{name}</h3>
              {jobCount !== undefined && jobCount > 0 && (
                <Badge variant="primary" size="sm">
                  {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                </Badge>
              )}
            </Stack>
            {phone && (
              <Stack direction="row" spacing="sm" align="center" className="mb-1">
                <svg className="w-4 h-4 text-[var(--gray-500)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-[var(--gray-600)] truncate">{phone}</span>
              </Stack>
            )}
            {address && (
              <Stack direction="row" spacing="sm" align="start" className="text-[var(--gray-600)]">
                <svg className="w-4 h-4 text-[var(--gray-500)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm truncate">{address}</span>
              </Stack>
            )}
          </div>
        </Stack>
      </Card>
    </Link>
  );
});

export default ClientCard;

