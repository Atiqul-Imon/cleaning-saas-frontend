'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useJobForm } from '@/features/jobs/hooks/useJobForm';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Stack, Section, Grid, Divider } from '@/components/layout';
import {
  Card,
  Button,
  Input,
  Select,
  Checkbox,
  LoadingSkeleton,
  EmptyState,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { getTodayDateInput, getTomorrowDateInput, getNextWeekDateInput } from '@/lib/date-utils';

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
  const { canCreateJobs } = usePermissions();
  const { userRole } = useUserRole();
  const [showQuickDates, setShowQuickDates] = useState(false);

  // Parallel fetching: Both clients and cleaners fetch simultaneously
  // They're independent queries, so React Query will run them in parallel
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
  const clientsLoading = clientsQuery.isLoading;
  const loadingCleaners = cleanersQuery.isLoading;

  // Use the form hook for job creation
  const { formData, updateField, errors, submit, isSubmitting } = useJobForm({
    clientId: clientIdParam || '',
  });

  useEffect(() => {
    if (!canCreateJobs) {
      router.push('/dashboard');
    }
  }, [canCreateJobs, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  const loading = clientsLoading || loadingCleaners;

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

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Create Job</h1>
          <p className="text-[var(--gray-600)] text-lg">Schedule a new cleaning job for a client</p>
        </div>

        {clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="You need to add a client before creating a job"
            icon={
              <svg
                className="w-16 h-16 text-[var(--gray-400)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
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
              {errors.length > 0 && (
                <Card
                  variant="outlined"
                  padding="md"
                  className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]"
                >
                  <Stack direction="row" spacing="sm" align="center">
                    <svg
                      className="w-5 h-5 text-[var(--error-600)] flex-shrink-0"
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
                    <div>
                      {errors.map((error, index) => (
                        <p key={index} className="text-[var(--error-900)] font-semibold">
                          {error}
                        </p>
                      ))}
                    </div>
                  </Stack>
                </Card>
              )}

              <Stack spacing="lg">
                <Select
                  label="Client"
                  id="clientId"
                  required
                  value={formData.clientId}
                  onChange={(e) => updateField('clientId', e.target.value)}
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
                  <label className="block text-sm font-semibold text-[var(--gray-900)] mb-4">
                    Job Type *
                  </label>
                  <Grid cols={1} gap="md" className="sm:grid-cols-2">
                    <Card
                      variant={formData.type === 'ONE_OFF' ? 'elevated' : 'outlined'}
                      padding="md"
                      hover
                      className={cn(
                        'cursor-pointer border-2 transition-all',
                        formData.type === 'ONE_OFF'
                          ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                          : 'border-[var(--gray-200)]',
                      )}
                      onClick={() => updateField('type', 'ONE_OFF')}
                    >
                      <Stack direction="row" spacing="sm" align="center">
                        <input
                          type="radio"
                          name="type"
                          value="ONE_OFF"
                          checked={formData.type === 'ONE_OFF'}
                          onChange={(e) =>
                            updateField('type', e.target.value as 'ONE_OFF' | 'RECURRING')
                          }
                          className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                        />
                        <div>
                          <p className="font-bold text-[var(--gray-900)]">One-off</p>
                          <p className="text-sm text-[var(--gray-600)]">
                            Single cleaning appointment
                          </p>
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
                          : 'border-[var(--gray-200)]',
                      )}
                      onClick={() => updateField('type', 'RECURRING')}
                    >
                      <Stack direction="row" spacing="sm" align="center">
                        <input
                          type="radio"
                          name="type"
                          value="RECURRING"
                          checked={formData.type === 'RECURRING'}
                          onChange={(e) =>
                            updateField('type', e.target.value as 'ONE_OFF' | 'RECURRING')
                          }
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
                    <Grid cols={1} gap="md" className="sm:grid-cols-2">
                      <Card
                        variant={formData.frequency === 'WEEKLY' ? 'elevated' : 'outlined'}
                        padding="md"
                        hover
                        className={cn(
                          'cursor-pointer border-2 transition-all',
                          formData.frequency === 'WEEKLY'
                            ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                            : 'border-[var(--gray-200)]',
                        )}
                        onClick={() => updateField('frequency', 'WEEKLY')}
                      >
                        <Stack direction="row" spacing="sm" align="center">
                          <input
                            type="radio"
                            name="frequency"
                            value="WEEKLY"
                            checked={formData.frequency === 'WEEKLY'}
                            onChange={(e) =>
                              updateField('frequency', e.target.value as 'WEEKLY' | 'BI_WEEKLY')
                            }
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
                            : 'border-[var(--gray-200)]',
                        )}
                        onClick={() => updateField('frequency', 'BI_WEEKLY')}
                      >
                        <Stack direction="row" spacing="sm" align="center">
                          <input
                            type="radio"
                            name="frequency"
                            value="BI_WEEKLY"
                            checked={formData.frequency === 'BI_WEEKLY'}
                            onChange={(e) =>
                              updateField('frequency', e.target.value as 'WEEKLY' | 'BI_WEEKLY')
                            }
                            className="h-5 w-5 text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                          />
                          <p className="font-bold text-[var(--gray-900)]">Bi-weekly</p>
                        </Stack>
                      </Card>
                    </Grid>
                  </div>
                )}

                <Divider spacing="md" />

                <div>
                  <label className="block text-sm font-semibold text-[var(--gray-900)] mb-3 break-words">
                    Schedule Date & Time *
                  </label>

                  {/* Quick Date Selection */}
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuickDates(!showQuickDates)}
                      className="mb-2"
                    >
                      {showQuickDates ? 'Hide' : 'Show'} Quick Date Options
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${showQuickDates ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>

                    {showQuickDates && (
                      <Grid cols={1} gap="sm" className="mb-4 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getTodayDateInput());
                            setShowQuickDates(false);
                          }}
                          className={cn(
                            'px-4 py-2 text-sm rounded-lg border transition-all font-medium',
                            formData.scheduledDate === getTodayDateInput()
                              ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getTomorrowDateInput());
                            setShowQuickDates(false);
                          }}
                          className={cn(
                            'px-4 py-2 text-sm rounded-lg border transition-all font-medium',
                            formData.scheduledDate === getTomorrowDateInput()
                              ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getNextWeekDateInput());
                            setShowQuickDates(false);
                          }}
                          className={cn(
                            'px-4 py-2 text-sm rounded-lg border transition-all font-medium',
                            formData.scheduledDate === getNextWeekDateInput()
                              ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Next Week
                        </button>
                      </Grid>
                    )}
                  </div>

                  <Grid cols={1} gap="md" className="sm:grid-cols-2">
                    <div>
                      <Input
                        label="Date"
                        id="scheduledDate"
                        type="date"
                        required
                        value={formData.scheduledDate}
                        onChange={(e) => updateField('scheduledDate', e.target.value)}
                        min={getTodayDateInput()}
                        leftIcon={
                          <svg
                            className="w-5 h-5"
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
                        }
                        helperText={
                          formData.scheduledDate
                            ? new Date(formData.scheduledDate).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'Select a date'
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Time"
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime || ''}
                        onChange={(e) => updateField('scheduledTime', e.target.value || undefined)}
                        leftIcon={
                          <svg
                            className="w-5 h-5"
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
                        }
                        helperText={
                          formData.scheduledTime
                            ? `Selected: ${formData.scheduledTime}`
                            : 'Optional - Select a time'
                        }
                      />

                      {/* Quick Time Selection */}
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {[
                            '09:00',
                            '10:00',
                            '11:00',
                            '12:00',
                            '13:00',
                            '14:00',
                            '15:00',
                            '16:00',
                            '17:00',
                          ].map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => updateField('scheduledTime', time)}
                              className={cn(
                                'px-3 py-1.5 text-sm rounded-lg border transition-all',
                                formData.scheduledTime === time
                                  ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                                  : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]',
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Grid>
                </div>

                <Divider spacing="md" />

                {/* Reminder Settings */}
                <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                  <Stack spacing="md">
                    <div>
                      <Checkbox
                        id="reminderEnabled"
                        label="Enable Job Reminders"
                        checked={formData.reminderEnabled !== false}
                        onChange={(e) => updateField('reminderEnabled', e.target.checked)}
                      />
                      <p className="text-sm text-[var(--gray-600)] mt-2">
                        Send automated reminders to client, cleaner, and business owner.
                      </p>
                    </div>
                    {formData.reminderEnabled !== false && (
                      <Select
                        label="Send Reminder"
                        id="reminderTime"
                        value={formData.reminderTime || '1 day'}
                        onChange={(e) => updateField('reminderTime', e.target.value)}
                        options={[
                          { value: '30 minutes', label: '30 minutes before job' },
                          { value: '1 hour', label: '1 hour before job' },
                          { value: '2 hours', label: '2 hours before job' },
                          { value: '1 day', label: '1 day before job' },
                          { value: '2 days', label: '2 days before job' },
                        ]}
                        helperText="Choose when to send the reminder."
                      />
                    )}
                  </Stack>
                </Card>

                <Divider spacing="md" />

                <Stack direction="row" spacing="md" className="flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/jobs" className="w-full sm:flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:flex-1"
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
