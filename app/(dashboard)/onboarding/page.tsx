'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/use-user-role';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { Container, Stack, Section } from '@/components/layout';
import { Card, LoadingSkeleton } from '@/components/ui';
import dynamic from 'next/dynamic';

// Lazy load BusinessForm (heavy form component)
const BusinessForm = dynamic(() => import('@/components/BusinessForm'), {
  loading: () => <LoadingSkeleton type="card" count={1} />,
  ssr: false,
});

export default function OnboardingPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();

  // Use React Query to check if business exists
  const businessQuery = useApiQuery<{ id: string; name: string }>(
    queryKeys.business.detail(userRole?.id || ''),
    '/business',
    {
      enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
      retry: false, // Don't retry 404 errors
      retryOnMount: false,
    },
  );

  useEffect(() => {
    if (roleLoading || !userRole) {
      return;
    }

    if (userRole.role === 'CLEANER') {
      setTimeout(() => router.replace('/dashboard'), 0);
      return;
    }

    // If business exists, redirect to dashboard
    if (businessQuery.data) {
      setTimeout(() => router.replace('/dashboard'), 0);
      return;
    }

    // If query failed (404), show form (business doesn't exist)
    if ((businessQuery.isError && userRole.role === 'OWNER') || userRole.role === 'ADMIN') {
      // Show form - business doesn't exist
      return;
    }
  }, [userRole, roleLoading, businessQuery.data, businessQuery.isError, router]);

  const handleSuccess = async () => {
    router.replace('/dashboard');
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.refresh();
  };

  if (
    roleLoading ||
    (userRole &&
      (userRole.role === 'OWNER' || userRole.role === 'ADMIN') &&
      businessQuery.isLoading) ||
    userRole?.role === 'CLEANER'
  ) {
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
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-[var(--gray-900)] mb-4">
                Set Up Your Business
              </h1>
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
