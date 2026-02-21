'use client';

import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import { Container, Section, Grid, Stack, PageHeader } from '@/components/layout';
import { Card, Button, LoadingSkeleton } from '@/components/ui';
import { InvoiceCard } from '@/features/invoices/components';

export default function InvoicesPage() {
  const { invoices, isLoading, error, refetch, isRefreshing } = useInvoices();

  const loading = isLoading;

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
                  Error Loading Invoices
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  {(error as Error)?.message || 'Failed to load invoices'}
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
            title="Invoices"
            description="Manage and track all your invoices"
            onRefresh={() => {
              void refetch();
            }}
            isRefreshing={isRefreshing}
          />

          {/* Invoices List */}
          {invoices.length === 0 ? (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">No invoices yet</h3>
                  <p className="text-[var(--gray-600)]">
                    Invoices will be automatically generated when you complete jobs
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Grid cols={3} gap="md">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  id={invoice.id}
                  invoiceNumber={invoice.invoiceNumber}
                  totalAmount={invoice.totalAmount}
                  dueDate={invoice.dueDate}
                  status={invoice.status || 'UNPAID'}
                  client={invoice.client}
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
