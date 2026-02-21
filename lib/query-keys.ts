import { QueryKey } from '@tanstack/react-query';

/**
 * Centralized Query Key Factory
 *
 * This ensures consistent query key structure across the app
 * and makes it easier to invalidate related queries
 */
export const queryKeys = {
  // User & Auth
  auth: {
    me: (): QueryKey => ['auth', 'me'],
    userRole: (userId?: string): QueryKey => ['auth', 'userRole', userId].filter(Boolean),
  },

  // Business
  business: {
    all: (): QueryKey => ['business'],
    detail: (userId?: string): QueryKey => ['business', userId].filter(Boolean),
    cleaners: (userId?: string): QueryKey => ['business', 'cleaners', userId].filter(Boolean),
    cleanerDetail: (cleanerId: string): QueryKey => ['business', 'cleaners', cleanerId],
  },

  // Clients
  clients: {
    all: (userId?: string): QueryKey => ['clients', userId].filter(Boolean),
    detail: (id: string): QueryKey => ['clients', id],
    list: (userId?: string, filters?: Record<string, any>): QueryKey =>
      ['clients', 'list', userId, filters].filter((item) => item !== undefined),
  },

  // Jobs
  jobs: {
    all: (userId?: string): QueryKey => ['jobs', userId].filter(Boolean),
    detail: (id: string): QueryKey => ['jobs', id],
    list: (userId?: string, filters?: Record<string, any>): QueryKey =>
      ['jobs', 'list', userId, filters].filter((item) => item !== undefined),
    myJobs: (userId?: string): QueryKey => ['jobs', 'my', userId].filter(Boolean),
    history: (userId?: string): QueryKey => ['jobs', 'history', userId].filter(Boolean),
  },

  // Invoices
  invoices: {
    all: (userId?: string): QueryKey => ['invoices', userId].filter(Boolean),
    detail: (id: string): QueryKey => ['invoices', id],
    list: (userId?: string, filters?: Record<string, any>): QueryKey =>
      ['invoices', 'list', userId, filters].filter((item) => item !== undefined),
  },

  // Dashboard
  dashboard: {
    stats: (userId?: string): QueryKey => ['dashboard', 'stats', userId].filter(Boolean),
  },

  // Reports
  reports: {
    business: (userId: string, startDate: string, endDate: string): QueryKey => [
      'reports',
      'business',
      userId,
      startDate,
      endDate,
    ],
    client: (userId: string, clientId: string): QueryKey => ['reports', 'client', userId, clientId],
  },

  // Admin
  admin: {
    stats: (): QueryKey => ['admin', 'stats'],
    businesses: (page?: number): QueryKey =>
      ['admin', 'businesses', page].filter((item) => item !== undefined),
    businessDetail: (id: string): QueryKey => ['admin', 'businesses', id],
    users: (page?: number): QueryKey =>
      ['admin', 'users', page].filter((item) => item !== undefined),
    subscriptions: (page?: number): QueryKey =>
      ['admin', 'subscriptions', page].filter((item) => item !== undefined),
    analytics: (): QueryKey => ['admin', 'analytics'],
  },

  // Subscriptions
  subscriptions: {
    current: (userId?: string): QueryKey => ['subscriptions', 'current', userId].filter(Boolean),
    usage: (userId?: string): QueryKey => ['subscriptions', 'usage', userId].filter(Boolean),
  },
};
