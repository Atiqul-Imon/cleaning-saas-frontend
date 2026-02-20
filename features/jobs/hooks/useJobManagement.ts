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
    onSuccess: (data) => {
      // Invalidate all job-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });

      const jobDate = new Date(data.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const jobDateOnly = new Date(jobDate);
      jobDateOnly.setHours(0, 0, 0, 0);

      // Format date in British format
      const formattedDate = `${String(jobDate.getDate()).padStart(2, '0')}/${String(jobDate.getMonth() + 1).padStart(2, '0')}/${String(jobDate.getFullYear()).slice(-2)}`;

      if (jobDateOnly.getTime() === today.getTime()) {
        showToast(
          `Job created successfully! It will appear in today's jobs (${formattedDate}).`,
          'success',
        );
      } else if (jobDateOnly.getTime() > today.getTime()) {
        showToast(
          `Job created successfully! Scheduled for ${formattedDate}. Check "Upcoming Jobs" section.`,
          'success',
        );
      } else {
        showToast(
          `Job created successfully! Scheduled for ${formattedDate}. Check "Recent Jobs" section.`,
          'success',
        );
      }
    },
    onError: (error: Error) => {
      console.error('Job creation error:', error);
      const errorMessage =
        error.message || 'Failed to create job. Please check all fields and try again.';
      showToast(errorMessage, 'error');
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
    createJob: async (data: CreateJobDto) => {
      return new Promise((resolve, reject) => {
        createJob.mutate(data, {
          onSuccess: (result) => resolve(result),
          onError: (error) => reject(error),
        });
      });
    },
    updateJob: (id: string, data: UpdateJobDto) => updateJob.mutate({ id, data }),
    deleteJob: (id: string) => deleteJob.mutate(id),
    isCreating: createJob.isPending,
    isUpdating: updateJob.isPending,
    isDeleting: deleteJob.isPending,
  };
}
