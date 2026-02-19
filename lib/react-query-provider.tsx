'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: data is considered fresh for 1 minute (reduces unnecessary refetches)
            staleTime: 60 * 1000,
            // Cache time: data stays in cache for 10 minutes (increased for better performance)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests with exponential backoff
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry up to 2 times for server errors
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus only if data is stale (saves bandwidth)
            refetchOnWindowFocus: 'always',
            // Refetch on reconnect if data is stale
            refetchOnReconnect: true,
            // Don't refetch on mount if data exists in cache (prevents unnecessary requests)
            refetchOnMount: true,
            // Enable structural sharing for better performance
            structuralSharing: true,
          },
          mutations: {
            // Retry failed mutations once (for network errors)
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 1;
            },
            retryDelay: 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
