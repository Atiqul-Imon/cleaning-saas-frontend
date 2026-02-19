/**
 * Permissions Service
 * Centralized role-based access control logic
 */

export type UserRole = 'OWNER' | 'CLEANER' | 'ADMIN';

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

export class PermissionsService {
  /**
   * Check if user can access jobs
   */
  static canAccessJobs(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CLEANER';
  }

  /**
   * Check if user can create jobs
   */
  static canCreateJobs(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can view all jobs (not just assigned)
   */
  static canViewAllJobs(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can edit jobs
   */
  static canEditJobs(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can delete jobs
   */
  static canDeleteJobs(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can assign cleaners to jobs
   */
  static canAssignCleaners(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can access clients
   */
  static canAccessClients(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CLEANER';
  }

  /**
   * Check if user can create clients
   */
  static canCreateClients(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can edit clients
   */
  static canEditClients(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can delete clients
   */
  static canDeleteClients(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can access invoices
   */
  static canAccessInvoices(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can create invoices
   */
  static canCreateInvoices(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can edit invoices
   */
  static canEditInvoices(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can access reports
   */
  static canAccessReports(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can access settings
   */
  static canAccessSettings(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can manage workers/staff
   */
  static canManageWorkers(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN';
  }

  /**
   * Check if user can access admin panel
   */
  static canAccessAdmin(role?: UserRole): boolean {
    return role === 'ADMIN';
  }

  /**
   * Check if cleaner can view a specific job
   */
  static canCleanerViewJob(role: UserRole, jobCleanerId?: string, userId?: string): boolean {
    if (role !== 'CLEANER') {
      return false;
    }
    return jobCleanerId === userId;
  }

  /**
   * Check if user can update job status
   */
  static canUpdateJobStatus(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CLEANER';
  }

  /**
   * Check if user can upload job photos
   */
  static canUploadJobPhotos(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CLEANER';
  }

  /**
   * Check if user can send WhatsApp messages
   */
  static canSendWhatsApp(role?: UserRole): boolean {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CLEANER';
  }
}
