'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Avatar } from '@/components/ui';

export interface ClientCardProps {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  jobCount?: number;
}

/**
 * ClientCard Component
 *
 * Enhanced client card with:
 * - Compact, modern design
 * - Better information hierarchy
 * - Mobile-optimized layout
 * - Consistent with JobCard styling
 */
const ClientCard = React.memo(({ id, name, phone, address, jobCount }: ClientCardProps) => {
  return (
    <Link href={`/clients/${id}`} className="h-full block touch-manipulation min-h-[88px]">
      <Card
        variant="elevated"
        padding="sm"
        hover
        clickable
        className="h-full flex flex-col transition-all duration-200"
      >
        <div className="flex flex-col flex-1 space-y-3">
          {/* Header: Avatar & Name */}
          <div className="flex items-start gap-3">
            <Avatar name={name} size="md" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-[var(--gray-900)] mb-0.5 truncate">{name}</h3>
              {jobCount !== undefined && jobCount > 0 && (
                <p className="text-xs text-[var(--gray-600)] font-medium">
                  {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            {phone && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--gray-600)]">
                <div className="p-1 bg-[var(--primary-50)] rounded">
                  <svg
                    className="w-3 h-3 text-[var(--primary-600)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="font-medium truncate">{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-1.5 text-xs text-[var(--gray-600)]">
                <div className="p-1 bg-[var(--accent-50)] rounded flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-[var(--accent-600)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium line-clamp-2">{address}</span>
              </div>
            )}
          </div>

          {/* Spacer for consistent heights */}
          <div className="flex-1 min-h-[20px]" />
        </div>
      </Card>
    </Link>
  );
});
ClientCard.displayName = 'ClientCard';

export default ClientCard;
