'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { Container, Grid, Stack, Section } from '@/components/layout';
import { Card, Button, LoadingSkeleton, EmptyState } from '@/components/ui';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

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
            title="Error Loading Dashboard"
            description={(error as Error)?.message || 'Failed to load dashboard data'}
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

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">
              {isOwner || isAdmin
                ? `Welcome back, ${business?.name || 'Business Owner'}!`
                : isCleaner
                  ? 'Welcome back!'
                  : 'Welcome!'}
            </h1>
            <p className="text-[var(--gray-600)] text-lg">
              {isOwner || isAdmin
                ? "Here's an overview of your business"
                : isCleaner
                  ? 'Here are your jobs for today'
                  : 'Dashboard'}
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (isOwner || isAdmin) && (
            <Grid cols={3} gap="lg">
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
              <StatCard
                title="Monthly Earnings"
                value={`£${stats.monthlyEarnings.toFixed(2)}`}
                variant="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Unpaid Invoices"
                value={stats.unpaidInvoices.toString()}
                variant="warning"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              />
            </Grid>
          )}

          {/* Cleaner Stats */}
          {stats && isCleaner && (
            <Grid cols={2} gap="lg">
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

          {/* Quick Actions */}
          {(isOwner || isAdmin) && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-4">Quick Actions</h2>
              <Grid cols={5} gap="md">
                <QuickAction
                  title="View Jobs"
                  description="See all your jobs"
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
                  href="/jobs"
                />
                <QuickAction
                  title="Create Job"
                  description="Schedule a new cleaning job"
                  variant="success"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                  href="/jobs/create"
                />
                <QuickAction
                  title="Add Client"
                  description="Add a new client"
                  variant="info"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  }
                  href="/clients/new"
                />
                <QuickAction
                  title="View Reports"
                  description="Business analytics"
                  variant="warning"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  href="/reports"
                />
                <QuickAction
                  title="Settings"
                  description="Manage your business"
                  variant="purple"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  href="/settings/business"
                />
              </Grid>
            </div>
          )}

          {/* Today's Jobs List */}
          {stats && stats.todayJobsList && stats.todayJobsList.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--gray-900)]">Today&apos;s Jobs</h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <Grid cols={1} gap="md">
                {stats.todayJobsList
                  .slice(0, 5)
                  .map((job: { id: string; client?: { name: string }; scheduledTime?: string }) => (
                    <Card key={job.id} variant="elevated" padding="md" hover>
                      <Stack direction="row" justify="between" align="center">
                        <div>
                          <h3 className="font-bold text-[var(--gray-900)]">
                            {job.client?.name || 'Unknown Client'}
                          </h3>
                          <p className="text-sm text-[var(--gray-600)]">
                            {job.scheduledTime || 'No time specified'}
                          </p>
                        </div>
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </Stack>
                    </Card>
                  ))}
              </Grid>
            </div>
          )}

          {/* Upcoming Jobs for Cleaners */}
          {stats && isCleaner && stats.upcomingJobs && stats.upcomingJobs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--gray-900)]">Upcoming Jobs</h2>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <Grid cols={1} gap="md">
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
                                ? new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                  })
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

          {/* Empty State */}
          {stats && stats.todayJobs === 0 && (isOwner || isAdmin) && (
            <EmptyState
              title="No jobs scheduled for today"
              description="Get started by creating your first job or adding a client"
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
              action={{
                label: 'Create Your First Job',
                href: '/jobs/create',
              }}
            />
          )}
        </Stack>
      </Container>
    </Section>
  );
}
