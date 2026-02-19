'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('week');
  const { userRole, loading: roleLoading } = useUserRole();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  const isCleaner = userRole?.role === 'CLEANER';

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await apiClient.get<Job[]>('/jobs');

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

      filteredJobs.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Failed to load job history:', error);
    } finally {
      setLoading(false);
    }
  };

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
            title="No completed jobs"
            description={
              filter === 'week'
                ? 'No jobs completed in the last 7 days'
                : filter === 'month'
                  ? 'No jobs completed in the last 30 days'
                  : 'No completed jobs yet'
            }
            icon={
              <div className="bg-[var(--success-100)] w-20 h-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--success-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            }
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
