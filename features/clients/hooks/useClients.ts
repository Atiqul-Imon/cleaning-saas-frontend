import { useApiQuery } from '@/shared/hooks/use-api';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import type { Client } from '../types/client.types';

/**
 * Hook for fetching all clients
 * Automatically handles role-based filtering
 */
export function useClients() {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Client[]>(
    ['clients', userRole?.id || ''],
    '/clients',
    {
      enabled: !!userRole,
    },
  );

  return {
    clients: data || [],
    isLoading: roleLoading || isLoading,
    error,
    userRole,
  };
}

/**
 * Hook for fetching a single client
 */
export function useClient(clientId: string | null) {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Client>(
    ['client', clientId || '', userRole?.id || ''],
    clientId ? `/clients/${clientId}` : '',
    {
      enabled: !!userRole && !!clientId,
    },
  );

  return {
    client: data,
    isLoading: roleLoading || isLoading,
    error,
  };
}

