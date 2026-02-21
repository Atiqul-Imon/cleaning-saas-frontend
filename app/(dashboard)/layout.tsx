import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getUserRoleServer } from '@/lib/get-user-role-server';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import DashboardSidebar from '@/components/navigation/DashboardSidebar';

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
    <div
      className="flex min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Desktop Sidebar */}
      <DashboardSidebar userRole={userRole} />

      {/* Main Content - Padding for mobile bottom nav + safe area (Phase 3) */}
      <div className="flex-1 flex flex-col min-w-0 mobile-content-padding">{children}</div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
