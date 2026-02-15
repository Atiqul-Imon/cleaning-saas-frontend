'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useClientForm } from '@/features/clients/hooks/useClientForm';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Container, Stack, Section, Divider } from '@/components/layout';
import { Card, Button, Input, Textarea } from '@/components/ui';

export default function CreateClientPage() {
  const router = useRouter();
  const { canCreateClients } = usePermissions();
  const { formData, updateField, errors, submit, isSubmitting } = useClientForm();

  if (!canCreateClients) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
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
            {errors.length > 0 && (
              <Card variant="outlined" padding="md" className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]">
                <Stack direction="row" spacing="sm" align="center">
                  <svg className="w-6 h-6 text-[var(--error-600)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    {errors.map((error, index) => (
                      <p key={index} className="text-[var(--error-900)] font-semibold">{error}</p>
                    ))}
                  </div>
                </Stack>
              </Card>
            )}

            <Stack spacing="lg">
              <Input
                label="Client Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter client name"
              />

              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value || undefined)}
                placeholder="Enter phone number"
                helperText="Optional"
              />

              <Textarea
                label="Address"
                id="address"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value || undefined)}
                placeholder="Enter client address"
                rows={3}
                helperText="Optional"
              />

              <Divider spacing="md" />

              <div>
                <h3 className="text-lg font-bold text-[var(--gray-900)] mb-4">Secure Notes</h3>
                <p className="text-sm text-[var(--gray-600)] mb-4">
                  Store important information securely (access codes, key safe locations, etc.)
                </p>
                <Stack spacing="md">
                  <Input
                    label="Key Safe Code"
                    id="keySafe"
                    value={formData.keySafe || ''}
                    onChange={(e) => updateField('keySafe', e.target.value || undefined)}
                    placeholder="Enter key safe code"
                    helperText="Optional"
                  />

                  <Input
                    label="Alarm Code"
                    id="alarmCode"
                    value={formData.alarmCode || ''}
                    onChange={(e) => updateField('alarmCode', e.target.value || undefined)}
                    placeholder="Enter alarm code"
                    helperText="Optional"
                  />

                  <Input
                    label="Access Information"
                    id="accessInfo"
                    value={formData.accessInfo || ''}
                    onChange={(e) => updateField('accessInfo', e.target.value || undefined)}
                    placeholder="Enter access information"
                    helperText="Optional"
                  />

                  <Input
                    label="Pets"
                    id="pets"
                    value={formData.pets || ''}
                    onChange={(e) => updateField('pets', e.target.value || undefined)}
                    placeholder="Enter pet information"
                    helperText="Optional"
                  />

                  <Textarea
                    label="Preferences"
                    id="preferences"
                    value={formData.preferences || ''}
                    onChange={(e) => updateField('preferences', e.target.value || undefined)}
                    placeholder="Enter client preferences"
                    rows={3}
                    helperText="Optional"
                  />
                </Stack>
              </div>

              <Divider spacing="md" />

              <Stack direction="row" spacing="md">
                <Link href="/clients" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
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
