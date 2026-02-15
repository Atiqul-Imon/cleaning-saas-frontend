import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientManagement } from './useClientManagement';
import { ClientsService } from '../services/clients.service';
import { useToast } from '@/lib/toast-context';
import type { CreateClientDto, UpdateClientDto } from '../types/client.types';

/**
 * Hook for client form management
 * Handles form state, validation, and submission
 */
export function useClientForm(initialData?: Partial<CreateClientDto> | { notes?: any; [key: string]: any }, isEdit = false) {
  const router = useRouter();
  const { createClient, updateClient, isCreating, isUpdating } = useClientManagement();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CreateClientDto>({
    name: (initialData?.name as string) || '',
    phone: initialData?.phone,
    address: initialData?.address,
    keySafe: (initialData as any)?.notes?.keySafe || (initialData as any)?.keySafe,
    alarmCode: (initialData as any)?.notes?.alarmCode || (initialData as any)?.alarmCode,
    pets: (initialData as any)?.notes?.pets || (initialData as any)?.pets,
    preferences: (initialData as any)?.notes?.preferences || (initialData as any)?.preferences,
    accessInfo: (initialData as any)?.notes?.accessInfo || (initialData as any)?.accessInfo,
  });

  const [errors, setErrors] = useState<string[]>([]);

  /**
   * Update form field
   */
  const updateField = <K extends keyof CreateClientDto>(field: K, value: CreateClientDto[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const validation = isEdit
      ? ClientsService.validateUpdateClient(formData)
      : ClientsService.validateCreateClient(formData);
    
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
  const submit = async (clientId?: string) => {
    if (!validate()) {
      return;
    }

    const transformedData = ClientsService.transformClientData(formData);
    
    if (isEdit && clientId) {
      updateClient(clientId, transformedData);
    } else {
      createClient(transformedData);
    }
    
    // Navigation is handled in useClientManagement hook via success callback
    router.push('/clients');
    router.refresh();
  };

  return {
    formData,
    updateField,
    errors,
    validate,
    submit,
    isSubmitting: isCreating || isUpdating,
  };
}

