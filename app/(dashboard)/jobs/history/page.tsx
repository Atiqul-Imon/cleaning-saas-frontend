'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Section, Grid } from '@/components/layout';
import { Card, Button, LoadingSkeleton, EmptyState } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';

interface Job {
  id: string;
  type: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: string;
  client: {
    id: string;
    name: string;
  };
  updatedAt: string;
}

export default function JobHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('week');
  const { userRole, loading: roleLoading } = useUserRole();

  // Fetch all jobs using React Query
  const jobsQuery = useApiQuery<Job[]>(queryKeys.jobs.all(userRole?.id), '/jobs', {
    enabled: !!userRole,
  });

  const allJobs = jobsQuery.data || [];
  const loading = jobsQuery.isLoading || roleLoading;
  const isCleaner = userRole?.role === 'CLEANER';

  // Client-side filtering (using useMemo for performance)
  const jobs = useMemo(() => {
    const completedJobs = allJobs.filter((job) => job.status === 'COMPLETED');

    const now = new Date();
    let filteredJobs = completedJobs;

    if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredJobs = completedJobs.filter((job) => new Date(job.updatedAt) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredJobs = completedJobs.filter((job) => new Date(job.updatedAt) >= monthAgo);
    }

    return filteredJobs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [allJobs, filter]);

  if (loading || roleLoading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={5} />
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
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">
            {isCleaner ? 'My Job History' : 'Job History'}
          </h1>
          <p className="text-[var(--gray-600)] text-lg">View your completed jobs</p>
        </div>

        {/* Filter Tabs */}
        <Card variant="elevated" padding="md" className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            <Button
              variant={filter === 'week' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setFilter('week')}
              className="min-w-[120px]"
            >
              Last 7 Days
            </Button>
            <Button
              variant={filter === 'month' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setFilter('month')}
              className="min-w-[120px]"
            >
              Last 30 Days
            </Button>
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setFilter('all')}
              className="min-w-[120px]"
            >
              All Time
            </Button>
          </div>
        </Card>

        {jobs.length === 0 ? (
          <EmptyState
            variant="jobs"
            title="No completed jobs"
            description={
              filter === 'week'
                ? 'No jobs completed in the last 7 days'
                : filter === 'month'
                  ? 'No jobs completed in the last 30 days'
                  : 'No completed jobs yet'
            }
            hint="Completed jobs will appear here. Mark jobs as complete from the job detail page."
            action={{
              label: 'View All Jobs',
              href: '/jobs',
            }}
          />
        ) : (
          <Grid cols={1} gap="md">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                client={job.client}
                type={job.type}
                scheduledDate={job.scheduledDate}
                scheduledTime={job.scheduledTime}
                status="COMPLETED"
              />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}
