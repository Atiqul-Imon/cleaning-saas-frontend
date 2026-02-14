'use client';

import { useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { createClient } from '@/lib/supabase';

interface ChecklistItem {
  id: string;
  itemText: string;
  completed: boolean;
}

interface JobChecklistProps {
  jobId: string;
  checklist: ChecklistItem[];
  onUpdate: () => void;
  onError: (error: string) => void;
}

export default function JobChecklist({ jobId, checklist, onUpdate, onError }: JobChecklistProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    setUpdating(itemId);
    try {
      await apiClient.put(`/jobs/${jobId}/checklist/${itemId}`, {
        completed: !currentStatus,
      });
      onUpdate();
    } catch (error: any) {
      console.error('Failed to update checklist item:', error);
      onError(error.message || 'Failed to update checklist item. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-950">Checklist</h2>
        <div className="text-sm font-semibold text-gray-600">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
              item.completed
                ? 'bg-green-50 border-green-300'
                : 'bg-white border-gray-300 hover:border-indigo-300'
            }`}
          >
            <button
              onClick={() => toggleItem(item.id, item.completed)}
              disabled={updating === item.id}
              className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center transition-all duration-200 touch-manipulation ${
                item.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-400 hover:border-indigo-500'
              } ${updating === item.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {item.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 font-medium ${
                item.completed ? 'text-gray-500 line-through' : 'text-gray-950'
              }`}
            >
              {item.itemText}
            </span>
            {updating === item.id && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />
            )}
          </div>
        ))}
      </div>

      {checklist.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-gray-200">
          <p className="text-gray-600 font-medium">No checklist items for this job</p>
        </div>
      )}
    </div>
  );
}

