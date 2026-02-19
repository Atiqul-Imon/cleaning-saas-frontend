import { requireOwnerRole } from '@/lib/require-owner-role';
import WorkersPageClient from './page-client';

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

/**
 * Server component wrapper for /settings/workers
 * Ensures only owners/admins can access this page (server-side)
 */
export default async function WorkersPage() {
  await requireOwnerRole();
  return <WorkersPageClient />;
}
