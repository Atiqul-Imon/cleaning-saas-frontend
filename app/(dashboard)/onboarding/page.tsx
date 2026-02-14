'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useUserRole } from '@/lib/use-user-role';
import BusinessForm from '@/components/BusinessForm';
import { Container, Stack, Section } from '@/components/layout';
import { Card, LoadingSkeleton } from '@/components/ui';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const supabase = createClient();
  const { userRole, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (roleLoading || !userRole || hasRedirected) {
      return;
    }

    if (userRole.role === 'CLEANER') {
      setHasRedirected(true);
      router.replace('/dashboard');
      return;
    }
    
    if (userRole.role === 'OWNER' || userRole.role === 'ADMIN') {
      checkBusiness();
    } else {
      setHasRedirected(true);
      router.replace('/dashboard');
    }
  }, [userRole, roleLoading]);

  const checkBusiness = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const apiClient = new ApiClient(async () => session.access_token);
      try {
        await apiClient.get('/business');
        router.replace('/dashboard');
      } catch {
        if (userRole?.role === 'OWNER' || userRole?.role === 'ADMIN') {
          setLoading(false);
        } else {
          router.replace('/dashboard');
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSuccess = async () => {
    router.replace('/dashboard');
    await new Promise(resolve => setTimeout(resolve, 200));
    router.refresh();
  };

  if (roleLoading || loading || userRole?.role === 'CLEANER') {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <LoadingSkeleton type="card" count={1} className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg" className="min-h-screen">
      <Container size="lg">
        <div className="max-w-3xl mx-auto">
          <Stack spacing="xl" align="center" className="mb-10">
            <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-[var(--gray-900)] mb-4">Set Up Your Business</h1>
              <p className="text-[var(--gray-600)] text-lg font-medium">
                Get started by adding your business information
              </p>
            </div>
          </Stack>

          <Card variant="elevated" padding="lg">
            <BusinessForm onSuccess={handleSuccess} />
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--gray-500)]">
              This information will be used on invoices and client communications
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
