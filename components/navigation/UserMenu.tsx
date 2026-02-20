'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui';
import { useBusiness } from '@/lib/hooks/use-business';
import { useUserRole } from '@/lib/use-user-role';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { businessName } = useBusiness();
  const { userRole } = useUserRole();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const isOwner = userRole?.role === 'OWNER';
  const isAdmin = userRole?.role === 'ADMIN';

  const menuItems = [
    {
      label: 'Profile',
      href: '/settings/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    ...(isOwner || isAdmin
      ? [
          {
            label: 'Staff Management',
            href: '/settings/workers',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: 'Settings',
      href: '/settings/business',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Change Password',
      href: '/settings/password',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--gray-100)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <Avatar name={displayName} size="md" />
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-[var(--gray-900)]">{displayName}</p>
          {user?.email && displayName !== user.email && (
            <p className="text-xs text-[var(--gray-500)]">{user.email}</p>
          )}
        </div>
        <svg
          className={cn(
            'w-5 h-5 text-[var(--gray-500)] transition-transform',
            isOpen && 'transform rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-[var(--gray-200)]">
            <p className="text-sm font-semibold text-[var(--gray-900)]">{displayName}</p>
            {user?.email && displayName !== user.email && (
              <p className="text-xs text-[var(--gray-500)] truncate">{user.email}</p>
            )}
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-[var(--gray-200)] pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors"
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
        </div>
      )}
    </div>
  );
}
