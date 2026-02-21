'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useUserRole } from '@/lib/use-user-role';
import { useBusiness } from '@/lib/hooks/use-business';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole } = useUserRole();
  const { businessName } = useBusiness();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    onClose();
  };

  const isOwner = userRole?.role === 'OWNER';
  const isAdmin = userRole?.role === 'ADMIN';
  const isCleaner = userRole?.role === 'CLEANER';

  const navItems = user
    ? [
        isAdmin
          ? {
              href: '/admin',
              label: 'Admin',
              icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            }
          : {
              href: '/dashboard',
              label: 'Dashboard',
              icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            },
        ...(isCleaner
          ? [
              {
                href: '/my-jobs',
                label: 'My Jobs',
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              },
            ]
          : isOwner
            ? [
                {
                  href: '/jobs',
                  label: 'Jobs',
                  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                },
                {
                  href: '/clients',
                  label: 'Clients',
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                },
                {
                  href: '/invoices',
                  label: 'Invoices',
                  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                },
                {
                  href: '/reports',
                  label: 'Reports',
                  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                },
                {
                  href: '/settings/workers',
                  label: 'Staff Management',
                  icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
                },
              ]
            : []),
        {
          href: '/settings/password',
          label: 'Settings',
          icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        },
      ]
    : [
        {
          href: '/',
          label: 'Home',
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
          href: '/login',
          label: 'Login',
          icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
        },
        {
          href: '/register',
          label: 'Sign Up',
          icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
        },
      ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[var(--gray-900)] bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Menu */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden safe-area-top safe-area-bottom',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--gray-200)]">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-lg transition-all duration-200 ease-out active:scale-95"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {user &&
            (() => {
              const getUserDisplayName = (user: any): string => {
                // For OWNER role, prioritize business name if available
                if (userRole?.role === 'OWNER' && businessName) {
                  return businessName;
                }

                // Check for name in user_metadata
                const name =
                  user?.user_metadata?.full_name ||
                  user?.user_metadata?.name ||
                  user?.user_metadata?.display_name;

                // Return name if available, otherwise return email
                return name || user?.email || 'User';
              };
              const displayName = getUserDisplayName(user);
              return (
                <div className="p-6 border-b border-[var(--gray-200)]">
                  <div className="flex items-center space-x-3">
                    <Avatar name={displayName} size="lg" />
                    <div>
                      <p className="font-semibold text-[var(--gray-900)]">{displayName}</p>
                      {user?.email && displayName !== user.email && (
                        <p className="text-sm text-[var(--gray-500)] truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-4 px-6 py-3 min-h-[44px] text-[var(--gray-700)] transition-all duration-200 ease-out active:scale-[0.98]',
                    isActive
                      ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border-r-4 border-[var(--primary-600)] font-semibold'
                      : 'hover:bg-[var(--gray-100)]',
                  )}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {user && (
            <div className="p-6 border-t border-[var(--gray-200)]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 min-h-[44px] text-[var(--error-600)] hover:bg-[var(--error-50)] rounded-lg transition-all duration-200 ease-out active:scale-95 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
