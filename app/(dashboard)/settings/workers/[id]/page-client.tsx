'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid, PageHeader } from '@/components/layout';
import { Card, Button, Avatar, Badge, LoadingSkeleton, Modal, Input } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';
import type { Job } from '@/features/jobs/types/job.types';

interface CleanerDetail {
  id: string;
  cleanerId: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  totalJobs: number;
  todayJobs: number;
  createdAt: string;
  activatedAt?: string;
}

export default function StaffDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const cleanerId = params.id as string;
  const { userRole } = useUserRole();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useMutation<void, Error, { cleanerId: string }>({
    mutationFn: async (variables: { cleanerId: string }) => {
      const { apiClient } = await import('@/lib/api-client-singleton');
      return apiClient.delete<void>(`/business/cleaners/${variables.cleanerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.business.cleaners(userRole?.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.cleanerDetail(cleanerId) });
      setShowDeleteModal(false);
      setDeleteConfirmEmail('');
      showToast('Staff member removed successfully', 'success');
      router.push('/settings/workers');
    },
    onError: (error) => {
      const errorMessage = (error as Error)?.message || 'Failed to remove staff member';
      setDeleteError(errorMessage);
      showToast(errorMessage, 'error');
    },
  });

  const cleanerQuery = useApiQuery<CleanerDetail>(
    queryKeys.business.cleanerDetail(cleanerId),
    `/business/cleaners/${cleanerId}`,
    {
      enabled:
        !!cleanerId && !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  const jobsQuery = useApiQuery<Job[]>(queryKeys.jobs.all(userRole?.id), '/jobs', {
    enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
  });

  const cleaner = cleanerQuery.data;
  const allJobs = jobsQuery.data || [];
  const staffJobs = useMemo(
    () =>
      allJobs.filter((j) => j.cleaner?.id === cleanerId || j.cleanerId === cleanerId).slice(0, 12),
    [allJobs, cleanerId],
  );
  const loading = cleanerQuery.isLoading;
  const jobsLoading = jobsQuery.isLoading;

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

  if (!cleaner) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-[var(--error-50)] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--error-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Staff member not found
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  The staff member you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link href="/settings/workers">
                  <Button variant="primary">Back to Staff</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  const displayName = cleaner.name || cleaner.email;

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          <PageHeader
            title={displayName}
            description={cleaner.name ? cleaner.email : undefined}
            backHref="/settings/workers"
            backLabel="Back to Staff"
            actions={
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  setShowDeleteModal(true);
                  setDeleteConfirmEmail('');
                  setDeleteError(null);
                }}
              >
                Remove Staff
              </Button>
            }
          />

          {/* Staff Info Card */}
          <Card variant="elevated" padding="md">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar name={displayName} size="xl" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h2 className="text-xl font-bold text-[var(--gray-900)]">{displayName}</h2>
                  <Badge
                    variant={
                      cleaner.status === 'ACTIVE'
                        ? 'success'
                        : cleaner.status === 'PENDING'
                          ? 'warning'
                          : 'primary'
                    }
                    size="sm"
                  >
                    {cleaner.status}
                  </Badge>
                </div>
                {cleaner.name && (
                  <p className="text-sm text-[var(--gray-600)] mb-4">{cleaner.email}</p>
                )}
                <Grid cols={2} gap="md" className="sm:grid-cols-4">
                  <div>
                    <p className="text-2xl font-extrabold text-[var(--gray-900)]">
                      {cleaner.totalJobs}
                    </p>
                    <p className="text-xs text-[var(--gray-600)] font-medium uppercase tracking-wide mt-1">
                      Total Jobs
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[var(--primary-600)]">
                      {cleaner.todayJobs}
                    </p>
                    <p className="text-xs text-[var(--gray-600)] font-medium uppercase tracking-wide mt-1">
                      Today
                    </p>
                  </div>
                </Grid>
              </div>
            </div>
          </Card>

          {/* Recent Jobs */}
          <Card variant="elevated" padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-1">Recent Jobs</h2>
                <p className="text-sm text-[var(--gray-600)]">
                  {staffJobs.length} of {cleaner.totalJobs} jobs shown
                </p>
              </div>
              <Link href="/jobs">
                <Button variant="secondary" size="sm">
                  View All Jobs
                </Button>
              </Link>
            </div>
            {jobsLoading ? (
              <LoadingSkeleton type="card" count={2} />
            ) : staffJobs.length > 0 ? (
              <Grid cols={1} gap="md" className="sm:grid-cols-2 lg:grid-cols-3">
                {staffJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    client={job.client}
                    type={job.type}
                    scheduledDate={job.scheduledDate}
                    scheduledTime={job.scheduledTime}
                    status={job.status}
                    cleaner={job.cleaner}
                  />
                ))}
              </Grid>
            ) : (
              <Card variant="outlined" padding="lg" className="text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[var(--gray-400)]"
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
                  <div>
                    <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">No jobs yet</h3>
                    <p className="text-[var(--gray-600)] mb-6">
                      This staff member has not been assigned any jobs.
                    </p>
                    <Link href="/jobs/create">
                      <Button variant="primary" size="lg">
                        Create Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </Card>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteConfirmEmail('');
              setDeleteError(null);
            }}
            title="Remove Staff Member?"
          >
            <Stack spacing="lg">
              <div className="text-center">
                <div className="bg-[var(--error-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[var(--error-600)]"
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
                </div>
                <p className="text-[var(--gray-700)] font-medium">
                  This action will permanently remove <strong>{cleaner.email}</strong> from your
                  business.
                </p>
              </div>

              <Card
                variant="outlined"
                padding="md"
                className="bg-[var(--error-50)] border-[var(--error-200)]"
              >
                <p className="text-sm text-[var(--error-900)] font-medium">
                  ⚠️ <strong>Warning:</strong> This will immediately revoke their access. They will
                  no longer be able to view or manage jobs.
                </p>
              </Card>

              {deleteError && (
                <Card
                  variant="outlined"
                  padding="md"
                  className="bg-[var(--error-50)] border-[var(--error-200)]"
                >
                  <span className="text-[var(--error-900)] font-semibold">{deleteError}</span>
                </Card>
              )}

              <Input
                label={`Type ${cleaner.email} to confirm:`}
                id="deleteConfirmEmail"
                type="email"
                required
                value={deleteConfirmEmail}
                onChange={(e) => {
                  setDeleteConfirmEmail(e.target.value);
                  setDeleteError(null);
                }}
                disabled={deleteMutation.isPending}
                placeholder="Enter email to confirm"
              />

              <Stack direction="row" spacing="md">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmEmail('');
                    setDeleteError(null);
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => {
                    if (deleteConfirmEmail !== cleaner.email) {
                      setDeleteError('Email does not match. Please type the exact email address.');
                      return;
                    }
                    setDeleteError(null);
                    deleteMutation.mutate({ cleanerId: cleaner.cleanerId });
                  }}
                  disabled={deleteMutation.isPending || deleteConfirmEmail !== cleaner.email}
                  isLoading={deleteMutation.isPending}
                  className="flex-1"
                >
                  Remove Staff Member
                </Button>
              </Stack>
            </Stack>
          </Modal>
        </Stack>
      </Container>
    </Section>
  );
}
