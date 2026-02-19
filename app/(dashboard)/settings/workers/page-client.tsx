'use client';

// This is the client component - server-side role check is in page.tsx
import { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks/use-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useUserRole } from '@/lib/use-user-role';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid } from '@/components/layout';
import {
  Card,
  Button,
  Input,
  Badge,
  Avatar,
  Modal,
  LoadingSkeleton,
  EmptyState,
} from '@/components/ui';

interface Cleaner {
  id: string;
  cleanerId: string;
  email: string;
  role: string;
  status: string;
  totalJobs: number;
  todayJobs: number;
  createdAt: string;
  activatedAt?: string;
}

export default function WorkersPageClient() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [staffToDelete, setStaffToDelete] = useState<{ id: string; email: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createdStaff, setCreatedStaff] = useState<{ email: string; password: string } | null>(
    null,
  );
  const { userRole } = useUserRole();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

  // Use React Query to fetch cleaners
  const cleanersQuery = useApiQuery<Cleaner[]>(
    queryKeys.business.cleaners(userRole?.id),
    '/business/cleaners',
    {
      enabled: !!userRole && (userRole.role === 'OWNER' || userRole.role === 'ADMIN'),
    },
  );

  // Delete cleaner mutation - using custom mutation function for dynamic endpoint
  const deleteMutation = useMutation<void, Error, { cleanerId: string }>({
    mutationFn: async (variables: { cleanerId: string }) => {
      const { apiClient } = await import('@/lib/api-client-singleton');
      return apiClient.delete<void>(`/business/cleaners/${variables.cleanerId}`);
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.business.cleaners(userRole?.id) });
      setShowDeleteModal(false);
      setStaffToDelete(null);
      setDeleteConfirmEmail('');
      showToast('Staff member removed successfully', 'success');
    },
    onError: (error) => {
      const errorMessage = (error as Error)?.message || 'Failed to remove staff member';
      setDeleteError(errorMessage);
      showToast(errorMessage, 'error');
    },
  });

  // Create cleaner mutation
  const createMutation = useApiMutation<{ tempPassword?: string }, { email: string; name: string }>(
    {
      endpoint: '/business/cleaners',
      method: 'POST',
      invalidateQueries: [queryKeys.business.cleaners(userRole?.id)],
      mutationOptions: {
        onSuccess: (result) => {
          if (result?.tempPassword) {
            setCreatedStaff({
              email: formData.email,
              password: result.tempPassword,
            });
            setShowAddModal(false);
            setShowPasswordModal(true);
          } else {
            setShowAddModal(false);
            setFormData({ email: '', name: '' });
          }
          setFormData({ email: '', name: '' });
          showToast('Staff member created successfully!', 'success');
        },
        onError: (err) => {
          const errorMessage = (err as Error)?.message || 'Failed to create staff member';
          showToast(errorMessage, 'error');
        },
      },
    },
  );

  const cleaners = cleanersQuery.data || [];
  const loading = cleanersQuery.isLoading;
  const queryError = cleanersQuery.error ? (cleanersQuery.error as Error).message : null;
  const submitting = createMutation.isPending;
  const deleting = deleteMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ email: formData.email, name: formData.name || '' });
  };

  const handleRemoveClick = (cleanerId: string, email: string) => {
    setStaffToDelete({ id: cleanerId, email });
    setDeleteConfirmEmail('');
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!staffToDelete) {
      return;
    }

    if (deleteConfirmEmail !== staffToDelete.email) {
      setDeleteError('Email does not match. Please type the exact email address.');
      return;
    }

    setDeleteError(null);
    deleteMutation.mutate({ cleanerId: staffToDelete.id });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  if (userRole?.role !== 'OWNER' && userRole?.role !== 'ADMIN') {
    return (
      <Section background="subtle" padding="lg">
        <Container size="md">
          <EmptyState
            title="Access Denied"
            description="Only business owners can manage staff."
            action={{
              label: 'Back to Dashboard',
              href: '/dashboard',
            }}
          />
        </Container>
      </Section>
    );
  }

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={3} />
        </Container>
      </Section>
    );
  }

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Stack direction="row" justify="between" align="center" className="mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">
              Staff Management
            </h1>
            <p className="text-[var(--gray-600)] text-lg">Manage your staff and team members</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddModal(true)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Add Staff
          </Button>
        </Stack>

        {queryError && cleaners.length === 0 && (
          <Card
            variant="outlined"
            padding="md"
            className="mb-6 bg-[var(--error-50)] border-[var(--error-200)]"
          >
            <Stack direction="row" spacing="sm" align="center">
              <svg
                className="w-5 h-5 text-[var(--error-600)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-[var(--error-900)] font-semibold">{queryError}</span>
            </Stack>
          </Card>
        )}

        {cleaners.length === 0 ? (
          <EmptyState
            title="No staff yet"
            description="Add your first staff member to get started"
            icon={
              <svg
                className="w-16 h-16 text-[var(--gray-400)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            }
            action={{
              label: 'Add First Staff Member',
              onClick: () => setShowAddModal(true),
            }}
          />
        ) : (
          <Grid cols={1} gap="md">
            {cleaners.map((cleaner) => (
              <Card key={cleaner.id} variant="elevated" padding="lg" hover>
                <Stack direction="row" justify="between" align="start">
                  <Stack direction="row" spacing="md" align="start" className="flex-1">
                    <Avatar name={cleaner.email} size="lg" />
                    <div className="flex-1">
                      <Stack direction="row" spacing="md" align="center" className="mb-2">
                        <h3 className="font-bold text-[var(--gray-900)] text-lg">
                          {cleaner.email}
                        </h3>
                        <Badge
                          variant={
                            cleaner.status === 'ACTIVE'
                              ? 'success'
                              : cleaner.status === 'PENDING'
                                ? 'warning'
                                : 'primary'
                          }
                          size="sm"
                        >
                          {cleaner.status}
                        </Badge>
                      </Stack>
                      <p className="text-sm text-[var(--gray-600)] font-medium mb-4">
                        Staff Member
                      </p>
                      <Grid cols={2} gap="md">
                        <div>
                          <p className="text-2xl font-extrabold text-[var(--gray-900)]">
                            {cleaner.totalJobs}
                          </p>
                          <p className="text-xs text-[var(--gray-600)] font-medium uppercase tracking-wide mt-1">
                            Total Jobs
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-extrabold text-[var(--primary-600)]">
                            {cleaner.todayJobs}
                          </p>
                          <p className="text-xs text-[var(--gray-600)] font-medium uppercase tracking-wide mt-1">
                            Today
                          </p>
                        </div>
                      </Grid>
                    </div>
                  </Stack>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveClick(cleaner.cleanerId, cleaner.email)}
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    }
                  >
                    Delete
                  </Button>
                </Stack>
              </Card>
            ))}
          </Grid>
        )}

        {/* Add Staff Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ email: '', name: '' });
          }}
          title="Add New Staff Member"
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="lg">
              {createMutation.isError && (
                <Card
                  variant="outlined"
                  padding="md"
                  className="bg-[var(--error-50)] border-[var(--error-200)]"
                >
                  <span className="text-[var(--error-900)] font-semibold">{queryError}</span>
                </Card>
              )}

              <Input
                label="Email Address"
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@example.com"
              />

              <Input
                label="Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                helperText="Optional"
              />

              <Card
                variant="outlined"
                padding="md"
                className="bg-[var(--primary-50)] border-[var(--primary-200)]"
              >
                <p className="text-sm text-[var(--primary-900)] font-medium">
                  A temporary password will be generated and shown after creation. Share it securely
                  with the staff member.
                </p>
              </Card>

              <Stack direction="row" spacing="md">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ email: '', name: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  className="flex-1"
                >
                  Create Staff Member
                </Button>
              </Stack>
            </Stack>
          </form>
        </Modal>

        {/* Password Display Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setCreatedStaff(null);
          }}
          title="Staff Member Created!"
        >
          <Stack spacing="lg">
            <div className="text-center">
              <div className="bg-[var(--success-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[var(--success-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[var(--gray-700)] font-medium">
                Share these credentials securely with the staff member
              </p>
            </div>

            {createdStaff && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[var(--gray-900)] mb-2">
                    Email
                  </label>
                  <Stack direction="row" spacing="sm">
                    <Input type="text" readOnly value={createdStaff.email} className="font-mono" />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(createdStaff.email)}
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    >
                      Copy
                    </Button>
                  </Stack>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--gray-900)] mb-2">
                    Temporary Password
                  </label>
                  <Stack direction="row" spacing="sm">
                    <Input
                      type="text"
                      readOnly
                      value={createdStaff.password}
                      className="font-mono font-bold"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(createdStaff.password)}
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    >
                      Copy
                    </Button>
                  </Stack>
                </div>
              </>
            )}

            <Card
              variant="outlined"
              padding="md"
              className="bg-[var(--warning-50)] border-[var(--warning-200)]"
            >
              <p className="text-sm text-[var(--warning-900)] font-medium">
                ⚠️ <strong>Important:</strong> This password will remain valid until the staff
                member changes it. Share it securely via WhatsApp, SMS, or email.
              </p>
            </Card>

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setShowPasswordModal(false);
                setCreatedStaff(null);
              }}
              className="w-full"
            >
              Got it, I&apos;ve saved the credentials
            </Button>
          </Stack>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setStaffToDelete(null);
            setDeleteConfirmEmail('');
            setDeleteError(null);
          }}
          title="Remove Staff Member?"
        >
          {staffToDelete && (
            <Stack spacing="lg">
              <div className="text-center">
                <div className="bg-[var(--error-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[var(--error-600)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-[var(--gray-700)] font-medium">
                  This action will permanently remove <strong>{staffToDelete.email}</strong> from
                  your business.
                </p>
              </div>

              <Card
                variant="outlined"
                padding="md"
                className="bg-[var(--error-50)] border-[var(--error-200)]"
              >
                <p className="text-sm text-[var(--error-900)] font-medium">
                  ⚠️ <strong>Warning:</strong> This will immediately revoke their access to your
                  business. They will no longer be able to view or manage jobs assigned to your
                  business.
                </p>
              </Card>

              {deleteError && (
                <Card
                  variant="outlined"
                  padding="md"
                  className="bg-[var(--error-50)] border-[var(--error-200)]"
                >
                  <span className="text-[var(--error-900)] font-semibold">{deleteError}</span>
                </Card>
              )}

              <Input
                label={`Type ${staffToDelete.email} to confirm:`}
                id="deleteConfirmEmail"
                type="email"
                required
                value={deleteConfirmEmail}
                onChange={(e) => {
                  setDeleteConfirmEmail(e.target.value);
                  setDeleteError(null);
                }}
                disabled={deleting}
                placeholder="Enter email to confirm"
              />

              <Stack direction="row" spacing="md">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStaffToDelete(null);
                    setDeleteConfirmEmail('');
                    setDeleteError(null);
                  }}
                  disabled={deleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleDeleteConfirm}
                  disabled={deleting || deleteConfirmEmail !== staffToDelete.email}
                  isLoading={deleting}
                  className="flex-1"
                >
                  Remove Staff Member
                </Button>
              </Stack>
            </Stack>
          )}
        </Modal>
      </Container>
    </Section>
  );
}
