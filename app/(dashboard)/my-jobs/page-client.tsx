'use client';

import { useState, useMemo } from 'react';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Container, Grid, Stack, Section } from '@/components/layout';
import { Card, Input, Select, LoadingSkeleton, EmptyState } from '@/components/ui';
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
  const [searchQuery, setSearchQuery] = useState('');
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

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

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
  }, [jobs, searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={6} />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <EmptyState
            title="Error Loading Jobs"
            description={(error as Error)?.message || 'Failed to load jobs'}
            action={{
              label: 'Try Again',
              onClick: () => window.location.reload(),
            }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">My Jobs</h1>
              <p className="text-[var(--gray-600)] text-lg">
                View and manage your assigned cleaning jobs
              </p>
            </div>
          </Stack>

          {/* Filters */}
          <Card variant="elevated" padding="md">
            <Grid cols={3} gap="md">
              <Input
                placeholder="Search by client or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED',
                  )
                }
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Scheduled', value: 'SCHEDULED' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Completed', value: 'COMPLETED' },
                ]}
              />
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'client' | 'status')}
                options={[
                  { label: 'Date', value: 'date' },
                  { label: 'Client', value: 'client' },
                  { label: 'Status', value: 'status' },
                ]}
              />
            </Grid>
          </Card>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              title={
                searchQuery || statusFilter !== 'all'
                  ? 'No jobs match your filters'
                  : 'No jobs assigned yet'
              }
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You will see jobs here once they are assigned to you by the business owner'
              }
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          ) : (
            <Grid cols={1} gap="md">
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
