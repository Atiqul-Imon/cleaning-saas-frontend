import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getUserRoleServer } from '@/lib/get-user-role-server';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check user role and redirect admins to admin panel (server-side)
  const userRole = await getUserRoleServer();
  if (userRole?.role === 'ADMIN') {
    redirect('/admin');
  }

  // Note: Owner-only route protection is handled at the page level
  // This ensures cleaners are redirected server-side before any content renders

  return (
    <>
      {children}
      <MobileBottomNav />
    </>
  );
}
