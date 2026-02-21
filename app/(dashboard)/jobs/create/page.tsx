'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useJobForm } from '@/features/jobs/hooks/useJobForm';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { Card, Button, Input, Select, LoadingSkeleton, EmptyState } from '@/components/ui';
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

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-3">Create New Job</h1>
          <p className="text-[var(--gray-600)] text-lg">Schedule a cleaning job for your client</p>
        </div>

        {clients.length === 0 ? (
          <EmptyState
            title="Add a client first"
            description="You need to add at least one client before creating a job"
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
                  strokeWidth={2.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            action={{
              label: 'Add Your First Client',
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

              <Stack spacing="xl">
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-[var(--gray-900)] pb-3 border-b-2 border-[var(--gray-200)]">
                    1. Basic Information
                  </h2>

                  <Select
                    label="Which client is this for?"
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
                    label="Who will do this job?"
                    id="cleanerId"
                    value={formData.cleanerId || ''}
                    onChange={(e) => updateField('cleanerId', e.target.value || undefined)}
                    options={[
                      { value: '', label: "I'll do it myself" },
                      ...cleaners.map((cleaner) => ({
                        value: cleaner.cleanerId,
                        label: `${cleaner.email}${cleaner.todayJobs > 0 ? ` (${cleaner.todayJobs} jobs today)` : ''}`,
                      })),
                    ]}
                    helperText={
                      cleaners.length === 0
                        ? 'No staff members yet. You can assign someone later.'
                        : undefined
                    }
                  />
                </div>

                {/* Section 2: Job Type */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-[var(--gray-900)] pb-3 border-b-2 border-[var(--gray-200)]">
                    2. Job Type
                  </h2>

                  <div>
                    <label className="block text-base font-bold text-[var(--gray-900)] mb-4">
                      How often? *
                    </label>
                    <Grid cols={1} gap="md" className="sm:grid-cols-2">
                      <Card
                        variant={formData.type === 'ONE_OFF' ? 'elevated' : 'outlined'}
                        padding="md"
                        hover
                        className={cn(
                          'cursor-pointer border-2 transition-all',
                          formData.type === 'ONE_OFF'
                            ? 'border-[var(--primary-600)] bg-[var(--primary-50)] ring-2 ring-[var(--primary-200)]'
                            : 'border-[var(--gray-200)] hover:border-[var(--primary-300)]',
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
                            className="h-6 w-6 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-2"
                          />
                          <div>
                            <p className="font-extrabold text-lg text-[var(--gray-900)]">
                              One-time job
                            </p>
                            <p className="text-sm text-[var(--gray-600)]">Just this once</p>
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
                            ? 'border-[var(--primary-600)] bg-[var(--primary-50)] ring-2 ring-[var(--primary-200)]'
                            : 'border-[var(--gray-200)] hover:border-[var(--primary-300)]',
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
                            className="h-6 w-6 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-2"
                          />
                          <div>
                            <p className="font-extrabold text-lg text-[var(--gray-900)]">
                              Repeating job
                            </p>
                            <p className="text-sm text-[var(--gray-600)]">Regular schedule</p>
                          </div>
                        </Stack>
                      </Card>
                    </Grid>
                  </div>

                  {formData.type === 'RECURRING' && (
                    <div>
                      <label className="block text-base font-bold text-[var(--gray-900)] mb-4">
                        How often do you repeat? *
                      </label>
                      <Grid cols={1} gap="md" className="sm:grid-cols-2">
                        <Card
                          variant={formData.frequency === 'WEEKLY' ? 'elevated' : 'outlined'}
                          padding="md"
                          hover
                          className={cn(
                            'cursor-pointer border-2 transition-all',
                            formData.frequency === 'WEEKLY'
                              ? 'border-[var(--primary-600)] bg-[var(--primary-50)] ring-2 ring-[var(--primary-200)]'
                              : 'border-[var(--gray-200)] hover:border-[var(--primary-300)]',
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
                              className="h-6 w-6 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-2"
                            />
                            <p className="font-extrabold text-lg text-[var(--gray-900)]">
                              Every week
                            </p>
                          </Stack>
                        </Card>
                        <Card
                          variant={formData.frequency === 'BI_WEEKLY' ? 'elevated' : 'outlined'}
                          padding="md"
                          hover
                          className={cn(
                            'cursor-pointer border-2 transition-all',
                            formData.frequency === 'BI_WEEKLY'
                              ? 'border-[var(--primary-600)] bg-[var(--primary-50)] ring-2 ring-[var(--primary-200)]'
                              : 'border-[var(--gray-200)] hover:border-[var(--primary-300)]',
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
                              className="h-6 w-6 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-2"
                            />
                            <p className="font-extrabold text-lg text-[var(--gray-900)]">
                              Every 2 weeks
                            </p>
                          </Stack>
                        </Card>
                      </Grid>
                    </div>
                  )}

                  {/* Smart suggestion when one-off is selected */}
                  {formData.type === 'ONE_OFF' && (
                    <div className="p-4 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-200)]">
                      <p className="text-sm text-[var(--gray-700)]">
                        Most clients schedule weekly.{' '}
                        <button
                          type="button"
                          onClick={() => updateField('type', 'RECURRING')}
                          className="font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] underline underline-offset-2"
                        >
                          Make this a repeating job?
                        </button>
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 3: When */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-[var(--gray-900)] pb-3 border-b-2 border-[var(--gray-200)]">
                    3. When?
                  </h2>

                  <div>
                    <label className="block text-base font-bold text-[var(--gray-900)] mb-4">
                      Pick a date *
                    </label>

                    {/* Quick Date Selection */}
                    <div className="mb-6">
                      <p className="text-sm text-[var(--gray-600)] mb-3 font-medium">Quick pick:</p>
                      <Grid cols={1} gap="sm" className="mb-6 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getTodayDateInput());
                          }}
                          className={cn(
                            'px-5 py-4 text-base rounded-xl border-2 transition-all font-bold min-h-[56px]',
                            formData.scheduledDate === getTodayDateInput()
                              ? 'bg-[var(--primary-600)] text-white border-[var(--primary-600)] shadow-lg'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-400)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getTomorrowDateInput());
                          }}
                          className={cn(
                            'px-5 py-4 text-base rounded-xl border-2 transition-all font-bold min-h-[56px]',
                            formData.scheduledDate === getTomorrowDateInput()
                              ? 'bg-[var(--primary-600)] text-white border-[var(--primary-600)] shadow-lg'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-400)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('scheduledDate', getNextWeekDateInput());
                          }}
                          className={cn(
                            'px-5 py-4 text-base rounded-xl border-2 transition-all font-bold min-h-[56px]',
                            formData.scheduledDate === getNextWeekDateInput()
                              ? 'bg-[var(--primary-600)] text-white border-[var(--primary-600)] shadow-lg'
                              : 'bg-white text-[var(--gray-700)] border-[var(--gray-300)] hover:border-[var(--primary-400)] hover:bg-[var(--primary-50)]',
                          )}
                        >
                          Next Week
                        </button>
                      </Grid>
                    </div>

                    <Grid cols={1} gap="lg" className="sm:grid-cols-2">
                      <div>
                        <Input
                          label="Or choose a specific date"
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
                                strokeWidth={2.5}
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
                          label="What time? (optional)"
                          id="scheduledTime"
                          type="time"
                          value={formData.scheduledTime || ''}
                          onChange={(e) =>
                            updateField('scheduledTime', e.target.value || undefined)
                          }
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
                                strokeWidth={2.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          }
                          helperText="Leave blank if time isn't important"
                        />

                        {/* Quick Time Selection */}
                        <div className="mt-4">
                          <p className="text-sm text-[var(--gray-600)] mb-2 font-medium">
                            Common times:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['09:00', '10:00', '12:00', '14:00', '16:00'].map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => updateField('scheduledTime', time)}
                                className={cn(
                                  'px-4 py-2.5 text-sm rounded-lg border-2 transition-all font-bold min-h-[48px]',
                                  formData.scheduledTime === time
                                    ? 'bg-[var(--primary-600)] text-white border-[var(--primary-600)]'
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
                </div>

                {/* Action Buttons */}
                <div className="pt-8 border-t-2 border-[var(--gray-200)]">
                  <Stack
                    direction="row"
                    spacing="md"
                    className="flex-col-reverse sm:flex-row gap-4"
                  >
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
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Create Job
                    </Button>
                  </Stack>
                </div>
              </Stack>
            </form>
          </Card>
        )}
      </Container>
    </Section>
  );
}
