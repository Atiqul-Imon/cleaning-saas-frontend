'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { apiClient } from '@/lib/api-client-singleton';
import { queryKeys } from '@/lib/query-keys';

/**
 * UserRole interface - exported for reuse across components
 */
export interface UserRole {
  id: string;
  email: string;
  role: 'OWNER' | 'CLEANER' | 'ADMIN';
}

/**
 * Optimized useUserRole hook using React Query
 *
 * Features:
 * - Global caching (shared across all components)
 * - Automatic refetching on window focus and network reconnect
 * - Automatic invalidation on auth state changes (sign in/out)
 * - Long stale time (5 minutes) since user role rarely changes
 * - Single source of truth for user role
 * - Smart retry logic (doesn't retry on 401/403 auth errors)
 * - Automatic cache clearing on logout
 * - Better error handling with specific error cases
 */
export function useUserRole() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const {
    data: userRole,
    isLoading,
    error,
    refetch,
  } = useQuery<UserRole | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        // Clear cache if user is not authenticated
        queryClient.setQueryData(queryKeys.auth.me(), null);
        return null;
      }

      try {
        const roleData = await apiClient.get<UserRole>('/auth/me');
        return roleData;
      } catch (error: any) {
        // Handle specific error cases
        const errorMessage = error?.message || '';

        // Don't log 401/403 errors (user not authenticated/authorized)
        if (
          errorMessage.includes('401') ||
          errorMessage.includes('403') ||
          errorMessage.includes('Unauthorized')
        ) {
          queryClient.setQueryData(queryKeys.auth.me(), null);
          return null;
        }

        console.error('Failed to load user role:', error);
        throw error; // Re-throw to trigger retry for other errors
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - user role doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Unauthorized')
      ) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: false, // Don't refetch on every mount (use cache)
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  // Listen to auth state changes and invalidate cache
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Clear user role cache on logout or token refresh
        queryClient.setQueryData(queryKeys.auth.me(), null);
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

        // Also clear ApiClient cache
        apiClient.clearCache();
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Refetch user role on sign in or user update
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, supabase]);

  return {
    userRole: userRole ?? null,
    loading: isLoading,
    error,
    refetch,
  };
}

/**
 * Utility hook to invalidate user role cache
 * Useful when you need to force a refresh of user role data
 *
 * @example
 * ```tsx
 * const invalidateUserRole = useInvalidateUserRole();
 *
 * const handleRoleChange = async () => {
 *   await updateRole();
 *   invalidateUserRole(); // Force refresh
 * };
 * ```
 */
export function useInvalidateUserRole() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  };
}
