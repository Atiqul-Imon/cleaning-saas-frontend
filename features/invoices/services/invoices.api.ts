import { apiClient } from '@/shared/services/api-client';
import type { Invoice, UpdateInvoiceDto } from '../types/invoice.types';

/**
 * Invoices API Service
 * Handles all API calls related to invoices
 */
export const invoicesApi = {
  /**
   * Get all invoices for the current user
   */
  getAll: (): Promise<Invoice[]> => {
    return apiClient.get<Invoice[]>('/invoices');
  },

  /**
   * Get a single invoice by ID
   */
  getById: (id: string): Promise<Invoice> => {
    return apiClient.get<Invoice>(`/invoices/${id}`);
  },

  /**
   * Create an invoice from a job
   */
  createFromJob: (jobId: string, amount: number): Promise<Invoice> => {
    return apiClient.post<Invoice>('/invoices', { jobId, amount });
  },

  /**
   * Update an existing invoice
   */
  update: (id: string, data: UpdateInvoiceDto): Promise<Invoice> => {
    return apiClient.put<Invoice>(`/invoices/${id}`, data);
  },

  /**
   * Download invoice as PDF
   * Note: This requires special handling for blob responses
   */
  downloadPDF: async (id: string): Promise<Blob> => {
    // PDF download needs to be handled differently
    // For now, return a promise that will be handled by the component
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api.clenvora.com'
        : 'http://localhost:5000');
    const response = await fetch(`${apiUrl}/invoices/${id}/pdf`, {
      headers: {
        Accept: 'application/pdf',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }
    return response.blob();
  },

  /**
   * Get WhatsApp link for invoice
   */
  getWhatsAppLink: (id: string): Promise<{ whatsappUrl: string | null; phoneNumber?: string }> => {
    return apiClient.get<{ whatsappUrl: string | null; phoneNumber?: string }>(
      `/invoices/${id}/whatsapp-link`,
    );
  },
};
