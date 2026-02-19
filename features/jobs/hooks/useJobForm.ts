import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobManagement } from './useJobManagement';
import { JobsService } from '../services/jobs.service';
import { useToast } from '@/lib/toast-context';
import type { CreateJobDto } from '../types/job.types';

/**
 * Hook for job form management
 * Handles form state, validation, and submission
 */
export function useJobForm(initialData?: Partial<CreateJobDto>) {
  const router = useRouter();
  const { createJob, isCreating } = useJobManagement();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CreateJobDto>({
    clientId: initialData?.clientId || '',
    cleanerId: initialData?.cleanerId,
    type: initialData?.type || 'ONE_OFF',
    frequency: initialData?.frequency,
    scheduledDate: initialData?.scheduledDate || '',
    scheduledTime: initialData?.scheduledTime,
    reminderEnabled:
      initialData?.reminderEnabled !== undefined ? initialData.reminderEnabled : true,
    reminderTime: initialData?.reminderTime || '1 day',
  });

  const [errors, setErrors] = useState<string[]>([]);

  /**
   * Update form field
   */
  const updateField = <K extends keyof CreateJobDto>(field: K, value: CreateJobDto[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const validation = JobsService.validateCreateJob(formData);
    if (!validation.valid && validation.errors) {
      setErrors(validation.errors);
      showToast(validation.errors[0], 'error');
      return false;
    }
    setErrors([]);
    return true;
  };

  /**
   * Submit form
   */
  const submit = async () => {
    if (!validate()) {
      return;
    }

    const transformedData = JobsService.transformJobData(formData);
    createJob(transformedData);

    // Navigation is handled in useJobManagement hook via success callback
    router.push('/jobs');
    router.refresh();
  };

  return {
    formData,
    updateField,
    errors,
    validate,
    submit,
    isSubmitting: isCreating,
  };
}
