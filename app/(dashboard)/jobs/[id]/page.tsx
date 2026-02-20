'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { Card, Button, Badge, Avatar, LoadingSkeleton } from '@/components/ui';
import dynamic from 'next/dynamic';

// Lazy load job detail components (heavy components with complex logic)
const OwnerJobDetail = dynamic(
  () => import('@/features/jobs/components').then((mod) => ({ default: mod.OwnerJobDetail })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />,
  },
);

const OwnerJobInfo = dynamic(
  () => import('@/features/jobs/components').then((mod) => ({ default: mod.OwnerJobInfo })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  },
);

const CleanerJobDetail = dynamic(
  () => import('@/features/jobs/components').then((mod) => ({ default: mod.CleanerJobDetail })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />,
  },
);

// Lazy load heavy components for code splitting
const PhotoUpload = dynamic(() => import('@/features/jobs/components/PhotoUpload'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  ssr: false,
});
const PhotoGallery = dynamic(() => import('@/features/jobs/components/PhotoGallery'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  ssr: false,
});
const JobChecklist = dynamic(() => import('@/features/jobs/components/JobChecklist'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  ssr: false,
});
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  type: string;
  frequency?: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  reminderEnabled?: boolean;
  reminderTime?: string;
  reminderSent?: boolean;
  cleanerId?: string;
  cleaner?: {
    id: string;
    email: string;
  };
  client: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    notes?: any;
  };
  checklist: {
    id: string;
    itemText: string;
    completed: boolean;
  }[];
  photos: {
    id: string;
    imageUrl: string;
    photoType: 'BEFORE' | 'AFTER';
    timestamp: string;
  }[];
  invoice?: any;
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { userRole, loading: roleLoading } = useUserRole();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job using React Query
  const jobQuery = useApiQuery<Job>(queryKeys.jobs.detail(jobId), `/jobs/${jobId}`, {
    enabled: !!jobId && !!userRole,
  });

  const job = jobQuery.data;
  const loading = jobQuery.isLoading;
  const error = jobQuery.error ? (jobQuery.error as Error).message : null;

  const isOwner = userRole?.role === 'OWNER';
  const isCleaner = userRole?.role === 'CLEANER';

  // Update job status mutation
  const updateStatusMutation = useApiMutation<
    Job,
    { status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' }
  >({
    endpoint: `/jobs/${jobId}`,
    method: 'PUT',
    invalidateQueries: [
      queryKeys.jobs.detail(jobId),
      queryKeys.jobs.all(userRole?.id),
      queryKeys.jobs.myJobs(userRole?.id),
      ['dashboard', 'stats'],
    ],
    mutationOptions: {
      onSuccess: (updatedJob) => {
        const statusText = updatedJob.status.replace('_', ' ');
        showToast(`Job status updated to ${statusText}`, 'success');

        // If job is completed, invalidate dashboard stats to refresh the UI
        if (updatedJob.status === 'COMPLETED') {
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
        }
      },
      onError: (error) => {
        const errorMessage =
          (error as Error)?.message || 'Failed to update job status. Please try again.';
        showToast(errorMessage, 'error');
      },
    },
  });

  const updateStatus = (newStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') => {
    if (!job) {
      return;
    }
    updateStatusMutation.mutate({ status: newStatus });
  };

  const updating = updateStatusMutation.isPending;

  if (roleLoading || loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  if (error && !job) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
          <Card variant="elevated" padding="lg" className="text-center">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-2">Error</h2>
            <p className="text-[var(--gray-600)] mb-6">{error}</p>
            <Stack direction="row" spacing="md" justify="center">
              <Link href="/jobs">
                <Button variant="primary">Back to Jobs</Button>
              </Link>
              <Button variant="secondary" onClick={() => jobQuery.refetch()}>
                Try Again
              </Button>
            </Stack>
          </Card>
        </Container>
      </Section>
    );
  }

  if (!job) {
    return null;
  }

  const statusConfig = {
    SCHEDULED: { variant: 'primary' as const, color: 'border-l-[var(--primary-500)]' },
    IN_PROGRESS: { variant: 'warning' as const, color: 'border-l-[var(--warning-500)]' },
    COMPLETED: { variant: 'success' as const, color: 'border-l-[var(--success-500)]' },
  };

  const config = statusConfig[job.status];

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Link href="/jobs" className="mb-6 inline-block">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            Back to Jobs
          </Button>
        </Link>

        {/* Header */}
        <Card variant="elevated" padding="lg" className={cn('mb-8 border-l-4', config.color)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--gray-900)] mb-2">
                Job Details
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[var(--gray-600)]">
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
                  <span className="font-medium text-sm sm:text-base truncate">
                    {new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {job.scheduledTime && (
                  <>
                    <span className="hidden sm:inline text-[var(--gray-400)]">•</span>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium text-sm sm:text-base">{job.scheduledTime}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Badge variant={config.variant} size="lg">
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </Card>

        {error && (
          <Card
            variant="outlined"
            padding="md"
            className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]"
          >
            <Stack direction="row" spacing="sm" align="center">
              <svg
                className="w-5 h-5 text-[var(--error-600)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-[var(--error-900)] font-semibold">{error}</span>
            </Stack>
          </Card>
        )}

        <Grid cols={1} gap="lg" className="lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 overflow-x-hidden">
            {/* Job Information - Role-specific */}
            {isOwner ? (
              <OwnerJobInfo job={job} />
            ) : (
              <Card variant="elevated" padding="lg">
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-6">Job Information</h2>
                <Stack spacing="md">
                  <div>
                    <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Job Type</p>
                    <p className="text-lg font-bold text-[var(--gray-900)]">
                      {job.type.replace('_', ' ')}
                    </p>
                  </div>
                  {job.frequency && (
                    <div>
                      <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Frequency</p>
                      <p className="text-lg font-bold text-[var(--gray-900)]">
                        {job.frequency.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                </Stack>
              </Card>
            )}

            {/* Client Information */}
            <Card variant="elevated" padding="lg">
              <Stack direction="row" spacing="sm" align="center" className="mb-6">
                <Avatar name={job.client.name} size="md" />
                <h2 className="text-xl font-bold text-[var(--gray-900)]">Client Information</h2>
              </Stack>
              <Stack spacing="md">
                <div>
                  <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Client Name</p>
                  <Link href={`/clients/${job.client.id}`}>
                    <p className="text-lg font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)]">
                      {job.client.name}
                    </p>
                  </Link>
                </div>
                {job.client.phone && (
                  <div>
                    <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Phone</p>
                    <a
                      href={`tel:${job.client.phone}`}
                      className="text-lg font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)]"
                    >
                      {job.client.phone}
                    </a>
                  </div>
                )}
                {job.client.address && (
                  <div>
                    <p className="text-sm font-medium text-[var(--gray-500)] mb-1">Address</p>
                    <Stack direction="row" spacing="sm" align="start">
                      <p className="text-lg font-bold text-[var(--gray-900)] flex-1">
                        {job.client.address}
                      </p>
                      {isCleaner && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(job.client.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium text-sm"
                        >
                          <Button variant="ghost" size="sm">
                            Open Maps
                          </Button>
                        </a>
                      )}
                    </Stack>
                  </div>
                )}
                {job.client.notes &&
                  (job.client.notes.keySafe ||
                    job.client.notes.alarmCode ||
                    job.client.notes.pets ||
                    job.client.notes.preferences) && (
                    <div className="mt-4 pt-4 border-t border-[var(--gray-200)]">
                      <Stack direction="row" spacing="sm" align="center" className="mb-4">
                        <svg
                          className="w-5 h-5 text-[var(--primary-600)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-[var(--gray-700)] uppercase tracking-wide">
                          Secure Notes
                        </p>
                      </Stack>
                      <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                        <Stack spacing="sm">
                          {job.client.notes.keySafe && (
                            <div>
                              <span className="text-sm font-bold text-[var(--gray-700)]">
                                Key Safe:{' '}
                              </span>
                              <span className="text-[var(--gray-900)] font-medium">
                                {job.client.notes.keySafe}
                              </span>
                            </div>
                          )}
                          {job.client.notes.alarmCode && (
                            <div>
                              <span className="text-sm font-bold text-[var(--gray-700)]">
                                Alarm Code:{' '}
                              </span>
                              <span className="text-[var(--gray-900)] font-medium">
                                {job.client.notes.alarmCode}
                              </span>
                            </div>
                          )}
                          {job.client.notes.pets && (
                            <div>
                              <span className="text-sm font-bold text-[var(--gray-700)]">
                                Pets:{' '}
                              </span>
                              <span className="text-[var(--gray-900)] font-medium">
                                {job.client.notes.pets}
                              </span>
                            </div>
                          )}
                          {job.client.notes.preferences && (
                            <div>
                              <span className="text-sm font-bold text-[var(--gray-700)]">
                                Preferences:{' '}
                              </span>
                              <span className="text-[var(--gray-900)] font-medium">
                                {job.client.notes.preferences}
                              </span>
                            </div>
                          )}
                        </Stack>
                      </Card>
                    </div>
                  )}
              </Stack>
            </Card>

            {/* Checklist */}
            {job.checklist && job.checklist.length > 0 && (
              <Card variant="elevated" padding="lg">
                <JobChecklist
                  jobId={job.id}
                  checklist={job.checklist}
                  onUpdate={() => {
                    jobQuery.refetch();
                    showToast('Checklist updated', 'success');
                  }}
                  onError={(error) => {
                    showToast(error, 'error');
                  }}
                />
              </Card>
            )}

            {/* Photos */}
            <Card variant="elevated" padding="lg">
              <Stack direction="row" justify="between" align="center" className="mb-6">
                <h2 className="text-xl font-bold text-[var(--gray-900)]">Photos</h2>
                {isOwner && job.photos && job.photos.length > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      try {
                        showToast('Preparing photos...', 'info');
                        const { shareJobPhotos } = await import('@/lib/whatsapp-share');
                        await shareJobPhotos(job.id, job.client.name);
                        showToast('Photos ready! Select WhatsApp from share menu.', 'success');
                      } catch (error: unknown) {
                        const errorMessage =
                          error instanceof Error ? error.message : 'Failed to share photos';
                        showToast(errorMessage, 'error');
                      }
                    }}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
                    leftIcon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    }
                  >
                    Send Photos
                  </Button>
                )}
              </Stack>
              <PhotoGallery photos={job.photos} />
              {/* Allow photo upload for cleaners OR owners completing jobs themselves */}
              {(isCleaner || (isOwner && !job.cleanerId)) && (
                <div className="mt-6 space-y-6 pt-6 border-t border-[var(--gray-200)]">
                  <PhotoUpload
                    jobId={job.id}
                    photoType="BEFORE"
                    onUploadSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(job.id) });
                      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
                      jobQuery.refetch();
                      showToast('Before photo uploaded successfully', 'success');
                    }}
                    onError={(error) => {
                      console.error('[PHOTO UPLOAD] Error:', error);
                      showToast(error, 'error');
                    }}
                  />
                  <PhotoUpload
                    jobId={job.id}
                    photoType="AFTER"
                    onUploadSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(job.id) });
                      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
                      jobQuery.refetch();
                      showToast('After photo uploaded successfully', 'success');
                    }}
                    onError={(error) => {
                      console.error('[PHOTO UPLOAD] Error:', error);
                      showToast(error, 'error');
                    }}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Role-specific */}
          <div className="space-y-6">
            {isCleaner ? (
              <CleanerJobDetail job={job} onStatusUpdate={updateStatus} updating={updating} />
            ) : isOwner ? (
              <OwnerJobDetail job={job} onStatusUpdate={updateStatus} updating={updating} />
            ) : null}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
