'use client';

import Link from 'next/link';
import { useClients } from '@/features/clients/hooks/useClients';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Container, Grid, Stack, Section, PageHeader } from '@/components/layout';
import { Card, Button, LoadingSkeleton } from '@/components/ui';
import { ClientCard } from '@/features/clients/components';

export default function ClientsPage() {
  const { clients, isLoading, error, userRole } = useClients();
  const { canCreateClients } = usePermissions();
  const loading = isLoading;

  const isCleaner = userRole?.role === 'CLEANER';

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton
            type="card"
            count={6}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-[var(--error-50)] rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--error-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Error Loading Clients
                </h3>
                <p className="text-[var(--gray-600)] mb-6">
                  {(error as Error)?.message || 'Failed to load clients'}
                </p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack spacing="lg">
          {/* Page Header */}
          <PageHeader
            title={isCleaner ? 'My Clients' : 'Clients'}
            description={isCleaner ? 'Clients you work with' : 'Manage your client relationships'}
            actions={
              canCreateClients ? (
                <Link href="/clients/new">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    leftIcon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  >
                    Add Client
                  </Button>
                </Link>
              ) : undefined
            }
          />

          {/* Clients List */}
          {!loading && clients.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[var(--gray-400)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                    {isCleaner ? 'No clients assigned yet' : 'No clients yet'}
                  </h3>
                  <p className="text-[var(--gray-600)] mb-6">
                    {isCleaner
                      ? 'You will see clients here once jobs are assigned to you.'
                      : 'Add your first client to get started managing your cleaning business'}
                  </p>
                  {canCreateClients && (
                    <Link href="/clients/new">
                      <Button variant="primary" size="lg">
                        Add First Client
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Grid cols={3} gap="md">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  id={client.id}
                  name={client.name}
                  phone={client.phone}
                  address={client.address}
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
