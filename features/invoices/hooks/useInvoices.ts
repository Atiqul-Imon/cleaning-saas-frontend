import { useApiQuery } from '@/shared/hooks/use-api';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import type { Invoice } from '../types/invoice.types';

/**
 * Hook for fetching all invoices
 * Only available for owners and admins
 */
export function useInvoices() {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Invoice[]>(
    ['invoices', userRole?.id || ''],
    '/invoices',
    {
      enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  return {
    invoices: data || [],
    isLoading: roleLoading || isLoading,
    error,
    userRole,
  };
}

/**
 * Hook for fetching a single invoice
 */
export function useInvoice(invoiceId: string | null) {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Invoice>(
    ['invoice', invoiceId || '', userRole?.id || ''],
    invoiceId ? `/invoices/${invoiceId}` : '',
    {
      enabled: !!userRole && !!invoiceId && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  return {
    invoice: data,
    isLoading: roleLoading || isLoading,
    error,
  };
}

