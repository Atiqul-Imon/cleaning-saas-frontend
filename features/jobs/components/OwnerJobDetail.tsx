'use client';

import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { Stack } from '@/components/layout';

interface OwnerJobDetailProps {
  job: any;
}

export default function OwnerJobDetail({ job }: OwnerJobDetailProps) {
  return (
    <Card variant="elevated" padding="lg">
      <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">Quick Actions</h2>
      <Stack spacing="md">
        <Link href={`/clients/${job.client.id}`} className="w-full">
          <Button variant="primary" size="lg" className="w-full">
            View Client
          </Button>
        </Link>
        {job.invoice ? (
          <Link href={`/invoices/${job.invoice.id}`} className="w-full">
            <Button variant="success" size="lg" className="w-full">
              View Invoice
            </Button>
          </Link>
        ) : (
          <Link href={`/invoices/create?jobId=${job.id}`} className="w-full">
            <Button variant="success" size="lg" className="w-full">
              Create Invoice
            </Button>
          </Link>
        )}
      </Stack>
    </Card>
  );
}
