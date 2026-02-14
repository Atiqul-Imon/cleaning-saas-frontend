'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import { apiClient } from '../api-client-singleton';

interface UserRole {
  id: string;
  email: string;
  role: 'OWNER' | 'CLEANER' | 'ADMIN';
}

export function useUserRole() {
  const supabase = createClient();

  const { data: userRole, isLoading, error, refetch } = useQuery<UserRole | null>({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }

      try {
        const roleData = await apiClient.get<UserRole>('/auth/me');
        return roleData;
      } catch (error) {
        console.error('Failed to load user role:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - user role doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 1,
  });

  return {
    userRole: userRole ?? null,
    loading: isLoading,
    error,
    refetch,
  };
}


