import { requireCleanerRole } from '@/lib/require-owner-role';
import MyJobsPageClient from './page-client';

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

/**
 * Server component wrapper for /my-jobs
 * Ensures only cleaners can access this page (server-side)
 */
export default async function MyJobsPage() {
  await requireCleanerRole();
  return <MyJobsPageClient />;
}
