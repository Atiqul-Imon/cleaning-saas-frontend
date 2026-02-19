'use client';

import { useState, useEffect } from 'react';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { createClient } from '@/lib/supabase';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { Card, Button, Input, LoadingSkeleton } from '@/components/ui';
import dynamic from 'next/dynamic';

// Lazy load StatCard component
const StatCard = dynamic(
  () => import('@/features/dashboard/components').then((mod) => ({ default: mod.StatCard })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-24" />,
  },
);

interface BusinessReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalJobs: number;
    completedJobs: number;
    totalClients: number;
    totalRevenue: number;
    unpaidInvoices: number;
    unpaidAmount: number;
  };
  jobs: any[];
  invoices: any[];
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const { userRole } = useUserRole();
  const { showToast } = useToast();
  const supabase = createClient();

  // Fetch report using React Query
  const reportQuery = useApiQuery<BusinessReport>(
    queryKeys.reports.business(userRole?.id || '', startDate, endDate),
    `/reports/business?startDate=${startDate}&endDate=${endDate}`,
    {
      enabled: !!userRole && !!startDate && !!endDate,
    },
  );

  const report = reportQuery.data;
  const loading = reportQuery.isLoading;

  // Refetch when dates change
  useEffect(() => {
    if (userRole && startDate && endDate) {
      reportQuery.refetch();
    }
  }, [startDate, endDate, userRole]);

  const handleExport = async (type: 'jobs' | 'invoices' | 'all') => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        showToast('Please log in to export', 'error');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.clenvora.com' : 'http://localhost:5000')}/reports/export?startDate=${startDate}&endDate=${endDate}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Report exported successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to export report', 'error');
    }
  };

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Business Reports</h1>
          <p className="text-[var(--gray-600)] text-lg">
            Analyze your business performance and export data
          </p>
        </div>

        {/* Date Range Selector */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <Stack spacing="md">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Date Range</h2>
            <Grid cols={2} gap="md">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Stack>
        </Card>

        {/* Summary Cards */}
        {report && (
          <>
            <Grid cols={3} gap="lg" className="mb-8">
              <StatCard
                title="Total Jobs"
                value={report.summary.totalJobs.toString()}
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
                trend={{
                  value: report.summary.completedJobs,
                  label: 'completed',
                }}
              />
              <StatCard
                title="Total Revenue"
                value={`£${report.summary.totalRevenue.toFixed(2)}`}
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
                trend={{
                  value: report.summary.totalClients,
                  label: 'clients',
                }}
              />
              <StatCard
                title="Unpaid Amount"
                value={`£${report.summary.unpaidAmount.toFixed(2)}`}
                variant="warning"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                trend={{
                  value: report.summary.unpaidInvoices,
                  label: 'invoices',
                }}
              />
            </Grid>

            {/* Export Buttons */}
            <Card variant="elevated" padding="lg">
              <Stack spacing="md">
                <h2 className="text-xl font-bold text-[var(--gray-900)]">Export Reports</h2>
                <Grid cols={3} gap="md">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleExport('jobs')}
                    className="w-full"
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    }
                  >
                    Export Jobs
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => handleExport('invoices')}
                    className="w-full"
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    }
                  >
                    Export Invoices
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => handleExport('all')}
                    className="w-full"
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    }
                  >
                    Export All
                  </Button>
                </Grid>
              </Stack>
            </Card>
          </>
        )}
      </Container>
    </Section>
  );
}
