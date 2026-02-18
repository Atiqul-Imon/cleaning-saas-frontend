'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Avatar } from '@/components/ui';
import { Stack } from '@/components/layout';
import { cn } from '@/lib/utils';

export interface InvoiceCardProps {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: string;
  client: {
    name: string;
  };
  onClick?: () => void;
}

const InvoiceCard = React.memo(function InvoiceCard({
  id,
  invoiceNumber,
  totalAmount,
  dueDate,
  client,
  onClick,
}: InvoiceCardProps) {

  return (
    <Link href={`/invoices/${id}`}>
      <Card variant="elevated" padding="lg" hover>
        <Stack direction="row" justify="between" align="start">
          <Stack direction="row" spacing="md" align="start" className="flex-1">
            <Avatar name={client.name} size="md" />
            <div className="flex-1 min-w-0">
              <Stack direction="row" spacing="md" align="center" className="mb-2">
                <h3 className="font-bold text-[var(--gray-900)] text-lg">{invoiceNumber}</h3>
              </Stack>
              <p className="text-base text-[var(--gray-700)] font-semibold mb-2">{client.name}</p>
              <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-600)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  Due: {new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </Stack>
            </div>
          </Stack>
          <div className="text-right ml-6">
            <p className="text-3xl font-extrabold text-[var(--gray-900)]">
              £{Number(totalAmount).toFixed(2)}
            </p>
          </div>
        </Stack>
      </Card>
    </Link>
  );
});

export default InvoiceCard;
