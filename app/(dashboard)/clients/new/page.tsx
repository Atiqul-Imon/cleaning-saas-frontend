'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useUserRole } from '@/lib/use-user-role';
import { Container, Stack, Section, Divider } from '@/components/layout';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

export default function CreateClientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useUserRole();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (userRole && userRole.role !== 'OWNER' && userRole.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [userRole, router]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    keySafe: '',
    alarmCode: '',
    pets: '',
    preferences: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const clientData: any = {
        name: formData.name,
      };

      if (formData.phone) clientData.phone = formData.phone;
      if (formData.address) clientData.address = formData.address;

      const notes: any = {};
      if (formData.keySafe) notes.keySafe = formData.keySafe;
      if (formData.alarmCode) notes.alarmCode = formData.alarmCode;
      if (formData.pets) notes.pets = formData.pets;
      if (formData.preferences) notes.preferences = formData.preferences;

      if (Object.keys(notes).length > 0) {
        clientData.notes = notes;
      }

      await apiClient.post('/clients', clientData);
      showToast('Client created successfully!', 'success');
      router.push('/clients');
      router.refresh();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create client';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

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

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Add New Client</h1>
          <p className="text-[var(--gray-600)] text-lg">
            Create a new client profile with contact information and secure notes
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit}>
            {error && (
              <Card variant="outlined" padding="md" className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]">
                <Stack direction="row" spacing="sm" align="center">
                  <svg className="w-6 h-6 text-[var(--error-600)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[var(--error-900)] font-semibold">{error}</span>
                </Stack>
              </Card>
            )}

            <Stack spacing="lg">
              <Input
                label="Client Name"
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter client name"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 20 1234 5678"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <Textarea
                label="Address"
                id="address"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
              />

              <Divider spacing="lg" />

              <div>
                <Stack direction="row" spacing="sm" align="center" className="mb-4">
                  <svg className="w-6 h-6 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-[var(--gray-900)]">Secure Notes</h2>
                </Stack>
                <p className="text-sm text-[var(--gray-600)] mb-6">
                  These notes are stored securely and only visible to your team.
                </p>

                <Stack spacing="md">
                  <Input
                    label="Key Safe Location"
                    id="keySafe"
                    type="text"
                    value={formData.keySafe}
                    onChange={(e) => setFormData({ ...formData, keySafe: e.target.value })}
                    placeholder="e.g., Under the doormat"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    }
                  />

                  <Input
                    label="Alarm Code"
                    id="alarmCode"
                    type="text"
                    value={formData.alarmCode}
                    onChange={(e) => setFormData({ ...formData, alarmCode: e.target.value })}
                    placeholder="Enter alarm code"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />

                  <Textarea
                    label="Pets & Special Instructions"
                    id="pets"
                    rows={2}
                    value={formData.pets}
                    onChange={(e) => setFormData({ ...formData, pets: e.target.value })}
                    placeholder="e.g., Dog in kitchen, avoid bedroom"
                  />

                  <Textarea
                    label="Client Preferences"
                    id="preferences"
                    rows={2}
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                    placeholder="e.g., Use eco-friendly products, focus on kitchen"
                  />
                </Stack>
              </div>

              <Divider spacing="lg" />

              <Stack direction="row" spacing="md">
                <Link href="/clients" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  className="flex-1"
                >
                  Create Client
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
