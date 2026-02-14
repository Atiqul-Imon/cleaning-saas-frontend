import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes (but allow /dashboard specifically)
  if ((request.nextUrl.pathname.startsWith('/dashboard') || 
       request.nextUrl.pathname.startsWith('/clients') ||
       request.nextUrl.pathname.startsWith('/jobs') ||
       request.nextUrl.pathname.startsWith('/invoices') ||
       request.nextUrl.pathname.startsWith('/settings') ||
       request.nextUrl.pathname.startsWith('/onboarding')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages (but allow homepage)
  if (
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register')) &&
    user
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow homepage for everyone (authenticated or not)
  if (request.nextUrl.pathname === '/') {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

