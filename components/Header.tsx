'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useUserRole } from '@/lib/use-user-role';
import { Button, IconButton } from '@/components/ui';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Container } from '@/components/layout';
import dynamic from 'next/dynamic';

// Lazy load navigation components for code splitting
const UserMenu = dynamic(() => import('./navigation/UserMenu'), {
  loading: () => <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />,
});
const SearchBar = dynamic(() => import('./navigation/SearchBar'), {
  loading: () => <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse" />,
});
const MobileMenu = dynamic(() => import('./navigation/MobileMenu'), {
  ssr: false,
});
import { cn } from '@/lib/utils';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useUserRole();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      if (!isMounted) {
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (isMounted) {
        setUser(user);
      }
    };

    checkUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isOwner = userRole?.role === 'OWNER';
  const isAdmin = userRole?.role === 'ADMIN';
  const isCleaner = userRole?.role === 'CLEANER';

  // Hide header on dashboard pages (sidebar handles navigation)
  const isDashboardPage =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/jobs') ||
    pathname?.startsWith('/clients') ||
    pathname?.startsWith('/invoices') ||
    pathname?.startsWith('/reports') ||
    pathname?.startsWith('/my-jobs') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/onboarding');

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  // Don't render header on dashboard pages
  if (isDashboardPage && user) {
    return null;
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 shadow-sm backdrop-blur-sm bg-opacity-95 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <Container size="lg">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">CV</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-500)] bg-clip-text text-transparent">
                    Clenvora
                  </span>
                  <span className="text-xs text-[var(--gray-500)] -mt-1 hidden sm:block">
                    Run your cleaning business. Simply.
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden lg:flex items-center space-x-1">
                  {isAdmin ? (
                    <NavLink href="/admin" isActive={isActive('/admin')}>
                      Admin
                    </NavLink>
                  ) : (
                    <NavLink href="/dashboard" isActive={isActive('/dashboard')}>
                      Dashboard
                    </NavLink>
                  )}
                  {isOwner && (
                    <>
                      <NavLink href="/jobs" isActive={isActive('/jobs')}>
                        Jobs
                      </NavLink>
                      <NavLink href="/clients" isActive={isActive('/clients')}>
                        Clients
                      </NavLink>
                      <NavLink href="/invoices" isActive={isActive('/invoices')}>
                        Invoices
                      </NavLink>
                      <NavLink href="/reports" isActive={isActive('/reports')}>
                        Reports
                      </NavLink>
                    </>
                  )}
                  {isCleaner && (
                    <>
                      <NavLink href="/my-jobs" isActive={isActive('/my-jobs')}>
                        My Jobs
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Theme Toggle */}
                  <div className="hidden md:block">
                    <ThemeToggle />
                  </div>

                  {/* Search - Desktop (only for Owners and Admins) */}
                  {(isOwner || isAdmin) && (
                    <div className="hidden md:block">
                      <SearchBar />
                    </div>
                  )}

                  {/* User Menu - Desktop */}
                  <div className="hidden md:block">
                    <UserMenu user={user} onSignOut={handleSignOut} />
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="md:hidden">
                    <IconButton
                      variant="ghost"
                      size="md"
                      onClick={() => setMobileMenuOpen(true)}
                      aria-label="Open menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="ghost" size="md">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="md">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                  <div className="md:hidden">
                    <IconButton
                      variant="ghost"
                      size="md"
                      onClick={() => setMobileMenuOpen(true)}
                      aria-label="Open menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </>
              )}
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} />
    </>
  );
}

// NavLink Component
interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
        isActive
          ? 'text-[var(--primary-600)] bg-[var(--primary-50)]'
          : 'text-[var(--gray-700)] hover:text-[var(--primary-600)] hover:bg-[var(--gray-100)]',
      )}
    >
      {children}
    </Link>
  );
}
