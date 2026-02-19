import { createClient } from '@/lib/supabase-server';
import { getUserRoleServer } from '@/lib/get-user-role-server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Get user role and redirect accordingly
  const userRole = await getUserRoleServer();

  if (userRole?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', requestUrl.origin));
  }

  if (userRole?.role === 'CLEANER') {
    return NextResponse.redirect(new URL('/my-jobs', requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
