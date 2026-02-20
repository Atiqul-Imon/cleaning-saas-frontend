'use client';

import React from 'react';
import Link from 'next/link';
import { Card, StatusBadge } from '@/components/ui';
import { formatDateBritishWithWeekday } from '@/lib/date-utils';

export interface InvoiceCardProps {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: string;
  status?: 'PAID' | 'UNPAID';
  client: {
    name: string;
  };
}

/**
 * InvoiceCard Component
 *
 * Enhanced invoice card with:
 * - Compact, modern design
 * - Clear status indicators
 * - Better information hierarchy
 * - Mobile-optimized layout
 * - Consistent with JobCard styling
 */
const InvoiceCard = React.memo(
  ({ id, invoiceNumber, totalAmount, dueDate, status, client }: InvoiceCardProps) => {
    // Check if invoice is overdue
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDateObj.setHours(0, 0, 0, 0);
    const isOverdue = dueDateObj.getTime() < today.getTime() && status === 'UNPAID';
    const isToday = dueDateObj.getTime() === today.getTime();

    return (
      <Link href={`/invoices/${id}`} className="h-full block">
        <Card
          variant="elevated"
          padding="sm"
          hover
          clickable
          className="h-full flex flex-col transition-all duration-200"
        >
          <div className="flex flex-col flex-1 space-y-3">
            {/* Header: Invoice Number & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-[var(--gray-900)] mb-0.5 truncate">
                  {invoiceNumber}
                </h3>
                <p className="text-xs text-[var(--gray-600)] font-medium">{client.name}</p>
              </div>
              {status && (
                <div className="flex-shrink-0">
                  <StatusBadge
                    status={status}
                    type={status === 'PAID' ? 'success' : 'warning'}
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[var(--success-50)] rounded">
                <svg
                  className="w-3.5 h-3.5 text-[var(--success-600)]"
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
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-[var(--gray-900)]">
                  £{Number(totalAmount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--gray-600)]">
              <div
                className={cn(
                  'p-1 rounded',
                  isOverdue ? 'bg-[var(--error-50)]' : 'bg-[var(--primary-50)]',
                )}
              >
                <svg
                  className={cn(
                    'w-3.5 h-3.5',
                    isOverdue ? 'text-[var(--error-600)]' : 'text-[var(--primary-600)]',
                  )}
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
              </div>
              <div className="flex-1">
                <span className="font-medium">
                  {isToday ? 'Due today' : isOverdue ? 'Overdue' : 'Due'}{' '}
                  {formatDateBritishWithWeekday(dueDate)}
                </span>
              </div>
            </div>

            {/* Spacer for consistent heights */}
            <div className="flex-1 min-h-[20px]" />

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[var(--error-50)] rounded-md border border-[var(--error-200)]">
                <svg
                  className="w-3.5 h-3.5 text-[var(--error-600)] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-xs font-medium text-[var(--error-700)]">Payment overdue</span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  },
);
InvoiceCard.displayName = 'InvoiceCard';

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default InvoiceCard;
