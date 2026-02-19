'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiMutation } from '@/lib/hooks/use-api';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Divider } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  // Use React Query mutation for password change
  const mutation = useApiMutation<
    { message: string },
    { currentPassword: string; newPassword: string }
  >({
    endpoint: '/auth/change-password',
    method: 'POST',
    mutationOptions: {
      onSuccess: () => {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password changed successfully!', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      },
      onError: (error) => {
        const errorMessage = (error as Error)?.message || 'Failed to change password';
        showToast(errorMessage, 'error');
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showToast('New password must be different from current password', 'error');
      return;
    }

    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">Change Password</h1>
            <p className="text-[var(--gray-600)] text-lg">
              Update your account password for better security
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            {success && (
              <Card
                variant="outlined"
                padding="md"
                className="mb-6 bg-[var(--success-50)] border-[var(--success-200)]"
              >
                <Stack direction="row" spacing="sm" align="center">
                  <svg
                    className="w-5 h-5 text-[var(--success-600)]"
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
                  <span className="text-[var(--success-900)] font-semibold">
                    Password changed successfully! Redirecting to dashboard...
                  </span>
                </Stack>
              </Card>
            )}

            {mutation.isError && (
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
                  <span className="text-[var(--error-900)] font-semibold">
                    {(mutation.error as Error)?.message || 'Failed to change password'}
                  </span>
                </Stack>
              </Card>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing="lg">
                <Stack direction="row" spacing="sm" align="center" className="mb-4">
                  <svg
                    className="w-6 h-6 text-[var(--primary-600)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-[var(--gray-900)]">Security</h2>
                </Stack>

                <Input
                  label="Current Password"
                  id="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />

                <Input
                  label="New Password"
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password (min. 6 characters)"
                  minLength={6}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  }
                  helperText="Must be at least 6 characters long"
                />

                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  minLength={6}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />

                <Divider spacing="md" />

                <Stack direction="row" spacing="md">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={mutation.isPending}
                    disabled={success}
                    className="flex-1"
                  >
                    Change Password
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
