'use client';

import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { Card } from '@/components/ui';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { userRole, loading: roleLoading } = useUserRole();

  // Redirect if not admin
  if (!roleLoading && userRole?.role !== 'ADMIN') {
    router.replace('/admin');
    return null;
  }

  if (roleLoading) {
    return <div>Loading...</div>;
  }

  if (userRole?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Platform configuration and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Platform Name</p>
                <p className="text-sm text-gray-600 mt-1">Clenvora</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Support Email</p>
                <p className="text-sm text-gray-600 mt-1">support@clenvora.com</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        </Card>

        {/* Subscription Plans */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Plans</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">FREE Plan</p>
                <p className="text-sm text-gray-600 mt-1">Basic features for new users</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SOLO Plan</p>
                <p className="text-sm text-gray-600 mt-1">For individual cleaners</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">SMALL_TEAM Plan</p>
                <p className="text-sm text-gray-600 mt-1">For small cleaning teams</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        </Card>

        {/* System Information */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Platform Version</span>
              <span className="font-semibold text-gray-900">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Database Status</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-semibold text-gray-900">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">API Status</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-semibold text-gray-900">Operational</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card variant="elevated" padding="lg" className="border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-900">Clear All Data</p>
                <p className="text-sm text-red-700 mt-1">Permanently delete all platform data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Clear Data
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-900">Reset Platform</p>
                <p className="text-sm text-red-700 mt-1">Reset platform to initial state</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Reset
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}



