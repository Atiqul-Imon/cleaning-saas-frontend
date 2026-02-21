'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useJobs } from '@/features/jobs/hooks/useJobs';
import { jobsApi } from '@/features/jobs/services/jobs.api';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Container, Grid, Stack, Section, PageHeader } from '@/components/layout';
import { Card, Button, LoadingSkeleton, Select, EmptyState } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';
import { useToast } from '@/lib/toast-context';

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
  >((searchParams.get('status') as 'all' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') || 'all');
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'status'>('date');
  const queryClient = useQueryClient();
  const { jobs, isLoading, error, userRole, refetch, isRefreshing } = useJobs();

  const { canCreateJobs } = usePermissions();
  const loading = isLoading;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleBulkMarkComplete = async () => {
    const ids = Array.from(selectedIds);
    const completable = filteredJobs.filter((j) => ids.includes(j.id) && j.status !== 'COMPLETED');
    if (completable.length === 0) {
      showToast('No jobs to mark complete', 'error');
      return;
    }
    setBulkUpdating(true);
    try {
      await Promise.all(completable.map((j) => jobsApi.update(j.id, { status: 'COMPLETED' })));
      showToast(
        `${completable.length} job${completable.length === 1 ? '' : 's'} marked complete`,
        'success',
      );
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      showToast('Failed to update some jobs', 'error');
    } finally {
      setBulkUpdating(false);
    }
  };

  // Initialize status filter from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(statusParam)) {
      setStatusFilter(statusParam as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED');
    }
  }, [searchParams]);

  // Redirect cleaners to their dedicated page
  useEffect(() => {
    if (!loading && userRole?.role === 'CLEANER') {
      router.replace('/my-jobs');
    }
  }, [loading, userRole, router]);

  // Client-side filtering and sorting (using useMemo for performance)
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

  // Group jobs by status for smart grouping
  const groupedJobs = useMemo(() => {
    const groups = {
      SCHEDULED: [] as typeof jobs,
      IN_PROGRESS: [] as typeof jobs,
      COMPLETED: [] as typeof jobs,
    };

    filteredJobs.forEach((job) => {
      if (groups[job.status as keyof typeof groups]) {
        groups[job.status as keyof typeof groups].push(job);
      }
    });

    return groups;
  }, [filteredJobs]);

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
          <LoadingSkeleton type="card" count={6} />
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
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
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
          <PageHeader
            title="Jobs"
            description="Manage all your cleaning jobs"
            onRefresh={() => {
              void refetch();
            }}
            isRefreshing={isRefreshing}
            actions={
              <div className="flex gap-2 flex-wrap">
                {selectionMode ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={clearSelection}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setSelectionMode(true)}
                      className="w-full sm:w-auto"
                    >
                      Select
                    </Button>
                    {canCreateJobs && (
                      <Link href="/jobs/create">
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full sm:w-auto"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          }
                        >
                          Create Job
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            }
          />

          {/* Filters */}
          <Card variant="elevated" padding="md">
            <Stack spacing="md">
              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Filter Dropdown */}
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

                {/* Sort Dropdown */}
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
            </Stack>
          </Card>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <Card variant="elevated" padding="lg">
              <EmptyState
                variant="jobs"
                title={statusFilter !== 'all' ? 'No jobs found' : 'No jobs yet'}
                description={
                  statusFilter !== 'all'
                    ? 'Try changing your filter or create a new job'
                    : 'Get started by creating your first cleaning job'
                }
                hint={
                  statusFilter === 'all'
                    ? "Jobs are created for clients. Add a client first if you haven't yet."
                    : undefined
                }
                action={
                  statusFilter === 'all' && canCreateJobs
                    ? { label: 'Create Your First Job', href: '/jobs/create' }
                    : undefined
                }
              />
            </Card>
          ) : (
            <Stack spacing="lg">
              {/* Show grouped view when "all" is selected, otherwise show filtered list */}
              {statusFilter === 'all' ? (
                <>
                  {/* Scheduled Jobs */}
                  {groupedJobs.SCHEDULED.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[var(--gray-900)]">
                          Scheduled ({groupedJobs.SCHEDULED.length})
                        </h2>
                        <Link href="/jobs?status=SCHEDULED">
                          <Button variant="ghost" size="sm">
                            View All
                          </Button>
                        </Link>
                      </div>
                      <Grid cols={3} gap="md">
                        {groupedJobs.SCHEDULED.slice(0, 5).map((job) => (
                          <JobCard
                            key={job.id}
                            id={job.id}
                            client={job.client}
                            type={job.type}
                            scheduledDate={job.scheduledDate}
                            scheduledTime={job.scheduledTime}
                            status={job.status}
                            cleaner={job.cleaner}
                            selectable={selectionMode}
                            selected={selectedIds.has(job.id)}
                            onSelect={() => toggleSelect(job.id)}
                          />
                        ))}
                      </Grid>
                    </div>
                  )}

                  {/* In Progress Jobs */}
                  {groupedJobs.IN_PROGRESS.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[var(--gray-900)]">
                          In Progress ({groupedJobs.IN_PROGRESS.length})
                        </h2>
                        <Link href="/jobs?status=IN_PROGRESS">
                          <Button variant="ghost" size="sm">
                            View All
                          </Button>
                        </Link>
                      </div>
                      <Grid cols={3} gap="md">
                        {groupedJobs.IN_PROGRESS.slice(0, 5).map((job) => (
                          <JobCard
                            key={job.id}
                            id={job.id}
                            client={job.client}
                            type={job.type}
                            scheduledDate={job.scheduledDate}
                            scheduledTime={job.scheduledTime}
                            status={job.status}
                            cleaner={job.cleaner}
                            selectable={selectionMode}
                            selected={selectedIds.has(job.id)}
                            onSelect={() => toggleSelect(job.id)}
                          />
                        ))}
                      </Grid>
                    </div>
                  )}

                  {/* Completed Jobs */}
                  {groupedJobs.COMPLETED.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[var(--gray-900)]">
                          Completed ({groupedJobs.COMPLETED.length})
                        </h2>
                        <Link href="/jobs?status=COMPLETED">
                          <Button variant="ghost" size="sm">
                            View All
                          </Button>
                        </Link>
                      </div>
                      <Grid cols={3} gap="md">
                        {groupedJobs.COMPLETED.slice(0, 5).map((job) => (
                          <JobCard
                            key={job.id}
                            id={job.id}
                            client={job.client}
                            type={job.type}
                            scheduledDate={job.scheduledDate}
                            scheduledTime={job.scheduledTime}
                            status={job.status}
                            cleaner={job.cleaner}
                            selectable={selectionMode}
                            selected={selectedIds.has(job.id)}
                            onSelect={() => toggleSelect(job.id)}
                          />
                        ))}
                      </Grid>
                    </div>
                  )}
                </>
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
                      cleaner={job.cleaner}
                      selectable={selectionMode}
                      selected={selectedIds.has(job.id)}
                      onSelect={() => toggleSelect(job.id)}
                    />
                  ))}
                </Grid>
              )}
            </Stack>
          )}
        </Stack>

        {/* Floating bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="fixed bottom-20 left-0 right-0 z-40 p-4 md:bottom-4 md:left-auto md:right-8 md:max-w-md md:rounded-xl shadow-elevated bg-white border-2 border-[var(--gray-200)]">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-[var(--gray-900)]">{selectedIds.size} selected</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="md" onClick={clearSelection}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBulkMarkComplete}
                  isLoading={bulkUpdating}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  }
                >
                  Mark complete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
