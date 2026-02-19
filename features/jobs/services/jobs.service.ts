import type { CreateJobDto, UpdateJobDto } from '../types/job.types';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Jobs Business Logic Service
 * Contains validation and business rules for jobs
 */
export class JobsService {
  /**
   * Validate job creation data
   */
  static validateCreateJob(data: CreateJobDto): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.clientId) {
      errors.push('Client is required');
    }

    if (!data.type) {
      errors.push('Job type is required');
    }

    if (!data.scheduledDate) {
      errors.push('Scheduled date is required');
    }

    // Validate date is not in the past
    if (data.scheduledDate) {
      const scheduledDate = new Date(data.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    // Validate recurring job has frequency
    if (data.type === 'RECURRING' && !data.frequency) {
      errors.push('Frequency is required for recurring jobs');
    }

    // Validate reminder time format
    if (data.reminderTime && !this.isValidReminderTime(data.reminderTime)) {
      errors.push('Invalid reminder time format');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Validate job update data
   */
  static validateUpdateJob(data: UpdateJobDto): ValidationResult {
    const errors: string[] = [];

    // Validate date is not in the past (if provided)
    if (data.scheduledDate) {
      const scheduledDate = new Date(data.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        errors.push('Scheduled date cannot be in the past');
      }
    }

    // Validate reminder time format
    if (data.reminderTime && !this.isValidReminderTime(data.reminderTime)) {
      errors.push('Invalid reminder time format');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Check if reminder time format is valid
   */
  private static isValidReminderTime(time: string): boolean {
    const validTimes = ['30 minutes', '1 hour', '2 hours', '1 day', '2 days'];
    return validTimes.includes(time);
  }

  /**
   * Transform job data for API
   */
  static transformJobData(data: CreateJobDto): CreateJobDto {
    return {
      clientId: data.clientId,
      cleanerId: data.cleanerId,
      type: data.type,
      frequency: data.type === 'RECURRING' ? data.frequency : undefined,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || undefined,
      reminderEnabled: data.reminderEnabled !== undefined ? data.reminderEnabled : true,
      reminderTime: data.reminderTime || '1 day',
    };
  }

  /**
   * Check if job can be edited
   */
  static canEditJob(jobStatus: string): boolean {
    return jobStatus !== 'COMPLETED';
  }

  /**
   * Check if job can be deleted
   */
  static canDeleteJob(jobStatus: string): boolean {
    return jobStatus === 'SCHEDULED';
  }

  /**
   * Get next status for a job
   */
  static getNextStatus(currentStatus: string): string | null {
    const statusFlow: Record<string, string> = {
      SCHEDULED: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
    };
    return statusFlow[currentStatus] || null;
  }

  /**
   * Format job status for display
   */
  static formatStatus(status: string): string {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
