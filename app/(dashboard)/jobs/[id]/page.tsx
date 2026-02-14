'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid, Divider } from '@/components/layout';
import { Card, Button, Badge, Avatar, LoadingSkeleton, EmptyState } from '@/components/ui';
import dynamic from 'next/dynamic';

// Lazy load heavy components for code splitting
const PhotoUpload = dynamic(() => import('@/components/jobs/PhotoUpload'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  ssr: false,
});
const PhotoGallery = dynamic(() => import('@/components/jobs/PhotoGallery'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  ssr: false,
});
const JobChecklist = dynamic(() => import('@/components/jobs/JobChecklist'), {
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
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole, loading: roleLoading } = useUserRole();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  const isOwner = userRole?.role === 'OWNER';
  const isCleaner = userRole?.role === 'CLEANER';
  const { showToast } = useToast();

  useEffect(() => {
    if (params.id && !roleLoading) {
      loadJob();
    }
  }, [params.id, roleLoading]);

  const loadJob = async () => {
    try {
      setError(null);
      const data = await apiClient.get<Job>(`/jobs/${params.id}`);
      setJob(data);
    } catch (error: any) {
      console.error('Failed to load job:', error);
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        setError('Job not found. You may not have access to this job.');
      } else if (error.message?.includes('Access denied') || error.message?.includes('403')) {
        setError('You do not have permission to view this job.');
      } else {
        setError('Failed to load job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') => {
    if (!job) return;

    setUpdating(true);
    setError(null);

    try {
      const updatedJob = await apiClient.put<Job>(`/jobs/${job.id}`, {
        status: newStatus,
      });
      setJob(updatedJob);
      showToast(`Job status updated to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (error: any) {
      console.error('Failed to update job status:', error);
      const errorMessage = 'Failed to update job status. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setUpdating(false);
    }
  };

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
              <svg className="w-8 h-8 text-[var(--error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-2">Error</h2>
            <p className="text-[var(--gray-600)] mb-6">{error}</p>
            <Stack direction="row" spacing="md" justify="center">
              <Link href="/jobs">
                <Button variant="primary">Back to Jobs</Button>
              </Link>
              <Button variant="secondary" onClick={loadJob}>Try Again</Button>
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
          <Button variant="ghost" size="sm" leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }>
            Back to Jobs
          </Button>
        </Link>

        {/* Header */}
        <Card variant="elevated" padding="lg" className={cn('mb-8 border-l-4', config.color)}>
          <Stack direction="row" justify="between" align="start">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Job Details</h1>
              <Stack direction="row" spacing="md" align="center" className="text-[var(--gray-600)]">
                <Stack direction="row" spacing="sm" align="center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">
                    {new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </Stack>
                {job.scheduledTime && (
                  <>
                    <span className="text-[var(--gray-400)]">•</span>
                    <Stack direction="row" spacing="sm" align="center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{job.scheduledTime}</span>
                    </Stack>
                  </>
                )}
              </Stack>
            </div>
            <Badge variant={config.variant} size="lg">
              {job.status.replace('_', ' ')}
            </Badge>
          </Stack>
        </Card>

        {error && (
          <Card variant="outlined" padding="md" className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]">
            <Stack direction="row" spacing="sm" align="center">
              <svg className="w-5 h-5 text-[var(--error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[var(--error-900)] font-semibold">{error}</span>
            </Stack>
          </Card>
        )}

        <Grid cols={1} gap="lg" className="lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Information */}
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
                {isOwner && (
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
                )}
              </Stack>
            </Card>

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
                      <p className="text-lg font-bold text-[var(--gray-900)] flex-1">{job.client.address}</p>
                      {isCleaner && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(job.client.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium text-sm"
                        >
                          <Button variant="ghost" size="sm">Open Maps</Button>
                        </a>
                      )}
                    </Stack>
                  </div>
                )}
                {job.client.notes && (job.client.notes.keySafe || job.client.notes.alarmCode || job.client.notes.pets || job.client.notes.preferences) && (
                  <div className="mt-4 pt-4 border-t border-[var(--gray-200)]">
                    <Stack direction="row" spacing="sm" align="center" className="mb-4">
                      <svg className="w-5 h-5 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-sm font-semibold text-[var(--gray-700)] uppercase tracking-wide">Secure Notes</p>
                    </Stack>
                    <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                      <Stack spacing="sm">
                        {job.client.notes.keySafe && (
                          <div>
                            <span className="text-sm font-bold text-[var(--gray-700)]">Key Safe: </span>
                            <span className="text-[var(--gray-900)] font-medium">{job.client.notes.keySafe}</span>
                          </div>
                        )}
                        {job.client.notes.alarmCode && (
                          <div>
                            <span className="text-sm font-bold text-[var(--gray-700)]">Alarm Code: </span>
                            <span className="text-[var(--gray-900)] font-medium">{job.client.notes.alarmCode}</span>
                          </div>
                        )}
                        {job.client.notes.pets && (
                          <div>
                            <span className="text-sm font-bold text-[var(--gray-700)]">Pets: </span>
                            <span className="text-[var(--gray-900)] font-medium">{job.client.notes.pets}</span>
                          </div>
                        )}
                        {job.client.notes.preferences && (
                          <div>
                            <span className="text-sm font-bold text-[var(--gray-700)]">Preferences: </span>
                            <span className="text-[var(--gray-900)] font-medium">{job.client.notes.preferences}</span>
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
                    loadJob();
                    showToast('Checklist updated', 'success');
                  }}
                  onError={(error) => {
                    setError(error);
                    showToast(error, 'error');
                  }}
                />
              </Card>
            )}

            {/* Photos */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-6">Photos</h2>
              <PhotoGallery photos={job.photos} />
              {isCleaner && (
                <div className="mt-6 space-y-6 pt-6 border-t border-[var(--gray-200)]">
                  <PhotoUpload
                    jobId={job.id}
                    photoType="BEFORE"
                    onUploadSuccess={() => {
                      loadJob();
                      setError(null);
                      showToast('Before photo uploaded successfully', 'success');
                    }}
                    onError={(error) => {
                      setError(error);
                      showToast(error, 'error');
                    }}
                  />
                  <PhotoUpload
                    jobId={job.id}
                    photoType="AFTER"
                    onUploadSuccess={() => {
                      loadJob();
                      setError(null);
                      showToast('After photo uploaded successfully', 'success');
                    }}
                    onError={(error) => {
                      setError(error);
                      showToast(error, 'error');
                    }}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update - Cleaners */}
            {isCleaner && (
              <Card variant="elevated" padding="lg" className="sticky top-4">
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">Update Status</h2>
                <Stack spacing="md">
                  {job.status === 'SCHEDULED' && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => updateStatus('IN_PROGRESS')}
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
                      onClick={() => updateStatus('COMPLETED')}
                      isLoading={updating}
                      className="w-full"
                    >
                      Complete Job
                    </Button>
                  )}
                  {job.status === 'COMPLETED' && (
                    <Card variant="outlined" padding="md" className="bg-[var(--success-50)] border-[var(--success-200)]">
                      <Stack direction="row" spacing="sm" align="center" justify="center">
                        <svg className="w-5 h-5 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-[var(--success-800)] font-bold">Job Completed</p>
                      </Stack>
                    </Card>
                  )}
                </Stack>
              </Card>
            )}

            {/* Quick Actions - Owners */}
            {isOwner && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">Quick Actions</h2>
                <Stack spacing="md">
                  <Link href={`/clients/${job.client.id}`} className="w-full">
                    <Button variant="primary" size="lg" className="w-full">View Client</Button>
                  </Link>
                  {job.invoice ? (
                    <Link href={`/invoices/${job.invoice.id}`} className="w-full">
                      <Button variant="success" size="lg" className="w-full">View Invoice</Button>
                    </Link>
                  ) : (
                    <Link href={`/invoices/create?jobId=${job.id}`} className="w-full">
                      <Button variant="success" size="lg" className="w-full">Create Invoice</Button>
                    </Link>
                  )}
                </Stack>
              </Card>
            )}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
