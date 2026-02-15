import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/toast-context';
import { clientsApi } from '../services/clients.api';
import { ClientsService } from '../services/clients.service';
import type { CreateClientDto, UpdateClientDto } from '../types/client.types';

/**
 * Hook for client management operations (create, update, delete)
 * Includes business logic validation
 */
export function useClientManagement() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createClient = useMutation({
    mutationFn: (data: CreateClientDto) => {
      // Validate before API call
      const validation = ClientsService.validateCreateClient(data);
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return clientsApi.create(ClientsService.transformClientData(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showToast('Client created successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create client', 'error');
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientDto }) => {
      // Validate before API call
      const validation = ClientsService.validateUpdateClient(data);
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return clientsApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client'] });
      showToast('Client updated successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update client', 'error');
    },
  });

  const deleteClient = useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showToast('Client deleted successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete client', 'error');
    },
  });

  return {
    createClient: (data: CreateClientDto) => createClient.mutate(data),
    updateClient: (id: string, data: UpdateClientDto) => updateClient.mutate({ id, data }),
    deleteClient: (id: string) => deleteClient.mutate(id),
    isCreating: createClient.isPending,
    isUpdating: updateClient.isPending,
    isDeleting: deleteClient.isPending,
  };
}

