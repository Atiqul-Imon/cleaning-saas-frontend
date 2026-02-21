import { useApiQuery } from '@/shared/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import type { Invoice } from '../types/invoice.types';

/**
 * Hook for fetching all invoices
 * Only available for owners and admins
 */
export function useInvoices(options?: { status?: 'PAID' | 'UNPAID' }) {
  const { userRole, loading: roleLoading } = useUserRole();

  const params = new URLSearchParams();
  if (options?.status) {
    params.set('status', options.status);
  }
  const queryString = params.toString();
  const url = queryString ? `/invoices?${queryString}` : '/invoices';

  const queryKey = options?.status
    ? [...queryKeys.invoices.all(userRole?.id), options.status]
    : queryKeys.invoices.all(userRole?.id);

  const { data, isLoading, error, refetch, isFetching } = useApiQuery<Invoice[]>(queryKey, url, {
    enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
  });

  return {
    invoices: data || [],
    isLoading: roleLoading || isLoading,
    error,
    userRole,
    refetch,
    isRefreshing: isFetching && !isLoading,
  };
}

/**
 * Hook for fetching a single invoice
 */
export function useInvoice(invoiceId: string | null) {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Invoice>(
    queryKeys.invoices.detail(invoiceId || ''),
    invoiceId ? `/invoices/${invoiceId}` : '',
    {
      enabled:
        !!userRole && !!invoiceId && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  return {
    invoice: data,
    isLoading: roleLoading || isLoading,
    error,
  };
}
