'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApiQuery, useApiMutation } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid, Divider, PageHeader } from '@/components/layout';
import { Card, Button, Input, Avatar, LoadingSkeleton } from '@/components/ui';

interface Job {
  id: string;
  type: string;
  scheduledDate: string;
  scheduledTime?: string;
  status: string;
  client: {
    id: string;
    name: string;
    address?: string;
  };
  cleaner?: {
    id: string;
    email: string;
  };
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [amount, setAmount] = useState<string>('');
  const { userRole, loading: roleLoading } = useUserRole();
  const { showToast } = useToast();

  const isOwner = userRole?.role === 'OWNER';
  const isAdmin = userRole?.role === 'ADMIN';

  // Fetch job using React Query
  const jobQuery = useApiQuery<Job>(
    queryKeys.jobs.detail(jobId || ''),
    jobId ? `/jobs/${jobId}` : '',
    {
      enabled: !!jobId && !!userRole && (isOwner || isAdmin),
    },
  );

  const job = jobQuery.data;
  const loading = jobQuery.isLoading || roleLoading;
  const error = jobQuery.error ? (jobQuery.error as Error).message : null;

  // Create invoice mutation
  const createInvoiceMutation = useApiMutation<
    { id: string; invoiceNumber: string },
    { amount: number }
  >({
    endpoint: `/invoices/from-job/${jobId}`,
    method: 'POST',
    invalidateQueries: [queryKeys.invoices.all(userRole?.id), queryKeys.jobs.detail(jobId || '')],
    mutationOptions: {
      onSuccess: () => {
        showToast('Invoice created successfully!', 'success');
        router.push('/invoices');
      },
      onError: (error) => {
        showToast((error as Error)?.message || 'Failed to create invoice', 'error');
      },
    },
  });

  useEffect(() => {
    if (!jobId) {
      return;
    }

    if (!roleLoading && userRole) {
      if (!isOwner && !isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [jobId, roleLoading, userRole, isOwner, isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || !amount) {
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    createInvoiceMutation.mutate({ amount: amountNum });
  };

  const submitting = createInvoiceMutation.isPending;
  const submitError = createInvoiceMutation.error
    ? (createInvoiceMutation.error as Error).message
    : null;

  if (roleLoading || loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  if ((error || submitError) && !job) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">Error</h3>
                <p className="text-[var(--gray-600)] mb-6">
                  {error || submitError || 'Failed to load job details'}
                </p>
                <Link href="/jobs">
                  <Button variant="primary">Back to Jobs</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  if (!isOwner && !isAdmin) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-[var(--warning-50)] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--warning-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">Access Denied</h3>
                <p className="text-[var(--gray-600)] mb-6">
                  Only business owners can create invoices.
                </p>
                <Link href="/jobs">
                  <Button variant="primary">Back to Jobs</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          {/* Page Header */}
          <PageHeader
            title="Create Invoice"
            description="Create an invoice for the completed job"
            backHref={`/jobs/${job.id}`}
            backLabel="Back to Job"
          />

          {(error || submitError) && (
            <Card
              variant="outlined"
              padding="md"
              className="bg-[var(--error-50)] border-[var(--error-200)]"
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
                <span className="text-sm text-[var(--error-700)] font-semibold">
                  {error || submitError}
                </span>
              </Stack>
            </Card>
          )}

          <Grid cols={1} gap="lg" className="lg:grid-cols-3">
            {/* Job Information */}
            <div className="lg:col-span-2">
              <Card variant="elevated" padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[var(--primary-50)] rounded-lg">
                    <svg
                      className="w-5 h-5 text-[var(--primary-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--gray-900)]">Job Information</h2>
                </div>
                <Stack spacing="md">
                  <div>
                    <Stack direction="row" spacing="md" align="center" className="mb-2">
                      <Avatar name={job.client.name} size="md" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                          Client
                        </p>
                        <Link href={`/clients/${job.client.id}`}>
                          <p className="text-base font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)]">
                            {job.client.name}
                          </p>
                        </Link>
                      </div>
                    </Stack>
                  </div>
                  <Divider spacing="sm" />
                  <Grid cols={2} gap="md">
                    <div>
                      <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                        Job Type
                      </p>
                      <p className="text-base font-bold text-[var(--gray-900)]">
                        {job.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                        Date
                      </p>
                      <Stack direction="row" spacing="sm" align="center">
                        <svg
                          className="w-4 h-4 text-[var(--gray-500)]"
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
                        <p className="text-sm font-medium text-[var(--gray-900)]">
                          {new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </Stack>
                      {job.scheduledTime && (
                        <Stack direction="row" spacing="sm" align="center" className="mt-1">
                          <svg
                            className="w-4 h-4 text-[var(--gray-500)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-xs font-medium text-[var(--gray-600)]">
                            {job.scheduledTime}
                          </p>
                        </Stack>
                      )}
                    </div>
                  </Grid>
                  {job.cleaner && (
                    <>
                      <Divider spacing="sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                          Completed by
                        </p>
                        <Stack direction="row" spacing="sm" align="center">
                          <Avatar name={job.cleaner.email} size="sm" />
                          <p className="text-sm font-medium text-[var(--gray-900)]">
                            {job.cleaner.email}
                          </p>
                        </Stack>
                      </div>
                    </>
                  )}
                  {job.client.address && (
                    <>
                      <Divider spacing="sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <Stack direction="row" spacing="sm" align="start">
                          <svg
                            className="w-4 h-4 text-[var(--gray-500)] mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <p className="text-xs font-medium text-[var(--gray-700)]">
                            {job.client.address}
                          </p>
                        </Stack>
                      </div>
                    </>
                  )}
                </Stack>
              </Card>
            </div>

            {/* Invoice Form */}
            <div>
              <Card variant="elevated" padding="md" className="sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[var(--primary-50)] rounded-lg">
                    <svg
                      className="w-5 h-5 text-[var(--primary-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--gray-900)]">Invoice Details</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <Stack spacing="md">
                    <Input
                      label="Amount (£)"
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                      helperText="VAT will be calculated automatically if enabled"
                    />

                    <Divider spacing="sm" />

                    <Stack spacing="sm">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={submitting}
                        disabled={!amount}
                        className="w-full"
                      >
                        Create Invoice
                      </Button>
                      <Link href={`/jobs/${job.id}`} className="w-full">
                        <Button variant="secondary" size="lg" className="w-full">
                          Cancel
                        </Button>
                      </Link>
                    </Stack>
                  </Stack>
                </form>
              </Card>
            </div>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
