import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobManagement } from './useJobManagement';
import { useJobDefaults } from './useJobDefaults';
import { JobsService } from '../services/jobs.service';
import { useToast } from '@/lib/toast-context';
import type { CreateJobDto } from '../types/job.types';

/**
 * Hook for job form management
 * Handles form state, validation, and submission
 * Uses smart defaults: remembers last client, time, type
 */
export function useJobForm(initialData?: Partial<CreateJobDto>) {
  const router = useRouter();
  const { createJob, isCreating } = useJobManagement();
  const { showToast } = useToast();
  const { get: getDefaults, set: setDefaults } = useJobDefaults();

  const [formData, setFormData] = useState<CreateJobDto>(() => {
    const fromStorage = getDefaults();
    const storedFreq = fromStorage?.frequency;
    const validFreq =
      storedFreq === 'WEEKLY' || storedFreq === 'BI_WEEKLY' ? storedFreq : undefined;
    return {
      clientId: initialData?.clientId || fromStorage?.clientId || '',
      cleanerId: initialData?.cleanerId,
      type: initialData?.type ?? (fromStorage?.type as CreateJobDto['type']) ?? 'ONE_OFF',
      frequency: initialData?.frequency ?? validFreq,
      scheduledDate: initialData?.scheduledDate || '',
      scheduledTime: initialData?.scheduledTime ?? fromStorage?.scheduledTime,
      reminderEnabled:
        initialData?.reminderEnabled !== undefined ? initialData.reminderEnabled : true,
      reminderTime: initialData?.reminderTime || '1 day',
    };
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

    try {
      const transformedData = JobsService.transformJobData(formData);
      await createJob(transformedData);

      // Save smart defaults for next time
      setDefaults({
        clientId: formData.clientId,
        scheduledTime: formData.scheduledTime,
        type: formData.type,
        frequency: formData.frequency,
      });

      router.push('/jobs');
      router.refresh();
    } catch (error) {
      // Error is already handled by useJobManagement hook
      // Don't navigate on error
      console.error('Job creation failed:', error);
    }
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
