import { useApiQuery } from '@/shared/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import type { Job } from '../types/job.types';

/**
 * Hook for fetching all jobs
 * Automatically handles role-based filtering
 */
export function useJobs() {
  const { userRole, loading: roleLoading } = useUserRole();

  const { data, isLoading, error } = useApiQuery<Job[]>(queryKeys.jobs.all(userRole?.id), '/jobs', {
    enabled: !!userRole,
  });

  return {
    jobs: data || [],
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
