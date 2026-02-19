import { useUserRole } from '@/lib/hooks/use-user-role-query';
import { PermissionsService, UserRole } from '../services/permissions.service';

/**
 * Hook for role-based permissions
 * Provides easy access to permission checks based on user role
 */
export function usePermissions() {
  const { userRole } = useUserRole();
  const role = userRole?.role as UserRole | undefined;

  return {
    // Job permissions
    canAccessJobs: PermissionsService.canAccessJobs(role),
    canCreateJobs: PermissionsService.canCreateJobs(role),
    canViewAllJobs: PermissionsService.canViewAllJobs(role),
    canEditJobs: PermissionsService.canEditJobs(role),
    canDeleteJobs: PermissionsService.canDeleteJobs(role),
    canAssignCleaners: PermissionsService.canAssignCleaners(role),
    canUpdateJobStatus: PermissionsService.canUpdateJobStatus(role),
    canUploadJobPhotos: PermissionsService.canUploadJobPhotos(role),

    // Client permissions
    canAccessClients: PermissionsService.canAccessClients(role),
    canCreateClients: PermissionsService.canCreateClients(role),
    canEditClients: PermissionsService.canEditClients(role),
    canDeleteClients: PermissionsService.canDeleteClients(role),

    // Invoice permissions
    canAccessInvoices: PermissionsService.canAccessInvoices(role),
    canCreateInvoices: PermissionsService.canCreateInvoices(role),
    canEditInvoices: PermissionsService.canEditInvoices(role),

    // Other permissions
    canAccessReports: PermissionsService.canAccessReports(role),
    canAccessSettings: PermissionsService.canAccessSettings(role),
    canManageWorkers: PermissionsService.canManageWorkers(role),
    canAccessAdmin: PermissionsService.canAccessAdmin(role),
    canSendWhatsApp: PermissionsService.canSendWhatsApp(role),

    // Helper to check if cleaner can view specific job
    canCleanerViewJob: (jobCleanerId?: string) => {
      if (role !== 'CLEANER') {
        return false;
      }
      return PermissionsService.canCleanerViewJob(role, jobCleanerId, userRole?.id);
    },
  };
}
