import { apiClient } from '@/shared/services/api-client';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/client.types';

/**
 * Clients API Service
 * Handles all API calls related to clients
 */
export const clientsApi = {
  /**
   * Get all clients for the current user
   */
  getAll: (): Promise<Client[]> => {
    return apiClient.get<Client[]>('/clients');
  },

  /**
   * Get a single client by ID
   */
  getById: (id: string): Promise<Client> => {
    return apiClient.get<Client>(`/clients/${id}`);
  },

  /**
   * Create a new client
   */
  create: (data: CreateClientDto): Promise<Client> => {
    return apiClient.post<Client>('/clients', data);
  },

  /**
   * Update an existing client
   */
  update: (id: string, data: UpdateClientDto): Promise<Client> => {
    return apiClient.put<Client>(`/clients/${id}`, data);
  },

  /**
   * Delete a client
   */
  delete: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/clients/${id}`);
  },
};



