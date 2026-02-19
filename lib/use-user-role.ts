'use client';

import { useState, useEffect, useRef } from 'react';
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
  const supabaseRef = useRef(createClient());
  const apiClientRef = useRef(
    new ApiClient(async () => {
      const {
        data: { session },
      } = await supabaseRef.current.auth.getSession();
      return session?.access_token || null;
    }),
  );

  useEffect(() => {
    let isMounted = true;

    const loadUserRole = async () => {
      try {
        if (!isMounted) {
          return;
        }

        const {
          data: { user },
        } = await supabaseRef.current.auth.getUser();
        if (!user) {
          if (isMounted) {
            setUserRole(null);
            setLoading(false);
          }
          return;
        }

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });

        const roleDataPromise = apiClientRef.current.get<UserRole>('/auth/me');
        const roleData = await Promise.race([roleDataPromise, timeoutPromise]);

        if (isMounted) {
          setUserRole(roleData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load user role:', error);
        if (isMounted) {
          setUserRole(null);
          setLoading(false);
        }
      }
    };

    loadUserRole();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabaseRef.current.auth.getUser();
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });

      const roleDataPromise = apiClientRef.current.get<UserRole>('/auth/me');
      const roleData = await Promise.race([roleDataPromise, timeoutPromise]);
      setUserRole(roleData);
    } catch (error) {
      console.error('Failed to load user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return { userRole, loading, refetch };
}
