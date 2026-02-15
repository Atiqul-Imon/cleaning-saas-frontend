'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useJobs } from '@/features/jobs/hooks/useJobs';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Container, Grid, Stack, Section } from '@/components/layout';
import { Card, Button, Input, Select, LoadingSkeleton, EmptyState } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';

export default function JobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'status'>('date');
  const { jobs, isLoading, error, userRole } = useJobs();

  const { canCreateJobs } = usePermissions();
  const loading = isLoading;

  // Redirect cleaners to their dedicated page
  useEffect(() => {
    if (!loading && userRole?.role === 'CLEANER') {
      router.replace('/my-jobs');
    }
  }, [loading, userRole, router]);

  // Client-side filtering and sorting (using useMemo for performance)
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.type.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Note: Job status updates are handled in the job detail page
  // This page is now focused on listing and filtering jobs

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
              <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Jobs</h1>
              <p className="text-[var(--gray-600)] text-lg">
                Manage all your cleaning jobs
              </p>
            </div>
            {canCreateJobs && (
              <Link href="/jobs/create">
                <Button variant="primary" size="lg" leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }>
                  Create Job
                </Button>
              </Link>
            )}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
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
                onChange={(e) => setSortBy(e.target.value as any)}
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
              title={searchQuery || statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs yet'}
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first job to get started'
              }
              icon={
                <svg className="w-16 h-16 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              action={
                !searchQuery && statusFilter === 'all'
                  ? {
                      label: 'Create First Job',
                      href: '/jobs/create',
                    }
                  : undefined
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
                  cleaner={job.cleaner}
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
