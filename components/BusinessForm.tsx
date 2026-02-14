'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';

interface Business {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  vatEnabled: boolean;
  vatNumber?: string;
}

interface BusinessFormProps {
  business?: Business;
  onSuccess?: () => void;
}

export default function BusinessForm({ business, onSuccess }: BusinessFormProps) {
  const [formData, setFormData] = useState({
    name: business?.name || '',
    phone: business?.phone || '',
    address: business?.address || '',
    vatEnabled: business?.vatEnabled || false,
    vatNumber: business?.vatNumber || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (business) {
        await apiClient.put('/business', formData);
      } else {
        await apiClient.post('/business', formData);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-900 px-6 py-4 rounded-lg font-bold flex items-center gap-3">
          <svg className="w-6 h-6 text-red-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-950 mb-3">
          Business Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-400 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 px-4 py-3.5 font-medium transition-all"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-950 mb-3">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-400 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 px-4 py-3.5 font-medium transition-all"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-950 mb-3">
          Address
        </label>
        <textarea
          id="address"
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="block w-full rounded-lg border-2 border-gray-400 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 px-4 py-3.5 font-medium transition-all"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="vatEnabled"
          checked={formData.vatEnabled}
          onChange={(e) => setFormData({ ...formData, vatEnabled: e.target.checked })}
          className="h-5 w-5 text-indigo-700 focus:ring-indigo-500 border-2 border-gray-400 rounded"
        />
        <label htmlFor="vatEnabled" className="ml-3 block text-sm font-semibold text-gray-950">
          Enable VAT
        </label>
      </div>

      {formData.vatEnabled && (
        <div>
          <label htmlFor="vatNumber" className="block text-sm font-semibold text-gray-950 mb-3">
            VAT Number
          </label>
          <input
            type="text"
            id="vatNumber"
            value={formData.vatNumber}
            onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
            className="block w-full rounded-lg border-2 border-gray-400 placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 px-4 py-3.5 font-medium transition-all"
          />
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-lg text-base font-bold text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {loading ? 'Saving...' : business ? 'Update Business' : 'Create Business'}
        </button>
      </div>
    </form>
  );
}


