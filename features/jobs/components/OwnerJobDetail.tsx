'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { Stack } from '@/components/layout';
import { useApiMutation } from '@/lib/hooks/use-api';
import { useToast } from '@/lib/toast-context';
import { queryKeys } from '@/lib/query-keys';

interface OwnerJobDetailProps {
  job: any;
  onStatusUpdate?: (status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') => void;
  updating?: boolean;
}

export default function OwnerJobDetail({ job, onStatusUpdate, updating }: OwnerJobDetailProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const hasCleaner = !!job.cleanerId;
  const canDelete = job.status === 'SCHEDULED';

  // Delete job mutation
  const deleteJobMutation = useApiMutation({
    endpoint: `/jobs/${job.id}`,
    method: 'DELETE',
    invalidateQueries: [
      queryKeys.jobs.all(job.businessId || ''),
      queryKeys.jobs.detail(job.id),
      ['dashboard', 'stats'],
    ],
    mutationOptions: {
      onSuccess: () => {
        showToast('Job deleted successfully', 'success');
        router.push('/jobs');
      },
      onError: (error) => {
        const errorMessage = (error as Error)?.message || 'Failed to delete job. Please try again.';
        showToast(errorMessage, 'error');
        setIsDeleting(false);
      },
    },
  });

  const handleDelete = async () => {
    if (!canDelete) {
      showToast('Only scheduled jobs can be deleted', 'error');
      return;
    }

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to delete this job? This action cannot be undone.',
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    deleteJobMutation.mutate({});
  };

  return (
    <Card variant="elevated" padding="lg" className="sticky top-4">
      <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">Job Management</h2>
      <Stack spacing="md">
        {/* Status Update Section - Show when no cleaner is assigned */}
        {onStatusUpdate && !hasCleaner && (
          <div className="space-y-3 pb-4 border-b border-[var(--gray-200)]">
            <h3 className="text-sm font-semibold text-[var(--gray-700)] uppercase tracking-wide">
              Update Status
            </h3>
            {job.status === 'SCHEDULED' && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onStatusUpdate('IN_PROGRESS')}
                isLoading={updating}
                className="w-full"
              >
                Start Job (Owner)
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
                Complete Job (Owner)
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
                  <p className="text-[var(--success-800)] font-bold">Job Completed (by Owner)</p>
                </Stack>
              </Card>
            )}
            <p className="text-xs text-[var(--gray-500)] text-center mt-2">
              No cleaner assigned. You can complete this job yourself.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--gray-700)] uppercase tracking-wide">
            Quick Actions
          </h3>
          <Link href={`/jobs/${job.id}/edit`} className="w-full">
            <Button variant="secondary" size="lg" className="w-full">
              Edit Job
            </Button>
          </Link>
          <Link href={`/clients/${job.client.id}`} className="w-full">
            <Button variant="primary" size="lg" className="w-full">
              View Client
            </Button>
          </Link>
          {job.invoice ? (
            <Link href={`/invoices/${job.invoice.id}`} className="w-full">
              <Button variant="success" size="lg" className="w-full">
                View Invoice
              </Button>
            </Link>
          ) : (
            <Link
              href={`/invoices/create?jobId=${job.id}`}
              className="w-full"
              style={{ pointerEvents: job.status === 'COMPLETED' ? 'auto' : 'none' }}
            >
              <Button
                variant="success"
                size="lg"
                className="w-full"
                disabled={job.status !== 'COMPLETED'}
              >
                Create Invoice
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button
              variant="danger"
              size="lg"
              className="w-full"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete Job
            </Button>
          )}
        </div>
      </Stack>
    </Card>
  );
}
