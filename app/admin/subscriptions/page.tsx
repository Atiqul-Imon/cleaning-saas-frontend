'use client';

import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Card, LoadingSkeleton } from '@/components/ui';

interface Business {
  id: string;
  name: string;
  user: {
    email: string;
  };
  subscription?: {
    planType: string;
    status: string;
    currentPeriodEnd: string;
    createdAt: string;
  };
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();

  // Redirect if not admin
  if (!roleLoading && userRole?.role !== 'ADMIN') {
    router.replace('/admin');
    return null;
  }

  const businessesQuery = useApiQuery<{ businesses: Business[]; pagination: any }>(
    ['admin', 'businesses', 'subscriptions'],
    '/admin/businesses?page=1&limit=100',
    {
      enabled: userRole?.role === 'ADMIN',
    },
  );

  if (roleLoading || businessesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={5} />
      </div>
    );
  }

  if (userRole?.role !== 'ADMIN') {
    return null;
  }

  const businesses = businessesQuery.data?.businesses || [];
  const subscriptions = businesses.filter((b) => b.subscription);
  
  const activeSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'ACTIVE');
  const cancelledSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'CANCELLED');
  const pastDueSubscriptions = subscriptions.filter((b) => b.subscription?.status === 'PAST_DUE');

  const planCounts = {
    FREE: subscriptions.filter((b) => b.subscription?.planType === 'FREE').length,
    SOLO: subscriptions.filter((b) => b.subscription?.planType === 'SOLO').length,
    SMALL_TEAM: subscriptions.filter((b) => b.subscription?.planType === 'SMALL_TEAM').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-1">Monitor and manage platform subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-gray-900">{activeSubscriptions.length}</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-gray-900">{cancelledSubscriptions.length}</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Past Due</p>
            <p className="text-3xl font-bold text-gray-900">{pastDueSubscriptions.length}</p>
          </div>
        </Card>
        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
          </div>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(planCounts).map(([plan, count]) => (
            <div key={plan} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">{plan}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
              <p className="text-xs text-gray-500 mt-1">businesses</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscriptions List */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No subscriptions found</p>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((business) => (
              <div
                key={business.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/businesses/${business.id}`)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <p className="text-sm text-gray-600">{business.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{business.subscription?.planType}</p>
                    <p className="text-xs text-gray-500">
                      Ends {business.subscription && new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      business.subscription?.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : business.subscription?.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {business.subscription?.status}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

