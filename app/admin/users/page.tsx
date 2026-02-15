'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Card, LoadingSkeleton, Button } from '@/components/ui';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  business?: {
    id: string;
    name: string;
  };
  _count: {
    assignedJobs: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Redirect if not admin
  if (!roleLoading && userRole?.role !== 'ADMIN') {
    router.replace('/admin');
    return null;
  }

  const usersQuery = useApiQuery<{ users: User[]; pagination: any }>(
    ['admin', 'users', currentPage.toString()],
    `/admin/users?page=${currentPage}&limit=20`,
    {
      enabled: userRole?.role === 'ADMIN',
    },
  );

  if (roleLoading || usersQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={5} />
      </div>
    );
  }

  if (userRole?.role !== 'ADMIN') {
    return null;
  }

  const users = usersQuery.data?.users || [];
  const pagination = usersQuery.data?.pagination;

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!user.email.toLowerCase().includes(query) && !user.business?.name.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  const roleCounts = {
    all: users.length,
    OWNER: users.filter((u) => u.role === 'OWNER').length,
    CLEANER: users.filter((u) => u.role === 'CLEANER').length,
    ADMIN: users.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">{pagination?.total || 0}</span>
        </div>
      </div>

      {/* Filters */}
      <Card variant="flat" padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email or business name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'OWNER', 'CLEANER', 'ADMIN'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role === 'all' ? 'All' : role} ({roleCounts[role]})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              {searchQuery || roleFilter !== 'all' ? 'No users found' : 'No users registered yet'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} variant="elevated" padding="lg" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                      user.role === 'ADMIN'
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                        : user.role === 'OWNER'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{user.email}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'OWNER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {user.business && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {user.business.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {user._count.assignedJobs} assigned jobs
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card variant="flat" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

