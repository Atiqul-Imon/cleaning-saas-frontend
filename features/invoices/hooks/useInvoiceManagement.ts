import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/toast-context';
import { invoicesApi } from '../services/invoices.api';
import { InvoicesService } from '../services/invoices.service';
import type { CreateInvoiceDto, UpdateInvoiceDto } from '../types/invoice.types';

/**
 * Hook for invoice management operations (create, update)
 * Includes business logic validation
 */
export function useInvoiceManagement() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createInvoice = useMutation({
    mutationFn: ({ jobId, amount }: CreateInvoiceDto) => {
      // Validate before API call
      const validation = InvoicesService.validateCreateInvoice({ jobId, amount });
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return invoicesApi.createFromJob(jobId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      showToast('Invoice created successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create invoice', 'error');
    },
  });

  const updateInvoice = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceDto }) => {
      // Validate before API call
      const validation = InvoicesService.validateUpdateInvoice(data);
      if (!validation.valid) {
        throw new Error(validation.errors?.join(', ') || 'Validation failed');
      }
      return invoicesApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      showToast('Invoice updated successfully!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update invoice', 'error');
    },
  });

  return {
    createInvoice: (jobId: string, amount: number) => createInvoice.mutate({ jobId, amount }),
    updateInvoice: (id: string, data: UpdateInvoiceDto) => updateInvoice.mutate({ id, data }),
    isCreating: createInvoice.isPending,
    isUpdating: updateInvoice.isPending,
  };
}

