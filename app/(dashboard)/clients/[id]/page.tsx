'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Stack, Section, Grid, PageHeader } from '@/components/layout';
import { Card, Button, Avatar, LoadingSkeleton } from '@/components/ui';
import { JobCard } from '@/features/jobs/components';

interface Client {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: {
    keySafe?: string;
    alarmCode?: string;
    pets?: string;
    preferences?: string;
  };
  jobs?: any[];
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { userRole, loading: roleLoading } = useUserRole();

  // Fetch client using React Query
  const clientQuery = useApiQuery<Client>(
    queryKeys.clients.detail(clientId),
    `/clients/${clientId}`,
    {
      enabled: !!clientId && !!userRole,
    },
  );

  const client = clientQuery.data;
  const loading = clientQuery.isLoading;
  const isOwner = userRole?.role === 'OWNER';

  if (loading || roleLoading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

  if (!client) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">Client not found</h3>
                <p className="text-[var(--gray-600)] mb-6">
                  The client you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link href="/clients">
                  <Button variant="primary">Back to Clients</Button>
                </Link>
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
            title={client.name}
            description={
              client.phone || client.address
                ? `${client.phone ? client.phone : ''}${client.phone && client.address ? ' • ' : ''}${client.address ? client.address : ''}`
                : undefined
            }
            backHref="/clients"
            backLabel="Back to Clients"
            actions={
              isOwner ? (
                <>
                  <Link href={`/jobs/create?clientId=${client.id}`}>
                    <Button variant="secondary" size="md">
                      Create Job
                    </Button>
                  </Link>
                  <Link href={`/clients/${client.id}/edit`}>
                    <Button variant="primary" size="md">
                      Edit Client
                    </Button>
                  </Link>
                </>
              ) : undefined
            }
          />

          {/* Client Info Card */}
          <Card variant="elevated" padding="md">
            <div className="flex items-start gap-4 mb-6">
              <Avatar name={client.name} size="xl" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">
                  Client Information
                </h2>
                <div className="space-y-3">
                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--primary-50)] rounded-lg">
                        <svg
                          className="w-5 h-5 text-[var(--primary-600)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                          Phone
                        </p>
                        <p className="text-base font-medium text-[var(--gray-900)]">
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[var(--accent-50)] rounded-lg">
                        <svg
                          className="w-5 h-5 text-[var(--accent-600)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                          Address
                        </p>
                        <p className="text-base font-medium text-[var(--gray-900)] break-words">
                          {client.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secure Notes */}
            {client.notes &&
              (client.notes.keySafe ||
                client.notes.alarmCode ||
                client.notes.pets ||
                client.notes.preferences) && (
                <div className="pt-6 border-t border-[var(--gray-200)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[var(--primary-50)] rounded-lg">
                      <svg
                        className="w-5 h-5 text-[var(--primary-600)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--gray-900)]">Secure Notes</h3>
                  </div>
                  <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                    <Stack spacing="md">
                      {client.notes.keySafe && (
                        <div>
                          <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                            Key Safe
                          </p>
                          <p className="text-sm font-medium text-[var(--gray-900)]">
                            {client.notes.keySafe}
                          </p>
                        </div>
                      )}
                      {client.notes.alarmCode && (
                        <div>
                          <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                            Alarm Code
                          </p>
                          <p className="text-sm font-medium text-[var(--gray-900)]">
                            {client.notes.alarmCode}
                          </p>
                        </div>
                      )}
                      {client.notes.pets && (
                        <div>
                          <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                            Pets & Special Instructions
                          </p>
                          <p className="text-sm font-medium text-[var(--gray-900)]">
                            {client.notes.pets}
                          </p>
                        </div>
                      )}
                      {client.notes.preferences && (
                        <div>
                          <p className="text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wide mb-1">
                            Client Preferences
                          </p>
                          <p className="text-sm font-medium text-[var(--gray-900)] whitespace-pre-wrap">
                            {client.notes.preferences}
                          </p>
                        </div>
                      )}
                    </Stack>
                  </Card>
                </div>
              )}
          </Card>

          {/* Job History */}
          <Card variant="elevated" padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--gray-900)] mb-1">Job History</h2>
                <p className="text-sm text-[var(--gray-600)]">
                  {client.jobs?.length || 0} {client.jobs?.length === 1 ? 'job' : 'jobs'} total
                </p>
              </div>
              {isOwner && (
                <Link href={`/jobs/create?clientId=${client.id}`}>
                  <Button variant="primary" size="sm">
                    Create Job
                  </Button>
                </Link>
              )}
            </div>
            {client.jobs && client.jobs.length > 0 ? (
              <Grid cols={3} gap="md">
                {client.jobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    client={{
                      id: client.id,
                      name: client.name,
                    }}
                    type={job.type || 'ONE_OFF'}
                    scheduledDate={job.scheduledDate}
                    scheduledTime={job.scheduledTime}
                    status={job.status}
                    cleaner={job.cleaner}
                  />
                ))}
              </Grid>
            ) : (
              <Card variant="elevated" padding="lg" className="text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[var(--gray-400)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">No jobs yet</h3>
                    <p className="text-[var(--gray-600)] mb-6">
                      {isOwner
                        ? 'Create the first job for this client to get started'
                        : 'No jobs assigned for this client yet'}
                    </p>
                    {isOwner && (
                      <Link href={`/jobs/create?clientId=${client.id}`}>
                        <Button variant="primary" size="lg">
                          Create First Job
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}
