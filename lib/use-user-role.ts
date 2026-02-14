'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';

interface UserRole {
  id: string;
  email: string;
  role: 'OWNER' | 'CLEANER' | 'ADMIN';
}

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const roleData = await apiClient.get<UserRole>('/auth/me');
      setUserRole(roleData);
    } catch (error) {
      console.error('Failed to load user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return { userRole, loading, refetch: loadUserRole };
}






