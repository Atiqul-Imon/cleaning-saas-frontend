'use client';

import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Card, LoadingSkeleton } from '@/components/ui';

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

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();

  // Redirect if not admin
  if (!roleLoading && userRole?.role !== 'ADMIN') {
    router.replace('/admin');
    return null;
  }

  const statsQuery = useApiQuery<AdminStats>(
    ['admin', 'stats', 'analytics'],
    '/admin/stats',
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

  if (!stats) {
    return null;
  }

  // Calculate growth metrics (mock data for now)
  const growthRate = stats.recentBusinesses > 0 ? ((stats.recentBusinesses / stats.totalBusinesses) * 100).toFixed(1) : '0';
  const avgJobsPerBusiness = stats.totalBusinesses > 0 ? (stats.totalJobs / stats.totalBusinesses).toFixed(1) : '0';
  const avgRevenuePerBusiness = stats.totalBusinesses > 0 ? (Number(stats.totalRevenue) / stats.totalBusinesses).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Platform insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Growth Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{growthRate}%</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Avg Jobs/Business</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{avgJobsPerBusiness}</p>
          <p className="text-xs text-gray-500 mt-1">Platform average</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Avg Revenue/Business</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">£{avgRevenuePerBusiness}</p>
          <p className="text-xs text-gray-500 mt-1">All-time average</p>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalBusinesses > 0 ? ((stats.activeSubscriptions / stats.totalBusinesses) * 100).toFixed(1) : '0'}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Active subscriptions</p>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Businesses</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalBusinesses}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Users</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Jobs</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Invoices</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalInvoices}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Subscriptions</span>
              <span className="text-lg font-bold text-gray-900">{stats.activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-lg font-bold text-gray-900">
                £{Number(stats.totalRevenue).toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Plans</h2>
          <div className="space-y-4">
            {stats.businessesByPlan.map((plan) => {
              const percentage = stats.totalBusinesses > 0
                ? ((plan.count / stats.totalBusinesses) * 100).toFixed(1)
                : '0';
              return (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">{plan.plan}</span>
                    <span className="text-gray-900 font-bold">{plan.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{stats.recentBusinesses} new businesses</p>
              <p className="text-sm text-gray-600">Registered this month</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}



