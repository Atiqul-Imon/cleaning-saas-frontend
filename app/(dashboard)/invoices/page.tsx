'use client';

import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { LoadingSkeleton, EmptyState } from '@/components/ui';
import { InvoiceCard } from '@/features/invoices/components';

export default function InvoicesPage() {
  const { invoices, isLoading, error } = useInvoices();

  const loading = isLoading;

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
            title="Error Loading Invoices"
            description={(error as Error)?.message || 'Failed to load invoices'}
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
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Invoices</h1>
          <p className="text-[var(--gray-600)] text-lg">
            Manage and track all your invoices
          </p>
        </div>

        {invoices.length === 0 ? (
          <EmptyState
            title="No invoices yet"
            description="Invoices will be automatically generated when you complete jobs"
            icon={
              <svg className="w-16 h-16 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        ) : (
          <Grid cols={1} gap="md">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                id={invoice.id}
                invoiceNumber={invoice.invoiceNumber}
                totalAmount={invoice.totalAmount}
                status={invoice.status}
                dueDate={invoice.dueDate}
                client={invoice.client}
              />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}
