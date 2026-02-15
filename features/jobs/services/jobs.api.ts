import { apiClient } from '@/shared/services/api-client';
import type { Job, CreateJobDto, UpdateJobDto } from '../types/job.types';

/**
 * Jobs API Service
 * Handles all API calls related to jobs
 */
export const jobsApi = {
  /**
   * Get all jobs for the current user
   */
  getAll: (): Promise<Job[]> => {
    return apiClient.get<Job[]>('/jobs');
  },

  /**
   * Get a single job by ID
   */
  getById: (id: string): Promise<Job> => {
    return apiClient.get<Job>(`/jobs/${id}`);
  },

  /**
   * Get today's jobs
   */
  getToday: (): Promise<Job[]> => {
    return apiClient.get<Job[]>('/jobs/today');
  },

  /**
   * Create a new job
   */
  create: (data: CreateJobDto): Promise<Job> => {
    return apiClient.post<Job>('/jobs', data);
  },

  /**
   * Update an existing job
   */
  update: (id: string, data: UpdateJobDto): Promise<Job> => {
    return apiClient.put<Job>(`/jobs/${id}`, data);
  },

  /**
   * Delete a job
   */
  delete: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/jobs/${id}`);
  },

  /**
   * Add a photo to a job
   */
  addPhoto: (id: string, data: { imageUrl: string; photoType: 'BEFORE' | 'AFTER' }): Promise<void> => {
    return apiClient.post<void>(`/jobs/${id}/photos`, data);
  },

  /**
   * Update a checklist item
   */
  updateChecklistItem: (jobId: string, itemId: string, completed: boolean): Promise<void> => {
    return apiClient.put<void>(`/jobs/${jobId}/checklist/${itemId}`, { completed });
  },

  /**
   * Get WhatsApp link for job photos
   */
  getWhatsAppPhotosLink: (id: string, photoType: 'BEFORE' | 'AFTER' | 'ALL'): Promise<{ whatsappUrl: string | null; phoneNumber?: string }> => {
    return apiClient.get<{ whatsappUrl: string | null; phoneNumber?: string }>(`/jobs/${id}/whatsapp/photos?photoType=${photoType}`);
  },

  /**
   * Get WhatsApp link for job completion
   */
  getWhatsAppCompletionLink: (id: string): Promise<{ whatsappUrl: string | null; phoneNumber?: string }> => {
    return apiClient.get<{ whatsappUrl: string | null; phoneNumber?: string }>(`/jobs/${id}/whatsapp/completion`);
  },
};

