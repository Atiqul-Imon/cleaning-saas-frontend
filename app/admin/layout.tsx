import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getUserRoleServer } from '@/lib/get-user-role-server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Server-side role check: Only admins can access admin panel
  const userRole = await getUserRoleServer();
  if (userRole?.role !== 'ADMIN') {
    // Redirect non-admins to their appropriate dashboard
    if (userRole?.role === 'OWNER' || userRole?.role === 'CLEANER') {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  }

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
