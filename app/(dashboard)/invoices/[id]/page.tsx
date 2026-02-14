'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid, Divider } from '@/components/layout';
import { Card, Button, Badge, Modal, Select, LoadingSkeleton, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: 'PAID' | 'UNPAID';
  paymentMethod?: 'BANK_TRANSFER' | 'CARD' | 'CASH';
  paidAt?: string;
  dueDate: string;
  createdAt: string;
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
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CARD' | 'CASH'>('BANK_TRANSFER');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  useEffect(() => {
    if (params.id) {
      loadInvoice();
    }
  }, [params.id]);

  const loadInvoice = async () => {
    try {
      const data = await apiClient.get<Invoice>(`/invoices/${params.id}`);
      setInvoice(data);
    } catch (error: any) {
      showToast(error.message || 'Failed to load invoice', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    setMarkingPaid(true);
    try {
      await apiClient.put(`/invoices/${invoice.id}/mark-paid`, { paymentMethod });
      showToast('Invoice marked as paid', 'success');
      setShowPaymentModal(false);
      loadInvoice();
    } catch (error: any) {
      showToast(error.message || 'Failed to mark invoice as paid', 'error');
    } finally {
      setMarkingPaid(false);
    }
  };

  const handleGetWhatsAppLink = async () => {
    if (!invoice) return;
    try {
      const data = await apiClient.get<{ whatsappUrl: string | null; phoneNumber?: string }>(
        `/invoices/${invoice.id}/whatsapp-link`,
      );
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        showToast('Opening WhatsApp...', 'success');
      } else {
        showToast('Client phone number not available', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to generate WhatsApp link', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('Please log in to download PDF', 'error');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/invoices/${invoice.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
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
    } catch (error: any) {
      showToast(error.message || 'Failed to download PDF', 'error');
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
          <EmptyState
            title="Invoice not found"
            description="The invoice you're looking for doesn't exist or you don't have access to it"
            action={{
              label: 'Back to Invoices',
              href: '/invoices',
            }}
          />
        </Container>
      </Section>
    );
  }

  const isOverdue = invoice.status === 'UNPAID' && new Date(invoice.dueDate) < new Date();

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Link href="/invoices" className="mb-6 inline-block">
          <Button variant="ghost" size="sm" leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }>
            Back to Invoices
          </Button>
        </Link>

        {/* Header */}
        <Card variant="elevated" padding="lg" className={cn('mb-8', isOverdue && 'border-l-4 border-l-[var(--error-500)]')}>
          <Stack direction="row" justify="between" align="start" className="mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">{invoice.invoiceNumber}</h1>
              <Stack direction="row" spacing="md" align="center">
                <Badge
                  variant={invoice.status === 'PAID' ? 'success' : isOverdue ? 'error' : 'warning'}
                  size="lg"
                >
                  {invoice.status}
                </Badge>
                {isOverdue && (
                  <Badge variant="error" size="lg">Overdue</Badge>
                )}
              </Stack>
            </div>
            <Stack direction="row" spacing="md">
              <Button variant="secondary" size="md" onClick={handleDownloadPDF} leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }>
                Download PDF
              </Button>
              {invoice.status === 'UNPAID' && invoice.client.phone && (
                <Button variant="success" size="md" onClick={handleGetWhatsAppLink} leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                }>
                  Send Reminder
                </Button>
              )}
              {invoice.status === 'UNPAID' && (
                <Button variant="success" size="md" onClick={() => setShowPaymentModal(true)}>
                  Mark as Paid
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>

        <Grid cols={1} gap="lg" className="lg:grid-cols-2">
          {/* Bill From */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4">Bill From</h2>
            <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
              <Stack spacing="sm">
                <p className="font-bold text-[var(--gray-900)] text-lg">{invoice.business.name}</p>
                {invoice.business.phone && (
                  <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-700)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium text-sm">{invoice.business.phone}</span>
                  </Stack>
                )}
                {invoice.business.address && (
                  <Stack direction="row" spacing="sm" align="start" className="text-[var(--gray-700)]">
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium text-sm">{invoice.business.address}</span>
                  </Stack>
                )}
                {invoice.business.vatEnabled && invoice.business.vatNumber && (
                  <p className="text-sm text-[var(--gray-700)] font-medium">VAT: {invoice.business.vatNumber}</p>
                )}
              </Stack>
            </Card>
          </Card>

          {/* Bill To */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-lg font-bold text-[var(--gray-900)] mb-4">Bill To</h2>
            <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
              <Stack spacing="sm">
                <p className="font-bold text-[var(--gray-900)] text-lg">{invoice.client.name}</p>
                {invoice.client.phone && (
                  <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-700)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium text-sm">{invoice.client.phone}</span>
                  </Stack>
                )}
                {invoice.client.address && (
                  <Stack direction="row" spacing="sm" align="start" className="text-[var(--gray-700)]">
                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium text-sm">{invoice.client.address}</span>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Card>
        </Grid>

        {/* Invoice Details */}
        <Card variant="elevated" padding="lg" className="mt-6">
          <Stack spacing="md">
            <Grid cols={2} gap="md">
              <div>
                <p className="text-sm text-[var(--gray-600)] font-medium mb-1">Invoice Date</p>
                <p className="text-lg font-bold text-[var(--gray-900)]">
                  {new Date(invoice.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--gray-600)] font-medium mb-1">Due Date</p>
                <p className={cn(
                  'text-lg font-bold',
                  isOverdue ? 'text-[var(--error-600)]' : 'text-[var(--gray-900)]'
                )}>
                  {new Date(invoice.dueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Grid>

            {invoice.job && (
              <Card variant="outlined" padding="md" className="bg-[var(--primary-50)] border-[var(--primary-200)]">
                <Stack spacing="sm">
                  <p className="text-sm text-[var(--gray-600)] font-medium">Related Job</p>
                  <p className="text-base font-bold text-[var(--gray-900)]">
                    {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString('en-GB')}
                    {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
                  </p>
                  <Link href={`/jobs/${invoice.job.id}`}>
                    <Button variant="ghost" size="sm">View Job Details →</Button>
                  </Link>
                </Stack>
              </Card>
            )}

            <Divider spacing="md" />

            {/* Amount Breakdown */}
            <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
              <Stack spacing="md">
                <Stack direction="row" justify="between" align="center">
                  <span className="text-[var(--gray-700)] font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-[var(--gray-900)]">£{Number(invoice.amount).toFixed(2)}</span>
                </Stack>
                {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
                  <Stack direction="row" justify="between" align="center">
                    <span className="text-[var(--gray-700)] font-medium">VAT (20%)</span>
                    <span className="text-lg font-bold text-[var(--gray-900)]">£{Number(invoice.vatAmount).toFixed(2)}</span>
                  </Stack>
                )}
                <Divider spacing="sm" />
                <Stack direction="row" justify="between" align="center">
                  <span className="text-xl font-bold text-[var(--gray-900)]">Total</span>
                  <span className="text-3xl font-extrabold text-[var(--primary-600)]">£{Number(invoice.totalAmount).toFixed(2)}</span>
                </Stack>
              </Stack>
            </Card>

            {invoice.status === 'PAID' && invoice.paidAt && (
              <Card variant="outlined" padding="md" className="bg-[var(--success-50)] border-[var(--success-200)]">
                <Stack direction="row" spacing="sm" align="center">
                  <svg className="w-6 h-6 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-[var(--success-900)]">Payment Received</p>
                    <p className="text-sm text-[var(--success-700)] font-medium">
                      Paid on {new Date(invoice.paidAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {invoice.paymentMethod && ` via ${invoice.paymentMethod.replace('_', ' ')}`}
                    </p>
                  </div>
                </Stack>
              </Card>
            )}
          </Stack>
        </Card>
      </Container>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Mark Invoice as Paid"
      >
        <Stack spacing="lg">
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            options={[
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
              { value: 'CARD', label: 'Card' },
              { value: 'CASH', label: 'Cash' },
            ]}
          />
          <Stack direction="row" spacing="md">
            <Button variant="secondary" size="lg" onClick={() => setShowPaymentModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={handleMarkAsPaid}
              isLoading={markingPaid}
              className="flex-1"
            >
              Mark as Paid
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Section>
  );
}
