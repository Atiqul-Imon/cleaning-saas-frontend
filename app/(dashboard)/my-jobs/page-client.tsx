'use client';

import { useState, useMemo } from 'react';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Container, Grid, Stack, Section, PageHeader } from '@/components/layout';
import { Card, Select, LoadingSkeleton } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';

interface Job {
  id: string;
  type: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  client: {
    id: string;
    name: string;
  };
}

export default function MyJobsPageClient() {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
  >('all');
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'status'>('date');
  const { userRole, loading: roleLoading } = useUserRole();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useApiQuery<Job[]>(['jobs', userRole?.id || ''], '/jobs', {
    enabled: !!userRole,
  });

  const loading = roleLoading || isLoading;

  // Client-side filtering and sorting
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
      } else if (sortBy === 'client') {
        return a.client.name.localeCompare(b.client.name);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

    return filtered;
  }, [jobs, statusFilter, sortBy]);

  // Count jobs by status
  const statusCounts = useMemo(() => {
    return {
      all: jobs.length,
      SCHEDULED: jobs.filter((j) => j.status === 'SCHEDULED').length,
      IN_PROGRESS: jobs.filter((j) => j.status === 'IN_PROGRESS').length,
      COMPLETED: jobs.filter((j) => j.status === 'COMPLETED').length,
    };
  }, [jobs]);

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton
            type="card"
            count={6}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Error Loading Jobs
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  {(error as Error)?.message || 'Failed to load jobs'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[var(--primary-600)] text-white rounded-lg hover:bg-[var(--primary-700)] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          {/* Page Header */}
          <PageHeader title="My Jobs" description="View and manage your assigned cleaning jobs" />

          {/* Filters */}
          <Card variant="elevated" padding="md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED',
                  )
                }
                options={[
                  { label: `All (${statusCounts.all})`, value: 'all' },
                  { label: `Scheduled (${statusCounts.SCHEDULED})`, value: 'SCHEDULED' },
                  { label: `In Progress (${statusCounts.IN_PROGRESS})`, value: 'IN_PROGRESS' },
                  { label: `Completed (${statusCounts.COMPLETED})`, value: 'COMPLETED' },
                ]}
              />
              <Select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'client' | 'status')}
                options={[
                  { label: 'Date', value: 'date' },
                  { label: 'Client', value: 'client' },
                  { label: 'Status', value: 'status' },
                ]}
              />
            </div>
          </Card>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[var(--gray-400)]"
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
                  <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                    {statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs assigned yet'}
                  </h3>
                  <p className="text-[var(--gray-600)]">
                    {statusFilter !== 'all'
                      ? 'Try adjusting your filter criteria'
                      : 'You will see jobs here once they are assigned to you by the business owner'}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Grid cols={3} gap="md">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  client={job.client}
                  type={job.type}
                  scheduledDate={job.scheduledDate}
                  scheduledTime={job.scheduledTime}
                  status={job.status}
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
