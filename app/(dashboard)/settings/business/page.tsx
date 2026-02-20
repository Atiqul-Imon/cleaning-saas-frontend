import { createClient } from '@/lib/supabase-server';
import { ApiClient } from '@/lib/api-client';
import BusinessForm from '@/components/BusinessForm';
import { redirect } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Card } from '@/components/ui';
import { InvoiceTemplate } from '@/features/invoices/components/InvoiceTemplates';

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  invoiceTemplate?: InvoiceTemplate;
}

async function getBusiness(_userId: string): Promise<Business | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const apiClient = new ApiClient(async () => session.access_token);

  try {
    return await apiClient.get<Business>('/business');
  } catch {
    return null;
  }
}

export default async function BusinessSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const business = await getBusiness(user.id);

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--gray-900)] mb-2">
            Business Settings
          </h1>
          <p className="text-[var(--gray-600)] text-base sm:text-lg">
            Manage your business information and preferences
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <BusinessForm business={business || undefined} />
        </Card>
      </Container>
    </Section>
  );
}
