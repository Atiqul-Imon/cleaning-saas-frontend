'use client';

import Link from 'next/link';
import { useClients } from '@/features/clients/hooks/useClients';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Container, Grid, Stack, Section } from '@/components/layout';
import { Button, LoadingSkeleton, EmptyState } from '@/components/ui';
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
          <EmptyState
            title="Error Loading Clients"
            description={(error as Error)?.message || 'Failed to load clients'}
            action={{
              label: 'Try Again',
              onClick: () => window.location.reload(),
            }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack direction="row" justify="between" align="center" className="mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">
              {isCleaner ? 'My Clients' : 'Clients'}
            </h1>
            <p className="text-[var(--gray-600)]">
              {isCleaner ? 'Clients you work with' : 'Manage your client relationships'}
            </p>
          </div>
          {canCreateClients && (
            <Link href="/clients/new">
              <Button
                variant="primary"
                size="lg"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          )}
        </Stack>

        {!loading && clients.length === 0 ? (
          <EmptyState
            title={isCleaner ? 'No clients assigned yet' : 'No clients yet'}
            description={
              isCleaner
                ? 'You will see clients here once jobs are assigned to you.'
                : 'Add your first client to get started managing your cleaning business'
            }
            icon={
              <svg
                className="w-16 h-16 text-[var(--gray-400)]"
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
            }
            action={
              canCreateClients
                ? {
                    label: 'Add First Client',
                    href: '/clients/new',
                  }
                : undefined
            }
          />
        ) : (
          <Grid cols={3} gap="lg">
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
      </Container>
    </Section>
  );
}
