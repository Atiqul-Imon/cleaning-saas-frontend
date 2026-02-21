'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useApiQuery, useApiMutation } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Divider } from '@/components/layout';
import {
  Card,
  Button,
  Input,
  Select,
  Checkbox,
  LoadingSkeleton,
  EmptyState,
} from '@/components/ui';

interface Cleaner {
  id: string;
  cleanerId: string;
  email: string;
  totalJobs: number;
  todayJobs: number;
}

interface Job {
  id: string;
  clientId: string;
  cleanerId?: string;
  type: 'ONE_OFF' | 'RECURRING';
  frequency?: 'WEEKLY' | 'BI_WEEKLY';
  scheduledDate: string;
  scheduledTime?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  reminderEnabled?: boolean;
  reminderTime?: string;
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const { canCreateJobs } = usePermissions();
  const { userRole } = useUserRole();
  const { showToast } = useToast();

  // Fetch job data
  const jobQuery = useApiQuery<Job>(queryKeys.jobs.detail(jobId), `/jobs/${jobId}`, {
    enabled: !!jobId && !!userRole,
  });

  // Fetch clients and cleaners
  const clientsQuery = useApiQuery<Array<{ id: string; name: string }>>(
    queryKeys.clients.all(userRole?.id),
    '/clients',
    {
      enabled: !!userRole,
    },
  );

