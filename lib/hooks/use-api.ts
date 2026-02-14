import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../api-client-singleton';

/**
 * Custom hook for API queries using React Query
 */
export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => apiClient.get<T>(endpoint),
    ...options,
  });
}

/**
 * Custom hook for API mutations using React Query
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TContext = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: Partial<Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>>,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (data: TVariables) => {
      if (method === 'POST') {
        return apiClient.post<TData>(endpoint, data);
      } else if (method === 'PUT') {
        return apiClient.put<TData>(endpoint, data);
      } else {
        return apiClient.delete<TData>(endpoint);
      }
    },
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate relevant queries after successful mutation
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
