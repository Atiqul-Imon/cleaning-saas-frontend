import { useApiQuery } from '@/shared/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import type { Job } from '../types/job.types';

/**
 * Hook for fetching all jobs
 * Automatically handles role-based filtering
 * Handles both paginated and non-paginated responses
 */
export function useJobs() {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Job[] | { data: Job[]; pagination: any }>(
    queryKeys.jobs.all(userRole?.id),
    '/jobs',
    {
      enabled: !!userRole,
      select: (response) => {
        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) {
          return response;
        }
        // If response has data property, it's paginated
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as { data: Job[] }).data;
        }
        // Fallback to empty array
        return [];
      },
    },
  );

  // Ensure we always return an array
  const jobs = Array.isArray(data) ? data : [];

  return {
    jobs,
    isLoading: roleLoading || isLoading,
    error,
    userRole,
  };
}

/**
 * Hook for fetching a single job
 */
export function useJob(jobId: string | null) {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Job>(
    queryKeys.jobs.detail(jobId || ''),
    jobId ? `/jobs/${jobId}` : '',
    {
      enabled: !!userRole && !!jobId,
    },
  );

  return {
    job: data,
    isLoading: roleLoading || isLoading,
    error,
  };
}

/**
 * Hook for fetching today's jobs
 */
export function useTodayJobs() {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Job[]>(
    queryKeys.jobs.all(userRole?.id),
    '/jobs/today',
    {
      enabled: !!userRole,
    },
  );

  return {
    jobs: data || [],
    isLoading: roleLoading || isLoading,
    error,
  };
}
