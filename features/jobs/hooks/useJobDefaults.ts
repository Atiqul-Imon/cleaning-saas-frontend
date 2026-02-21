const STORAGE_KEY = 'cleaner-job-defaults';

export interface JobDefaults {
  clientId: string;
  scheduledTime?: string;
  type?: 'ONE_OFF' | 'RECURRING';
  frequency?: string;
}

/**
 * Persist and restore job form defaults from localStorage.
 * Used for "smart defaults" - remember last used client, time, etc.
 */
export function useJobDefaults() {
  const get = (): Partial<JobDefaults> | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<JobDefaults>;
      return parsed?.clientId ? parsed : null;
    } catch {
      return null;
    }
  };

  const set = (defaults: Partial<JobDefaults>) => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const existing = get() || {};
      const merged = { ...existing, ...defaults };
      if (merged.clientId) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  const clear = () => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return { get, set, clear };
}
