'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface ClientCardProps {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  jobCount?: number;
}

const ClientCard = React.memo(({ id, name, phone, address, jobCount }: ClientCardProps) => {
  return (
    <Link
      href={`/clients/${id}`}
      className="group block h-full focus:outline-none touch-manipulation"
    >
      <article
        className={cn(
          'relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] h-full',
          'transition-all duration-300 ease-out',
          'hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5',
          'focus-within:ring-2 focus-within:ring-[var(--primary-400)] focus-within:ring-offset-2',
        )}
      >
        {/* Header - avatar + name */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar name={name} size="lg" />
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-bold text-lg text-[var(--gray-900)] truncate leading-tight group-hover:text-[var(--primary-600)] transition-colors">
                {name}
              </h3>
              {jobCount !== undefined && jobCount > 0 && (
                <p className="text-sm text-[var(--gray-500)] font-medium mt-1">
                  {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body - contact info */}
        <div className="px-6 pb-6 space-y-3">
          {phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-[var(--primary-600)]"
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
              <span className="text-[var(--gray-700)] font-medium truncate">{phone}</span>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-3 text-sm">
              <div className="w-9 h-9 rounded-xl bg-[var(--gray-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-[var(--gray-600)]"
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
              <span className="text-[var(--gray-600)] font-medium line-clamp-2 leading-snug">
                {address}
              </span>
            </div>
          )}
          {!phone && !address && (
            <p className="text-sm text-[var(--gray-500)]">No contact details yet</p>
          )}
        </div>
      </article>
    </Link>
  );
});

ClientCard.displayName = 'ClientCard';

export default ClientCard;
