'use client';

import { useSyncExternalStore, useCallback } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

const STORAGE_KEY = 'cleaner-dashboard-welcome-seen';
const STORAGE_CHANGE_EVENT = 'cleaner-welcome-dismissed';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(STORAGE_CHANGE_EVENT, handler);
  return () => window.removeEventListener(STORAGE_CHANGE_EVENT, handler);
}

function getSnapshot() {
  if (typeof window === 'undefined') {
    return true; // hide during SSR
  }
  return !!localStorage.getItem(STORAGE_KEY);
}

/**
 * First-time welcome banner for dashboard.
 * Shows once, dismissible. Guides new users to add client and create job.
 */
export default function FirstTimeWelcomeBanner() {
  const seen = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  if (seen) {
    return null;
  }

  return (
    <Card
      variant="outlined"
      padding="md"
      className="mb-6 border-[var(--primary-200)] bg-[var(--primary-50)] animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-[var(--gray-900)] mb-1">Welcome! Get started</h3>
          <p className="text-sm text-[var(--gray-700)]">
            1. Add a client → 2. Create a job → 3. Mark complete when done
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/clients/new">
            <Button variant="primary" size="sm">
              Add Client
            </Button>
          </Link>
          <Link href="/jobs/create">
            <Button variant="secondary" size="sm">
              Create Job
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={dismiss}>
            Got it
          </Button>
        </div>
      </div>
    </Card>
  );
}
