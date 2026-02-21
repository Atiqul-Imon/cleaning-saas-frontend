import { requireOwnerRole } from '@/lib/require-owner-role';
import StaffDetailPageClient from './page-client';

export const dynamic = 'force-dynamic';

export default async function StaffDetailPage() {
  await requireOwnerRole();
  return <StaffDetailPageClient />;
}
