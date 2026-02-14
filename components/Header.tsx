'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useUserRole } from '@/lib/use-user-role';
import { Button, IconButton } from '@/components/ui';
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
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useUserRole();

  useEffect(() => {
    checkUser();
    supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isOwner = userRole?.role === 'OWNER';
  const isAdmin = userRole?.role === 'ADMIN';
  const isCleaner = userRole?.role === 'CLEANER';

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[var(--gray-200)] shadow-sm backdrop-blur-sm bg-opacity-95">
        <Container size="lg">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-500)] bg-clip-text text-transparent">
                  CleanSaaS
                </span>
              </Link>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden lg:flex items-center space-x-1">
                  <NavLink href="/dashboard" isActive={isActive('/dashboard')}>
                    Dashboard
                  </NavLink>
                  {(isOwner || isAdmin) && (
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
                      <NavLink href="/jobs" isActive={isActive('/jobs')}>
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
                  {/* Search - Desktop */}
                  <div className="hidden md:block">
                    <SearchBar />
                  </div>

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
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />
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
          : 'text-[var(--gray-700)] hover:text-[var(--primary-600)] hover:bg-[var(--gray-100)]'
      )}
    >
      {children}
    </Link>
  );
}
