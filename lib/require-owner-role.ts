import { redirect } from 'next/navigation';
import { getUserRoleServer } from './get-user-role-server';

/**
 * Server-side utility to ensure only OWNER or ADMIN can access a route
 * Redirects cleaners to /my-jobs
 * Use this at the top of owner-only page components
 */
export async function requireOwnerRole() {
  const userRole = await getUserRoleServer();

  if (!userRole) {
    redirect('/login');
  }

  if (userRole.role === 'CLEANER') {
    redirect('/my-jobs');
  }

  if (userRole.role !== 'OWNER' && userRole.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return userRole;
}

/**
 * Server-side utility to ensure only CLEANER can access a route
 * Redirects owners/admins to /dashboard
 * Use this at the top of cleaner-only page components
 */
export async function requireCleanerRole() {
  const userRole = await getUserRoleServer();

  if (!userRole) {
    redirect('/login');
  }

  if (userRole.role !== 'CLEANER') {
    redirect('/dashboard');
  }

  return userRole;
}
