'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { queryKeys } from '@/lib/query-keys';
import { Card, LoadingSkeleton, Button } from '@/components/ui';

interface AdminStats {
  totalBusinesses: number;
  totalUsers: number;
  totalJobs: number;
  totalInvoices: number;
  activeSubscriptions: number;
  totalRevenue: number;
  recentBusinesses: number;
  businessesByPlan: Array<{ plan: string; count: number }>;
}

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  subscription?: {
    planType: string;
    status: string;
    currentPeriodEnd: string;
  };
  _count: {
    clients: number;
    jobs: number;
    invoices: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();
  const [currentPage, setCurrentPage] = useState(1);

  const statsQuery = useApiQuery<AdminStats>(queryKeys.admin.stats(), '/admin/stats', {
    enabled: userRole?.role === 'ADMIN',
  });

  const businessesQuery = useApiQuery<{ businesses: Business[]; pagination: any }>(
    queryKeys.admin.businesses(currentPage),
    `/admin/businesses?page=${currentPage}&limit=10`,
    {
      enabled: userRole?.role === 'ADMIN',
    },
  );

  if (roleLoading || statsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (userRole?.role !== 'ADMIN') {
    return null;
  }

  const stats = statsQuery.data;
  const businesses = businessesQuery.data?.businesses || [];
  const pagination = businessesQuery.data?.pagination;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your SaaS platform</p>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Businesses */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +{stats.recentBusinesses} new
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Businesses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBusinesses}</p>
              <p className="text-xs text-gray-500 mt-2">Registered on platform</p>
            </div>
          </Card>

          {/* Total Users */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-2">Active accounts</p>
            </div>
          </Card>

          {/* Active Subscriptions */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-2">Currently active</p>
            </div>
          </Card>

          {/* Total Revenue */}
          <Card variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                £
                {Number(stats.totalRevenue).toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-2">All-time earnings</p>
            </div>
          </Card>
        </div>
      )}

      {/* Additional Stats Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="flat" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="flat" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInvoices}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="flat" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recentBusinesses}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Subscription Plans Breakdown */}
      {stats && stats.businessesByPlan.length > 0 && (
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.businessesByPlan.map((plan) => (
              <div key={plan.plan} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">{plan.plan}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.count}</p>
                <p className="text-xs text-gray-500 mt-1">businesses</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Businesses */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Businesses</h2>
            <p className="text-sm text-gray-600 mt-1">
              {pagination?.total || 0} total businesses registered
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => router.push('/admin/businesses')}>
            View All
          </Button>
        </div>

        {businessesQuery.isLoading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500">No businesses registered yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/businesses/${business.id}`)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {business.name}
                      </h3>
                      {business.subscription && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            business.subscription.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : business.subscription.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {business.subscription.planType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{business.user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {business._count.clients} clients
                      </span>
                      <span>•</span>
                      <span>{business._count.jobs} jobs</span>
                      <span>•</span>
                      <span>{business._count.invoices} invoices</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {new Date(business.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing page {pagination.page} of {pagination.totalPages}
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
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