  const cleanersQuery = useApiQuery<Cleaner[]>(
    queryKeys.business.cleaners(userRole?.id),
    '/business/cleaners',
    {
      enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  const clients = clientsQuery.data || [];
  const cleaners = cleanersQuery.data || [];
  const job = jobQuery.data;

  // Form state - derive initial state from job data
  const [formData, setFormData] = useState<{
    clientId: string;
    cleanerId?: string;
    type: 'ONE_OFF' | 'RECURRING';
    frequency?: 'WEEKLY' | 'BI_WEEKLY';
    scheduledDate: string;
    scheduledTime: string;
    reminderEnabled: boolean;
    reminderTime: string;
  }>(() => {
    if (job) {
      return {
        clientId: job.clientId,
        cleanerId: job.cleanerId || '',
        type: job.type,
        frequency: job.frequency,
        scheduledDate: new Date(job.scheduledDate).toISOString().split('T')[0],
        scheduledTime: job.scheduledTime || '',
        reminderEnabled: job.reminderEnabled !== false,
        reminderTime: job.reminderTime || '1 day',
      };
    }
    return {
      clientId: '',
      cleanerId: '',
      type: 'ONE_OFF',
      frequency: undefined,
      scheduledDate: '',
      scheduledTime: '',
      reminderEnabled: true,
      reminderTime: '1 day',
    };
  });

  // Update form when job data changes (only if job ID changes)
  const prevJobIdRef = useRef<string | undefined>(job?.id);
  useEffect(() => {
    if (job && job.id !== prevJobIdRef.current) {
      prevJobIdRef.current = job.id;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setFormData({
          clientId: job.clientId,
          cleanerId: job.cleanerId || '',
          type: job.type,
          frequency: job.frequency,
          scheduledDate: new Date(job.scheduledDate).toISOString().split('T')[0],
          scheduledTime: job.scheduledTime || '',
          reminderEnabled: job.reminderEnabled !== false,
          reminderTime: job.reminderTime || '1 day',
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id]);

  // Update job mutation
  const updateJobMutation = useApiMutation<Job, Partial<typeof formData>>({
    endpoint: `/jobs/${jobId}`,
    method: 'PUT',
    invalidateQueries: [
      queryKeys.jobs.detail(jobId),
      queryKeys.jobs.all(userRole?.id),
      ['dashboard', 'stats'],
    ],
    mutationOptions: {
      onSuccess: () => {
        showToast('Job updated successfully!', 'success');
        router.push(`/jobs/${jobId}`);
      },
      onError: (error) => {
        const errorMessage = (error as Error)?.message || 'Failed to update job. Please try again.';
        showToast(errorMessage, 'error');
      },
    },
  });

  useEffect(() => {
    if (!canCreateJobs) {
      router.push('/dashboard');
    }
  }, [canCreateJobs, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // UpdateJobDto only allows: cleanerId, scheduledDate, scheduledTime, status, reminderEnabled, reminderTime
    const updateData: any = {
      cleanerId: formData.cleanerId || null,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime || undefined,
      reminderEnabled: formData.reminderEnabled,
      reminderTime: formData.reminderTime,
    };

    updateJobMutation.mutate(updateData);
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loading = jobQuery.isLoading || clientsQuery.isLoading || cleanersQuery.isLoading;

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

  if (jobQuery.error) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <EmptyState
            variant="error"
            title="Error Loading Job"
            description={(jobQuery.error as Error)?.message || 'Failed to load job'}
            action={{
              label: 'Back to Jobs',
              href: '/jobs',
            }}
          />
        </Container>
      </Section>
    );
  }

  if (!job) {
    return null;
  }

  // Can't edit completed jobs
  if (job.status === 'COMPLETED') {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <Card variant="elevated" padding="lg" className="text-center">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-2">
              Cannot Edit Completed Job
            </h2>
            <p className="text-[var(--gray-600)] mb-6">
              Completed jobs cannot be edited. You can view the job details instead.
            </p>
            <Link href={`/jobs/${jobId}`}>
              <Button variant="primary">View Job</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Link href={`/jobs/${jobId}`} className="mb-6 inline-block">
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
            Back to Job
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Edit Job</h1>
          <p className="text-[var(--gray-600)] text-lg">Update job details and scheduling</p>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit}>
            <Stack spacing="lg">
              <div>
                <label className="block text-sm font-semibold text-[var(--gray-900)] mb-2">
                  Client
                </label>
                <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                  <p className="text-lg font-bold text-[var(--gray-900)]">
                    {clients.find((c) => c.id === formData.clientId)?.name || 'Unknown Client'}
                  </p>
                  <p className="text-sm text-[var(--gray-500)] mt-1">
                    Client cannot be changed after job creation
                  </p>
                </Card>
              </div>

              <Select
                label="Assign to Staff Member"
                id="cleanerId"
                value={formData.cleanerId || ''}
                onChange={(e) => updateField('cleanerId', e.target.value || undefined)}
                options={[
                  { value: '', label: 'No assignment (unassigned job)' },
                  ...cleaners.map((cleaner) => ({
                    value: cleaner.cleanerId,
                    label: `${cleaner.email}${cleaner.todayJobs > 0 ? ` (${cleaner.todayJobs} jobs today)` : ''}`,
                  })),
                ]}
                helperText={
                  cleaners.length === 0
                    ? 'No staff members available yet. Jobs can be created without assignment and assigned later.'
                    : undefined
                }
              />

              <Divider spacing="md" />

              <div>
                <label className="block text-sm font-semibold text-[var(--gray-900)] mb-2">
                  Job Type
                </label>
                <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                  <p className="text-base sm:text-lg font-bold text-[var(--gray-900)] break-words">
                    {formData.type.replace('_', ' ')}
                    {formData.type === 'RECURRING' && formData.frequency
                      ? ` - ${formData.frequency.replace('_', ' ')}`
                      : ''}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--gray-500)] mt-1">
                    Job type cannot be changed after creation
                  </p>
                </Card>
              </div>

              <Divider spacing="md" />

              <Input
                label="Scheduled Date"
                type="date"
                id="scheduledDate"
                required
                value={formData.scheduledDate}
                onChange={(e) => updateField('scheduledDate', e.target.value)}
              />

              <Input
                label="Scheduled Time (Optional)"
                type="time"
                id="scheduledTime"
                value={formData.scheduledTime}
                onChange={(e) => updateField('scheduledTime', e.target.value)}
              />

              <Divider spacing="md" />

              <div>
                <label className="block text-sm font-semibold text-[var(--gray-900)] mb-4">
                  Reminder Settings
                </label>
                <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                  <Stack spacing="md">
                    <Checkbox
                      id="reminderEnabled"
                      checked={formData.reminderEnabled}
                      onChange={(e) => updateField('reminderEnabled', e.target.checked)}
                      label="Enable reminder notifications"
                    />
                    {formData.reminderEnabled && (
                      <Select
                        label="Reminder Time"
                        id="reminderTime"
                        value={formData.reminderTime}
                        onChange={(e) => updateField('reminderTime', e.target.value)}
                        options={[
                          { value: '1 hour', label: '1 hour before' },
                          { value: '2 hours', label: '2 hours before' },
                          { value: '1 day', label: '1 day before' },
                          { value: '2 days', label: '2 days before' },
                        ]}
                      />
                    )}
                  </Stack>
                </Card>
              </div>

              <Stack
                direction="row"
                spacing="md"
                justify="end"
                className="flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link href={`/jobs/${jobId}`} className="w-full sm:w-auto">
                  <Button variant="secondary" type="button" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={updateJobMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Update Job
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
