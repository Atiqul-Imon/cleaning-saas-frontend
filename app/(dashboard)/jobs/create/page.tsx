'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid, Divider } from '@/components/layout';
import { Card, Button, Input, Select, Checkbox, LoadingSkeleton, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  phone?: string;
}

interface Cleaner {
  id: string;
  cleanerId: string;
  email: string;
  totalJobs: number;
  todayJobs: number;
}

export default function CreateJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('clientId');
  const [clients, setClients] = useState<Client[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useUserRole();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (userRole && userRole.role !== 'OWNER' && userRole.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [userRole, router]);

  const [formData, setFormData] = useState({
    clientId: clientIdParam || '',
    cleanerId: '',
    type: 'ONE_OFF' as 'ONE_OFF' | 'RECURRING',
    frequency: 'WEEKLY' as 'WEEKLY' | 'BI_WEEKLY',
    scheduledDate: '',
    scheduledTime: '',
  });

  useEffect(() => {
    loadClients();
    loadCleaners();
  }, []);

  const loadCleaners = async () => {
    try {
      const data = await apiClient.get<Cleaner[]>('/business/cleaners');
      setCleaners(data);
    } catch (error) {
      console.warn('Failed to load cleaners:', error);
      setCleaners([]);
    }
  };

  const loadClients = async () => {
    try {
      const data = await apiClient.get<Client[]>('/clients');
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
      setError('Failed to load clients. Please add a client first.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const jobData: any = {
        clientId: formData.clientId,
        type: formData.type,
        scheduledDate: formData.scheduledDate,
      };

      if (formData.cleanerId) {
        jobData.cleanerId = formData.cleanerId;
      }

      if (formData.scheduledTime) {
        jobData.scheduledTime = formData.scheduledTime;
      }

      if (formData.type === 'RECURRING') {
        jobData.frequency = formData.frequency;
      }

      await apiClient.post('/jobs', jobData);
      showToast('Job created successfully!', 'success');
      router.push('/jobs');
      router.refresh();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create job';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

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

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Create Job</h1>
          <p className="text-[var(--gray-600)] text-lg">
            Schedule a new cleaning job for a client
          </p>
        </div>

        {clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="You need to add a client before creating a job"
            icon={
              <svg className="w-16 h-16 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            action={{
              label: 'Add Client',
              href: '/clients/new',
            }}
          />
        ) : (
          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit}>
              {error && (
                <Card variant="outlined" padding="md" className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]">
                  <Stack direction="row" spacing="sm" align="center">
                    <svg className="w-5 h-5 text-[var(--error-600)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[var(--error-900)] font-semibold">{error}</span>
                  </Stack>
                </Card>
              )}

              <Stack spacing="lg">
                <Select
                  label="Client"
                  id="clientId"
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  options={[
                    { value: '', label: 'Select a client' },
                    ...clients.map((client) => ({
                      value: client.id,
                      label: client.name,
                    })),
                  ]}
                />

                <Select
                  label="Assign to Staff Member"
                  id="cleanerId"
                  value={formData.cleanerId}
                  onChange={(e) => setFormData({ ...formData, cleanerId: e.target.value })}
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
                  <label className="block text-sm font-semibold text-[var(--gray-900)] mb-4">
                    Job Type *
                  </label>
                  <Grid cols={2} gap="md">
                    <Card
                      variant={formData.type === 'ONE_OFF' ? 'elevated' : 'outlined'}
                      padding="md"
                      hover
                      className={cn(
                        'cursor-pointer border-2 transition-all',
                        formData.type === 'ONE_OFF'
                          ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                          : 'border-[var(--gray-200)]'
                      )}
                      onClick={() => setFormData({ ...formData, type: 'ONE_OFF' })}
                    >
                      <Stack direction="row" spacing="sm" align="center">
                        <input
                          type="radio"
                          name="type"
                          value="ONE_OFF"
                          checked={formData.type === 'ONE_OFF'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ONE_OFF' | 'RECURRING' })}
                          className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                        />
                        <div>
                          <p className="font-bold text-[var(--gray-900)]">One-off</p>
                          <p className="text-sm text-[var(--gray-600)]">Single cleaning appointment</p>
                        </div>
                      </Stack>
                    </Card>
                    <Card
                      variant={formData.type === 'RECURRING' ? 'elevated' : 'outlined'}
                      padding="md"
                      hover
                      className={cn(
                        'cursor-pointer border-2 transition-all',
                        formData.type === 'RECURRING'
                          ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                          : 'border-[var(--gray-200)]'
                      )}
                      onClick={() => setFormData({ ...formData, type: 'RECURRING' })}
                    >
                      <Stack direction="row" spacing="sm" align="center">
                        <input
                          type="radio"
                          name="type"
                          value="RECURRING"
                          checked={formData.type === 'RECURRING'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ONE_OFF' | 'RECURRING' })}
                          className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                        />
                        <div>
                          <p className="font-bold text-[var(--gray-900)]">Recurring</p>
                          <p className="text-sm text-[var(--gray-600)]">Automatically scheduled</p>
                        </div>
                      </Stack>
                    </Card>
                  </Grid>
                </div>

                {formData.type === 'RECURRING' && (
                  <div>
                    <label className="block text-sm font-semibold text-[var(--gray-900)] mb-4">
                      Frequency *
                    </label>
                    <Grid cols={2} gap="md">
                      <Card
                        variant={formData.frequency === 'WEEKLY' ? 'elevated' : 'outlined'}
                        padding="md"
                        hover
                        className={cn(
                          'cursor-pointer border-2 transition-all',
                          formData.frequency === 'WEEKLY'
                            ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                            : 'border-[var(--gray-200)]'
                        )}
                        onClick={() => setFormData({ ...formData, frequency: 'WEEKLY' })}
                      >
                        <Stack direction="row" spacing="sm" align="center">
                          <input
                            type="radio"
                            name="frequency"
                            value="WEEKLY"
                            checked={formData.frequency === 'WEEKLY'}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'WEEKLY' | 'BI_WEEKLY' })}
                            className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                          />
                          <p className="font-bold text-[var(--gray-900)]">Weekly</p>
                        </Stack>
                      </Card>
                      <Card
                        variant={formData.frequency === 'BI_WEEKLY' ? 'elevated' : 'outlined'}
                        padding="md"
                        hover
                        className={cn(
                          'cursor-pointer border-2 transition-all',
                          formData.frequency === 'BI_WEEKLY'
                            ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                            : 'border-[var(--gray-200)]'
                        )}
                        onClick={() => setFormData({ ...formData, frequency: 'BI_WEEKLY' })}
                      >
                        <Stack direction="row" spacing="sm" align="center">
                          <input
                            type="radio"
                            name="frequency"
                            value="BI_WEEKLY"
                            checked={formData.frequency === 'BI_WEEKLY'}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'WEEKLY' | 'BI_WEEKLY' })}
                            className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                          />
                          <p className="font-bold text-[var(--gray-900)]">Bi-weekly</p>
                        </Stack>
                      </Card>
                    </Grid>
                  </div>
                )}

                <Divider spacing="md" />

                <Grid cols={2} gap="md">
                  <Input
                    label="Scheduled Date"
                    id="scheduledDate"
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  <Input
                    label="Scheduled Time"
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    helperText="Optional"
                  />
                </Grid>

                <Divider spacing="md" />

                <Stack direction="row" spacing="md">
                  <Link href="/jobs" className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">Cancel</Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={submitting}
                    className="flex-1"
                  >
                    Create Job
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Card>
        )}
      </Container>
    </Section>
  );
}
