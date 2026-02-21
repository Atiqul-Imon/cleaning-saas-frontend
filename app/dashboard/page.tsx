'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { Container, Grid, Stack, Section } from '@/components/layout';
import { Card, Button, LoadingSkeleton, EmptyState } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { formatDateBritish, formatDateBritishFull } from '@/lib/date-utils';

// Lazy load dashboard components for code splitting
const StatCard = dynamic(
  () => import('@/features/dashboard/components').then((mod) => ({ default: mod.StatCard })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-24" />,
  },
);

const QuickAction = dynamic(
  () => import('@/features/dashboard/components').then((mod) => ({ default: mod.QuickAction })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-16" />,
  },
);

interface DashboardStats {
  todayJobs: number;
  monthlyEarnings: number;
  unpaidInvoices: number;
  todayJobsList: any[];
  role?: 'OWNER' | 'CLEANER' | 'ADMIN';
  businesses?: Business[];
  upcomingJobs?: any[];
  inProgressJobs?: any[];
  completedThisWeek?: number;
  recentJobs?: any[];
  recentClients?: any[];
  recentInvoices?: any[];
  totalJobs?: number;
  totalClients?: number;
  totalInvoices?: number;
}

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, loading: roleLoading } = useUserRole();

  const isOwner = userRole?.role === 'OWNER';
  const isCleaner = userRole?.role === 'CLEANER';
  const isAdmin = userRole?.role === 'ADMIN';

  // Parallel data fetching - both queries run simultaneously
  // Using query keys from factory for consistency
  // All hooks must be called before any conditional returns
  const businessQuery = useApiQuery<Business>(
    userRole?.id ? queryKeys.business.detail(userRole.id) : ['business', ''],
    userRole?.role === 'CLEANER' ? '/business/cleaners/my-business' : '/business',
    {
      enabled: !!userRole && (isOwner || isAdmin || isCleaner),
      retry: (failureCount, error: unknown) => {
        // Don't retry 404 errors (business not found)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          return false;
        }
        return failureCount < 1;
      },
    },
  );

  const statsQuery = useApiQuery<DashboardStats>(
    userRole?.id ? queryKeys.dashboard.stats(userRole.id) : ['dashboard', 'stats', ''],
    '/dashboard/stats',
    {
      enabled: !!userRole && (isOwner || isAdmin || isCleaner),
    },
  );

  // Redirect admins to admin panel immediately (before rendering)
  useEffect(() => {
    if (!roleLoading && isAdmin && pathname === '/dashboard') {
      router.replace('/admin');
    }
  }, [roleLoading, isAdmin, pathname, router]);

  // Handle redirect for owners without business
  useEffect(() => {
    if (
      userRole?.role === 'OWNER' &&
      !roleLoading &&
      businessQuery.isError &&
      pathname !== '/onboarding'
    ) {
      const errorMessage =
        businessQuery.error instanceof Error
          ? businessQuery.error.message
          : String(businessQuery.error || '');
      const is404Error =
        errorMessage.includes('404') ||
        errorMessage.includes('not found') ||
        errorMessage.toLowerCase().includes('business not found') ||
        errorMessage.toLowerCase().includes('no business');

      if (is404Error) {
        router.replace('/onboarding');
      }
    }
  }, [userRole, roleLoading, businessQuery.isError, businessQuery.error, pathname, router]);

  // Don't render dashboard content for admins (prevent flash)
  if (roleLoading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  // If admin, show loading while redirect happens (prevents flash)
  if (isAdmin) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  const loading = roleLoading || businessQuery.isLoading || statsQuery.isLoading;
  const business = businessQuery.data || null;
  const stats = statsQuery.data || null;
  const error = businessQuery.error || statsQuery.error;

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  if (error && !business && isOwner && pathname !== '/onboarding') {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <EmptyState
            variant="error"
            title="Error Loading Dashboard"
            description={(error as Error)?.message || 'Failed to load dashboard data'}
            hint="Check your connection and try again."
            action={{
              label: 'Try Again',
              onClick: () => {
                businessQuery.refetch();
                statsQuery.refetch();
              },
            }}
          />
        </Container>
      </Section>
    );
  }

  // Show empty state for owners without business (will redirect)
  if (isOwner && !business && !businessQuery.isLoading) {
    return null; // Redirect will happen in useEffect
  }

  // Get current date for hero section
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateString = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] p-6 sm:p-8 lg:p-10 text-white">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium opacity-90 mb-2">
                    {dayName}, {dateString}
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 break-words">
                    {isOwner || isAdmin
                      ? `Welcome back, ${business?.name || 'Business Owner'}!`
                      : isCleaner
                        ? 'Welcome back!'
                        : 'Welcome!'}
                  </h1>
                  <p className="text-base sm:text-lg opacity-90">
                    {isOwner || isAdmin
                      ? stats?.todayJobs
                        ? `You have ${stats.todayJobs} ${stats.todayJobs === 1 ? 'job' : 'jobs'} scheduled today`
                        : "Here's an overview of your business"
                      : isCleaner
                        ? stats?.todayJobs
                          ? `You have ${stats.todayJobs} ${stats.todayJobs === 1 ? 'job' : 'jobs'} scheduled today`
                          : 'Here are your jobs for today'
                        : 'Dashboard'}
                  </p>
                </div>
                {stats && (isOwner || isAdmin) && stats.todayJobs > 0 && (
                  <div className="flex-shrink-0">
                    <Link href="/jobs?status=SCHEDULED">
                      <button className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-semibold text-sm transition-all duration-200 border border-white/30">
                        View Today&apos;s Jobs
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
          </div>

          {/* Stats Cards - Simplified to 3 most important metrics */}
          {stats && (isOwner || isAdmin) && (
            <Grid cols={1} gap="lg" className="sm:grid-cols-3">
              <Link href="/jobs?status=SCHEDULED" className="block">
                <StatCard
                  title="Today's Jobs"
                  value={stats.todayJobs.toString()}
                  variant="primary"
                  highlight={stats.todayJobs > 0}
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  onClick={() => {}}
                />
              </Link>
              <StatCard
                title="This Month"
                value={`£${stats.monthlyEarnings.toFixed(0)}`}
                variant="success"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <Link href="/invoices?status=UNPAID" className="block">
                <StatCard
                  title="To Collect"
                  value={stats.unpaidInvoices.toString()}
                  variant="warning"
                  highlight={stats.unpaidInvoices > 0}
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  onClick={() => {}}
                />
              </Link>
            </Grid>
          )}

          {/* Cleaner Stats */}
          {stats && isCleaner && (
            <Grid cols={1} gap="lg" className="sm:grid-cols-2">
              <StatCard
                title="Today's Jobs"
                value={stats.todayJobs.toString()}
                variant="primary"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              {stats.completedThisWeek !== undefined && (
                <StatCard
                  title="Completed This Week"
                  value={stats.completedThisWeek.toString()}
                  variant="success"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              )}
            </Grid>
          )}

          {/* Quick Actions - Phase 4: Contextual workflow shortcuts */}
          {(isOwner || isAdmin) && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <QuickAction
                  title="Quick Job"
                  description="New job (fastest path)"
                  variant="primary"
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                  href="/jobs/create"
                />
                <QuickAction
                  title="Today's Schedule"
                  description="View scheduled jobs"
                  variant="info"
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  href="/jobs?status=SCHEDULED"
                />
                <QuickAction
                  title="Outstanding Invoices"
                  description="Unpaid to collect"
                  variant="warning"
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  href="/invoices?status=UNPAID"
                />
                <QuickAction
                  title="Add Client"
                  description="New client"
                  variant="success"
                  icon={
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  }
                  href="/clients/new"
                />
              </div>
            </div>
          )}

          {/* Today's Jobs List */}
          {stats && stats.todayJobsList && stats.todayJobsList.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--gray-900)]">Today&apos;s Jobs</h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    View All ({stats.totalJobs || 0})
                  </Button>
                </Link>
              </div>
              <Grid cols={3} gap="md">
                {stats.todayJobsList
                  .slice(0, 5)
                  .map(
                    (job: {
                      id: string;
                      client?: { id?: string; name: string; phone?: string; address?: string };
                      scheduledTime?: string;
                      scheduledDate?: string | Date;
                      status?: string;
                      type?: string;
                      cleaner?: { id?: string; email?: string };
                    }) => (
                      <JobCard
                        key={job.id}
                        id={job.id}
                        client={{
                          id: job.client?.id || job.id,
                          name: job.client?.name || 'Unknown Client',
                        }}
                        type={job.type || 'ONE_OFF'}
                        scheduledDate={
                          job.scheduledDate
                            ? new Date(job.scheduledDate).toISOString()
                            : new Date().toISOString()
                        }
                        scheduledTime={job.scheduledTime || ''}
                        status={
                          (job.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') || 'SCHEDULED'
                        }
                        cleaner={
                          job.cleaner?.email
                            ? { id: job.cleaner.id || '', email: job.cleaner.email }
                            : undefined
                        }
                      />
                    ),
                  )}
              </Grid>
            </div>
          )}

          {/* Upcoming Jobs for Owners */}
          {stats && (isOwner || isAdmin) && stats.upcomingJobs && stats.upcomingJobs.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] mb-1">
                    Upcoming Jobs
                  </h2>
                  <p className="text-sm text-[var(--gray-600)]">
                    {stats.upcomingJobs.length} {stats.upcomingJobs.length === 1 ? 'job' : 'jobs'}{' '}
                    scheduled in the next 30 days
                  </p>
                </div>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View All
                  </Button>
                </Link>
              </div>
              <Grid cols={3} gap="md">
                {stats.upcomingJobs
                  .slice(0, 5)
                  .map(
                    (job: {
                      id: string;
                      client?: { id?: string; name: string; phone?: string; address?: string };
                      scheduledDate?: string | Date;
                      scheduledTime?: string;
                      status?: string;
                      type?: string;
                      cleaner?: { id?: string; email?: string };
                    }) => (
                      <JobCard
                        key={job.id}
                        id={job.id}
                        client={{
                          id: job.client?.id || job.id,
                          name: job.client?.name || 'Unknown Client',
                        }}
                        type={job.type || 'ONE_OFF'}
                        scheduledDate={
                          job.scheduledDate
                            ? new Date(job.scheduledDate).toISOString()
                            : new Date().toISOString()
                        }
                        scheduledTime={job.scheduledTime || ''}
                        status={
                          (job.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') || 'SCHEDULED'
                        }
                        cleaner={
                          job.cleaner?.email
                            ? { id: job.cleaner.id || '', email: job.cleaner.email }
                            : undefined
                        }
                      />
                    ),
                  )}
              </Grid>
            </div>
          )}

          {/* In Progress Jobs for Owners */}
          {stats &&
            (isOwner || isAdmin) &&
            stats.inProgressJobs &&
            stats.inProgressJobs.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] mb-1">
                      In Progress Jobs
                    </h2>
                    <p className="text-sm text-[var(--gray-600)]">
                      {stats.inProgressJobs.length}{' '}
                      {stats.inProgressJobs.length === 1 ? 'job' : 'jobs'} currently in progress
                    </p>
                  </div>
                  <Link href="/jobs?status=IN_PROGRESS">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View All
                    </Button>
                  </Link>
                </div>
                <Grid cols={3} gap="md">
                  {stats.inProgressJobs
                    .slice(0, 5)
                    .map(
                      (job: {
                        id: string;
                        client?: { id?: string; name: string; phone?: string; address?: string };
                        scheduledDate?: string | Date;
                        scheduledTime?: string;
                        type?: string;
                        cleaner?: { id?: string; email?: string };
                      }) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          client={{
                            id: job.client?.id || job.id,
                            name: job.client?.name || 'Unknown Client',
                          }}
                          type={job.type || 'ONE_OFF'}
                          scheduledDate={
                            job.scheduledDate
                              ? new Date(job.scheduledDate).toISOString()
                              : new Date().toISOString()
                          }
                          scheduledTime={job.scheduledTime || ''}
                          status="IN_PROGRESS"
                          cleaner={
                            job.cleaner?.email
                              ? { id: job.cleaner.id || '', email: job.cleaner.email }
                              : undefined
                          }
                        />
                      ),
                    )}
                </Grid>
              </div>
            )}

          {/* Upcoming Jobs for Cleaners */}
          {stats && isCleaner && stats.upcomingJobs && stats.upcomingJobs.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] mb-1">
                    Upcoming Jobs
                  </h2>
                  <p className="text-sm text-[var(--gray-600)]">
                    {stats.upcomingJobs.length} {stats.upcomingJobs.length === 1 ? 'job' : 'jobs'}{' '}
                    scheduled
                  </p>
                </div>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View All
                  </Button>
                </Link>
              </div>
              <Grid cols={3} gap="md">
                {stats.upcomingJobs
                  .slice(0, 5)
                  .map(
                    (job: {
                      id: string;
                      client?: { name: string };
                      scheduledDate?: string | Date;
                      scheduledTime?: string;
                    }) => (
                      <Card key={job.id} variant="elevated" padding="md" hover>
                        <Stack direction="row" justify="between" align="center">
                          <div>
                            <h3 className="font-bold text-[var(--gray-900)]">
                              {job.client?.name || 'Unknown Client'}
                            </h3>
                            <p className="text-sm text-[var(--gray-600)]">
                              {job.scheduledDate
                                ? formatDateBritish(job.scheduledDate)
                                : 'No date specified'}
                            </p>
                          </div>
                          <Link href={`/jobs/${job.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </Stack>
                      </Card>
                    ),
                  )}
              </Grid>
            </div>
          )}

          {/* Recent Jobs for Owners - Show if no upcoming jobs */}
          {stats &&
            (isOwner || isAdmin) &&
            stats.recentJobs &&
            stats.recentJobs.length > 0 &&
            (!stats.upcomingJobs || stats.upcomingJobs.length === 0) && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[var(--gray-900)]">Recent Jobs</h2>
                  <Link href="/jobs">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <Grid cols={1} gap="md">
                  {stats.recentJobs
                    .slice(0, 5)
                    .map(
                      (job: {
                        id: string;
                        client?: { id?: string; name: string; phone?: string; address?: string };
                        scheduledDate?: string | Date;
                        scheduledTime?: string;
                        status?: string;
                        type?: string;
                        cleaner?: { id?: string; email?: string };
                      }) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          client={{
                            id: job.client?.id || job.id,
                            name: job.client?.name || 'Unknown Client',
                          }}
                          type={job.type || 'ONE_OFF'}
                          scheduledDate={
                            job.scheduledDate
                              ? new Date(job.scheduledDate).toISOString()
                              : new Date().toISOString()
                          }
                          scheduledTime={job.scheduledTime || ''}
                          status={
                            (job.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED') || 'SCHEDULED'
                          }
                          cleaner={
                            job.cleaner?.email
                              ? { id: job.cleaner.id || '', email: job.cleaner.email }
                              : undefined
                          }
                        />
                      ),
                    )}
                </Grid>
              </div>
            )}

          {/* Recent Clients for Owners */}
          {stats &&
            (isOwner || isAdmin) &&
            stats.recentClients &&
            stats.recentClients.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] mb-1">
                      Recent Clients
                    </h2>
                    <p className="text-sm text-[var(--gray-600)]">
                      {stats.recentClients.length} of {stats.totalClients || 0} total clients
                    </p>
                  </div>
                  <Link href="/clients">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View All ({stats.totalClients || 0})
                    </Button>
                  </Link>
                </div>
                <Grid cols={3} gap="md">
                  {stats.recentClients
                    .slice(0, 5)
                    .map(
                      (client: {
                        id: string;
                        name: string;
                        phone?: string;
                        address?: string;
                        createdAt?: string | Date;
                      }) => (
                        <Card key={client.id} variant="elevated" padding="md" hover>
                          <Stack direction="row" justify="between" align="center">
                            <div className="flex-1">
                              <h3 className="font-bold text-[var(--gray-900)] mb-1">
                                {client.name}
                              </h3>
                              <Stack
                                direction="row"
                                spacing="md"
                                className="text-sm text-[var(--gray-600)]"
                              >
                                {client.phone && <span>📞 {client.phone}</span>}
                                {client.address && <span>📍 {client.address}</span>}
                              </Stack>
                            </div>
                            <Link href={`/clients/${client.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </Stack>
                        </Card>
                      ),
                    )}
                </Grid>
              </div>
            )}

          {/* Recent Invoices for Owners */}
          {stats &&
            (isOwner || isAdmin) &&
            stats.recentInvoices &&
            stats.recentInvoices.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--gray-900)] mb-1">
                      Recent Invoices
                    </h2>
                    <p className="text-sm text-[var(--gray-600)]">
                      {stats.recentInvoices.length} of {stats.totalInvoices || 0} total invoices
                    </p>
                  </div>
                  <Link href="/invoices">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View All ({stats.totalInvoices || 0})
                    </Button>
                  </Link>
                </div>
                <Grid cols={1} gap="md">
                  {stats.recentInvoices
                    .slice(0, 5)
                    .map(
                      (invoice: {
                        id: string;
                        invoiceNumber: string;
                        totalAmount: number | string;
                        status: string;
                        client?: { name: string };
                        dueDate?: string | Date;
                        createdAt?: string | Date;
                      }) => (
                        <Card key={invoice.id} variant="elevated" padding="md" hover>
                          <Stack direction="row" justify="between" align="center">
                            <div className="flex-1">
                              <Stack direction="row" spacing="sm" align="center" className="mb-1">
                                <h3 className="font-bold text-[var(--gray-900)]">
                                  {invoice.invoiceNumber}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                    invoice.status === 'PAID'
                                      ? 'bg-[var(--success-100)] text-[var(--success-700)]'
                                      : 'bg-[var(--warning-100)] text-[var(--warning-700)]'
                                  }`}
                                >
                                  {invoice.status}
                                </span>
                              </Stack>
                              <p className="text-sm text-[var(--gray-600)]">
                                {invoice.client?.name || 'Unknown Client'} • £
                                {typeof invoice.totalAmount === 'string'
                                  ? parseFloat(invoice.totalAmount).toFixed(2)
                                  : invoice.totalAmount.toFixed(2)}
                                {invoice.dueDate && (
                                  <>
                                    {' • Due: '}
                                    {formatDateBritishFull(invoice.dueDate)}
                                  </>
                                )}
                              </p>
                            </div>
                            <Link href={`/invoices/${invoice.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </Stack>
                        </Card>
                      ),
                    )}
                </Grid>
              </div>
            )}

          {/* Empty State - More Encouraging */}
          {stats &&
            stats.todayJobs === 0 &&
            (!stats.upcomingJobs || stats.upcomingJobs.length === 0) &&
            (!stats.inProgressJobs || stats.inProgressJobs.length === 0) &&
            (isOwner || isAdmin) && (
              <Card variant="elevated" padding="lg" className="text-center">
                <div className="max-w-md mx-auto space-y-6 py-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--primary-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[var(--gray-900)] mb-3">
                      Ready to get started?
                    </h3>
                    <p className="text-base text-[var(--gray-600)] mb-8 leading-relaxed">
                      Create your first job in seconds! Just select a client, pick a date, and
                      you&apos;re done.
                    </p>
                    <div className="flex flex-col gap-4">
                      <Link href="/jobs/create">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Create Your First Job
                        </Button>
                      </Link>
                      <Link href="/clients/new">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
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
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Add a Client First
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}
        </Stack>
      </Container>
    </Section>
  );
}
