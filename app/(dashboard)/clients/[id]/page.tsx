'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { Card, Button, Avatar, Badge, LoadingSkeleton, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole, loading: roleLoading } = useUserRole();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  const isOwner = userRole?.role === 'OWNER';
  const isCleaner = userRole?.role === 'CLEANER';

  useEffect(() => {
    if (params.id) {
      loadClient();
    }
  }, [params.id]);

  const loadClient = async () => {
    try {
      const data = await apiClient.get<Client>(`/clients/${params.id}`);
      setClient(data);
    } catch (error) {
      console.error('Failed to load client:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="bg-[var(--error-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[var(--gray-900)] font-bold text-lg mb-4">Client not found</p>
            <Link href="/clients">
              <Button variant="primary">Back to Clients</Button>
            </Link>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Link href="/clients" className="mb-6 inline-block">
          <Button variant="ghost" size="sm" leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }>
            Back to Clients
          </Button>
        </Link>

        <Card variant="elevated" padding="lg" className="mb-8">
          <Stack direction="row" justify="between" align="start" className="mb-6">
            <Stack direction="row" spacing="md" align="center">
              <Avatar name={client.name} size="xl" />
              <div>
                <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">{client.name}</h1>
                <Stack direction="row" spacing="md" align="center">
                  {client.phone && (
                    <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-600)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-semibold">{client.phone}</span>
                    </Stack>
                  )}
                  {client.address && (
                    <Stack direction="row" spacing="sm" align="center" className="text-[var(--gray-600)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{client.address}</span>
                    </Stack>
                  )}
                </Stack>
              </div>
            </Stack>
            {isOwner && (
              <Link href={`/clients/${client.id}/edit`}>
                <Button variant="primary" size="md">Edit Client</Button>
              </Link>
            )}
          </Stack>

          {client.notes && (client.notes.keySafe || client.notes.alarmCode || client.notes.pets || client.notes.preferences) && (
            <div className="mt-8 pt-8 border-t border-[var(--gray-200)]">
              <Stack direction="row" spacing="sm" align="center" className="mb-6">
                <svg className="w-6 h-6 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h2 className="text-2xl font-bold text-[var(--gray-900)]">Secure Notes</h2>
              </Stack>
              <Card variant="outlined" padding="md" className="bg-[var(--gray-50)]">
                <Stack spacing="md">
                  {client.notes.keySafe && (
                    <div>
                      <span className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wide">Key Safe:</span>
                      <p className="text-[var(--gray-900)] font-medium mt-1">{client.notes.keySafe}</p>
                    </div>
                  )}
                  {client.notes.alarmCode && (
                    <div>
                      <span className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wide">Alarm Code:</span>
                      <p className="text-[var(--gray-900)] font-medium mt-1">{client.notes.alarmCode}</p>
                    </div>
                  )}
                  {client.notes.pets && (
                    <div>
                      <span className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wide">Pets & Special Instructions:</span>
                      <p className="text-[var(--gray-900)] font-medium mt-1">{client.notes.pets}</p>
                    </div>
                  )}
                  {client.notes.preferences && (
                    <div>
                      <span className="text-sm font-bold text-[var(--gray-700)] uppercase tracking-wide">Client Preferences:</span>
                      <p className="text-[var(--gray-900)] font-medium mt-1">{client.notes.preferences}</p>
                    </div>
                  )}
                </Stack>
              </Card>
            </div>
          )}
        </Card>

        <Card variant="elevated" padding="lg">
          <Stack direction="row" justify="between" align="center" className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--gray-900)]">Job History</h2>
            {isOwner && (
              <Link href={`/jobs/create?clientId=${client.id}`}>
                <Button variant="primary" size="sm">Create Job</Button>
              </Link>
            )}
          </Stack>
          {client.jobs && client.jobs.length > 0 ? (
            <Stack spacing="md">
              {client.jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card variant="outlined" padding="md" hover>
                    <Stack direction="row" justify="between" align="center">
                      <div>
                        <p className="font-bold text-[var(--gray-900)] text-lg">
                          {new Date(job.scheduledDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        {job.scheduledTime && (
                          <p className="text-sm text-[var(--gray-600)] font-medium mt-1">{job.scheduledTime}</p>
                        )}
                      </div>
                        <Badge
                          variant={
                            job.status === 'COMPLETED'
                              ? 'success'
                              : job.status === 'IN_PROGRESS'
                              ? 'warning'
                              : 'primary'
                          }
                          size="md"
                        >
                          {job.status.replace('_', ' ')}
                        </Badge>
                    </Stack>
                  </Card>
                </Link>
              ))}
            </Stack>
          ) : (
            <EmptyState
              title="No jobs yet"
              description={
                isOwner
                  ? 'Create the first job for this client to get started'
                  : 'No jobs assigned for this client yet'
              }
              icon={
                <svg className="w-16 h-16 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              action={
                isOwner ? {
                  label: 'Create First Job',
                  href: `/jobs/create?clientId=${client.id}`,
                } : undefined
              }
            />
          )}
        </Card>
      </Container>
    </Section>
  );
}
