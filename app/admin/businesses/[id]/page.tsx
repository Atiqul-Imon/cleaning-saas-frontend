'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { useApiQuery } from '@/lib/hooks/use-api';
import { Card, LoadingSkeleton, Button } from '@/components/ui';

interface BusinessDetails {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  subscription?: {
    id: string;
    planType: string;
    status: string;
    currentPeriodEnd: string;
    createdAt: string;
  };
  clients: Array<{
    id: string;
    name: string;
    phone?: string;
    createdAt: string;
  }>;
  jobs: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    client: {
      name: string;
    };
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  _count: {
    clients: number;
    jobs: number;
    invoices: number;
  };
}

export default function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { userRole, loading: roleLoading } = useUserRole();

  const businessQuery = useApiQuery<BusinessDetails>(
    ['admin', 'business', id],
    `/admin/businesses/${id}`,
    {
      enabled: userRole?.role === 'ADMIN' && !!id,
    },
  );

  // Redirect if not admin
  if (!roleLoading && userRole?.role !== 'ADMIN') {
    router.replace('/admin');
    return null;
  }

  if (roleLoading || businessQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (userRole?.role !== 'ADMIN') {
    return null;
  }

  const business = businessQuery.data;

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Business not found</p>
        <Button
          variant="secondary"
          onClick={() => router.push('/admin/businesses')}
          className="mt-4"
        >
          Back to Businesses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => router.push('/admin/businesses')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-600 mt-1">Business Details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Business Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{business.name}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{business.user.email}</p>
                </div>
                {business.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 mt-1">{business.phone}</p>
                  </div>
                )}
              </div>
              {business.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900 mt-1">{business.address}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">VAT Enabled</label>
                  <p className="text-gray-900 mt-1">
                    {business.vatEnabled ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </p>
                </div>
                {business.vatNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">VAT Number</label>
                    <p className="text-gray-900 mt-1">{business.vatNumber}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(business.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(business.updatedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Jobs */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
              <span className="text-sm text-gray-600">{business._count.jobs} total</span>
            </div>
            {business.jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs yet</p>
            ) : (
              <div className="space-y-3">
                {business.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.client.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(job.scheduledDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        job.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Invoices */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
              <span className="text-sm text-gray-600">{business._count.invoices} total</span>
            </div>
            {business.invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {business.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">#{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(invoice.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        £
                        {Number(invoice.totalAmount).toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{business._count.clients}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <div>
                    <p className="text-sm text-gray-600">Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{business._count.jobs}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <div>
                    <p className="text-sm text-gray-600">Invoices</p>
                    <p className="text-2xl font-bold text-gray-900">{business._count.invoices}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription */}
          {business.subscription && (
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {business.subscription.planType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        business.subscription.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : business.subscription.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {business.subscription.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Period Ends</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(business.subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Account Info */}
          <Card variant="elevated" padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-sm text-gray-900 mt-1 font-mono">{business.user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-gray-900 mt-1">{business.user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Created</label>
                <p className="text-gray-900 mt-1">
                  {new Date(business.user.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
