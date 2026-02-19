'use client';

import { Card, Button } from '@/components/ui';
import { Stack } from '@/components/layout';

interface CleanerJobDetailProps {
  job: any;
  onStatusUpdate: (status: 'IN_PROGRESS' | 'COMPLETED') => void;
  updating: boolean;
}

export default function CleanerJobDetail({ job, onStatusUpdate, updating }: CleanerJobDetailProps) {
  return (
    <Card variant="elevated" padding="lg" className="sticky top-4">
      <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">Update Status</h2>
      <Stack spacing="md">
        {job.status === 'SCHEDULED' && (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onStatusUpdate('IN_PROGRESS')}
            isLoading={updating}
            className="w-full"
          >
            Start Job
          </Button>
        )}
        {job.status === 'IN_PROGRESS' && (
          <Button
            variant="success"
            size="lg"
            onClick={() => onStatusUpdate('COMPLETED')}
            isLoading={updating}
            className="w-full"
          >
            Complete Job
          </Button>
        )}
        {job.status === 'COMPLETED' && (
          <Card
            variant="outlined"
            padding="md"
            className="bg-[var(--success-50)] border-[var(--success-200)]"
          >
            <Stack direction="row" spacing="sm" align="center" justify="center">
              <svg
                className="w-5 h-5 text-[var(--success-600)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-[var(--success-800)] font-bold">Job Completed</p>
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
