'use client';

import React from 'react';
import { Card, Avatar } from '@/components/ui';
import { Stack } from '@/components/layout';

interface OwnerJobInfoProps {
  job: any;
}

export default function OwnerJobInfo({ job }: OwnerJobInfoProps) {
  return (
    <Card variant="elevated" padding="lg">
      <h2 className="text-xl font-bold text-[var(--gray-900)] mb-6">Job Information</h2>
      <Stack spacing="md">
        <div>
          <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Job Type</p>
          <p className="text-lg font-bold text-[var(--gray-900)]">{job.type.replace('_', ' ')}</p>
        </div>
        {job.frequency && (
          <div>
            <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Frequency</p>
            <p className="text-lg font-bold text-[var(--gray-900)]">{job.frequency.replace('_', ' ')}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Assigned Worker</p>
          {job.cleaner ? (
            <Stack direction="row" spacing="sm" align="center">
              <Avatar name={job.cleaner.email} size="sm" />
              <p className="text-lg font-bold text-[var(--gray-900)]">{job.cleaner.email}</p>
            </Stack>
          ) : (
            <p className="text-lg font-bold text-[var(--gray-400)] italic">Not assigned</p>
          )}
        </div>
        {job.status === 'SCHEDULED' && (
          <div>
            <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Reminder</p>
            <Stack direction="row" spacing="sm" align="center">
              {job.reminderEnabled !== false ? (
                <>
                  <svg className="w-5 h-5 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-bold text-[var(--gray-900)]">
                    Enabled {job.reminderTime ? `(${job.reminderTime} before)` : '(1 day before)'}
                  </p>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-bold text-[var(--gray-400)]">Disabled</p>
                </>
              )}
            </Stack>
          </div>
        )}
      </Stack>
    </Card>
  );
}

