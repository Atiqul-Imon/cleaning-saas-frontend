'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { createClient } from '@/lib/supabase';
import { Container, Stack, Section, PageHeader } from '@/components/layout';
import { Card, Button, LoadingSkeleton } from '@/components/ui';
import dynamic from 'next/dynamic';

// Lazy load invoice template renderer (heavy component with template logic)
const InvoiceTemplateRenderer = dynamic(
  () =>
    import('@/features/invoices/components/InvoiceTemplates').then((mod) => ({
      default: mod.InvoiceTemplateRenderer,
    })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96" />,
    ssr: false,
  },
);

// Type import (no runtime cost)
import type { InvoiceTemplate } from '@/features/invoices/components/InvoiceTemplates';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  dueDate: string;
  createdAt: string;
  status?: 'PAID' | 'UNPAID';
  client: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  business: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    vatEnabled: boolean;
    vatNumber?: string;
    invoiceTemplate?: InvoiceTemplate;
  };
  job?: {
    id: string;
    type: string;
    scheduledDate: string;
    scheduledTime?: string;
    status: string;
  };
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { userRole } = useUserRole();
  const { showToast } = useToast();

  // Fetch invoice using React Query
  const invoiceQuery = useApiQuery<Invoice>(
    queryKeys.invoices.detail(invoiceId),
    `/invoices/${invoiceId}`,
    {
      enabled: !!invoiceId && !!userRole,
    },
  );

  const invoice = invoiceQuery.data;
  const loading = invoiceQuery.isLoading;

  const handleShareInvoice = async () => {
    if (!invoice) {
      return;
    }

    try {
      showToast('Preparing invoice...', 'info');
      const { shareInvoice } = await import('@/lib/whatsapp-share');
      await shareInvoice(
        invoice.id,
        invoice.invoiceNumber,
        invoice.client.name,
        invoice.business.name,
      );
      showToast('Invoice ready! Select WhatsApp from share menu.', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share invoice';
      showToast(errorMessage, 'error');
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) {
      return;
    }
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        showToast('Please log in to download PDF', 'error');
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.clenvora.com'
          : 'http://localhost:5000');
      const response = await fetch(`${apiUrl}/invoices/${invoice.id}/pdf`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('PDF downloaded successfully', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to download PDF';
      showToast(message, 'error');
    }
  };

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

  if (!invoice) {
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
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">Invoice not found</h3>
                <p className="text-[var(--gray-600)] mb-6">
                  The invoice you&apos;re looking for doesn&apos;t exist or you don&apos;t have
                  access to it
                </p>
                <Link href="/invoices">
                  <Button variant="primary">Back to Invoices</Button>
                </Link>
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
            title={invoice.invoiceNumber}
            description={`Invoice for ${invoice.client.name}`}
            backHref="/invoices"
            backLabel="Back to Invoices"
            actions={
              <Stack direction="row" spacing="md" className="flex-wrap">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleShareInvoice}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 shadow-lg"
                  leftIcon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  }
                >
                  Send Invoice
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDownloadPDF}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                >
                  Download PDF
                </Button>
              </Stack>
            }
          />

          {/* Invoice Template */}
          <div>
            <InvoiceTemplateRenderer
              invoice={invoice}
              template={(invoice.business.invoiceTemplate as InvoiceTemplate) || 'classic'}
            />
          </div>
        </Stack>
      </Container>
    </Section>
  );
}
