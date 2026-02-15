import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/toast-context';
import { jobsApi } from '../services/jobs.api';
import { JobsService } from '../services/jobs.service';
import type { CreateJobDto, UpdateJobDto } from '../types/job.types';

/**
 * Hook for job management operations (create, update, delete)
 * Includes business logic validation
 */
export function useJobManagement() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createJob = useMutation({
    mutationFn: (data: CreateJobDto) => {
      // Validate before API call
      const validation = JobsService.validateCreateJob(data);
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return jobsApi.create(JobsService.transformJobData(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job created successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create job', 'error');
    },
  });

  const updateJob = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobDto }) => {
      // Validate before API call
      const validation = JobsService.validateUpdateJob(data);
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return jobsApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });
      showToast('Job updated successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update job', 'error');
    },
  });

  const deleteJob = useMutation({
    mutationFn: (id: string) => jobsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showToast('Job deleted successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete job', 'error');
    },
  });

  return {
    createJob: (data: CreateJobDto) => createJob.mutate(data),
    updateJob: (id: string, data: UpdateJobDto) => updateJob.mutate({ id, data }),
    deleteJob: (id: string) => deleteJob.mutate(id),
    isCreating: createJob.isPending,
    isUpdating: updateJob.isPending,
    isDeleting: deleteJob.isPending,
  };
}

