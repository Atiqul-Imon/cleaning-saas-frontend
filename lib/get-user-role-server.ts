import { createClient } from './supabase-server';

/**
 * Get user role on the server side
 * Used for server-side redirects and role-based routing
 *
 * Note: This function uses cookies, so pages using it must be marked as dynamic
 * by adding `export const dynamic = 'force-dynamic'` to the page/layout
 */
export async function getUserRoleServer(): Promise<{
  id: string;
  email: string;
  role: 'OWNER' | 'CLEANER' | 'ADMIN';
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get user role from API
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api.clenvora.com'
        : 'http://localhost:5000');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache role checks
    });

    if (!response.ok) {
      // If API returns 401/403, user is not authenticated or doesn't have access
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      // For other errors, log but don't throw
      console.warn(`Failed to get user role: ${response.status} ${response.statusText}`);
      return null;
    }

    const roleData = await response.json();
    return roleData;
  } catch (error) {
    // Log error but don't throw - return null to allow graceful degradation
    console.error('Failed to get user role on server:', error);
    return null;
  }
}
