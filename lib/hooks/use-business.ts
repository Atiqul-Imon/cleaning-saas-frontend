'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useApiQuery } from './use-api';
import { useUserRole } from '@/lib/use-user-role';

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  invoiceTemplate?: string;
}

export function useBusiness() {
  const supabase = createClient();
  const { userRole } = useUserRole();
  const [user, setUser] = useState<any>(null);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setHasUser(!!user);
  };

  // Only fetch business for OWNER role
  const shouldFetch = hasUser && userRole?.role === 'OWNER';

  const { data: business, isLoading, error } = useApiQuery<Business>(
    ['business', user?.id || ''],
    '/business',
    {
      enabled: shouldFetch,
      retry: false,
    }
  );

  return {
    business,
    isLoading,
    error,
    businessName: business?.name || null,
  };
}

