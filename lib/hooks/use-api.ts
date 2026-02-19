import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import { apiClient } from '../api-client-singleton';

/**
 * Custom hook for API queries using React Query
 *
 * Features:
 * - Automatic request deduplication (same query key = single request)
 * - Intelligent caching and refetching
 * - Error handling and retry logic
 */
export function useApiQuery<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      // Request deduplication is automatic with React Query
      // Multiple components using the same queryKey will share the same request
      return apiClient.get<T>(endpoint);
    },
    ...options,
  });
}

/**
 * Options for optimistic updates
 */
export interface OptimisticUpdateOptions<TData, TVariables> {
  // Query keys to update optimistically
  queryKeys: QueryKey[];
  // Function to generate optimistic data from variables
  optimisticData: (variables: TVariables) => TData;
  // Function to rollback on error (optional)
  rollback?: (previousData: unknown) => void;
}

/**
 * Custom hook for API mutations using React Query
 *
 * Features:
 * - Optimistic updates support
 * - Automatic query invalidation
 * - Smart cache updates
 * - Error handling with rollback
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TContext = unknown>(options: {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  // Query keys to invalidate after success
  invalidateQueries?: QueryKey[];
  // Optimistic update configuration
  optimisticUpdate?: OptimisticUpdateOptions<TData, TVariables>;
  // Custom mutation options
  mutationOptions?: Partial<
    Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>
  >;
}) {
  const queryClient = useQueryClient();
  const {
    endpoint,
    method = 'POST',
    invalidateQueries,
    optimisticUpdate,
    mutationOptions,
  } = options;

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (data: TVariables) => {
      if (method === 'POST') {
        return apiClient.post<TData>(endpoint, data);
      } else if (method === 'PUT') {
        return apiClient.put<TData>(endpoint, data);
      } else if (method === 'PATCH') {
        return apiClient.put<TData>(endpoint, data); // Use PUT for PATCH
      } else {
        return apiClient.delete<TData>(endpoint);
      }
    },
    // Optimistic update
    onMutate: async (variables) => {
      if (optimisticUpdate) {
        // Cancel outgoing refetches to avoid overwriting optimistic update
        await Promise.all(
          optimisticUpdate.queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
        );

        // Snapshot previous values for rollback
        const previousData = optimisticUpdate.queryKeys.map((queryKey) =>
          queryClient.getQueryData(queryKey),
        );

        // Optimistically update the cache
        optimisticUpdate.queryKeys.forEach((queryKey) => {
          queryClient.setQueryData(queryKey, optimisticUpdate.optimisticData(variables));
        });

        // Return context for rollback
        return { previousData, queryKeys: optimisticUpdate.queryKeys } as TContext;
      }
      return undefined as TContext;
    },
    // On error, rollback optimistic update
    onError: (error, variables, context, mutation) => {
      if (optimisticUpdate && context) {
        // Type guard for context
        if (
          context &&
          typeof context === 'object' &&
          'previousData' in context &&
          'queryKeys' in context
        ) {
          const ctx = context as { previousData: unknown[]; queryKeys: QueryKey[] };
          // Rollback to previous data
          ctx.queryKeys.forEach((queryKey, index) => {
            queryClient.setQueryData(queryKey, ctx.previousData[index]);
          });
        }
      }
      mutationOptions?.onError?.(error, variables, context, mutation);
    },
    // On success, update cache and invalidate queries
    onSuccess: (data, variables, context, mutation) => {
      // Invalidate specified queries to refetch fresh data
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        // Default: invalidate all queries (conservative approach)
        queryClient.invalidateQueries();
      }

      mutationOptions?.onSuccess?.(data, variables, context, mutation);
    },
    // On settled (success or error), ensure queries are in sync
    onSettled: (data, error, variables, context, mutation) => {
      if (optimisticUpdate) {
        // Refetch to ensure consistency
        optimisticUpdate.queryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      mutationOptions?.onSettled?.(data, error, variables, context, mutation);
    },
    ...mutationOptions,
  });
}
