'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Check if we have the necessary tokens in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      setIsValidLink(true);
    } else {
      setIsValidLink(false);
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Get the hash from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid reset link');
      }

      // Set the session with the tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw sessionError;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--accent-50)] px-4 py-12">
      <Container size="sm">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--gray-900)] mb-2">
                Reset Password
              </h1>
              <p className="text-base text-[var(--gray-600)]">Enter your new password below</p>
            </div>
          </div>

          {/* Card */}
          <Card variant="elevated" padding="lg" className="shadow-xl">
            {/* Success Message */}
            {success && (
              <div className="space-y-6">
                <div
                  className="bg-[var(--success-50)] border-2 border-[var(--success-200)] text-[var(--success-700)] px-4 py-4 rounded-lg flex items-start gap-3"
                  role="alert"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
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
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Password reset successfully!</p>
                    <p className="text-sm">Redirecting to login page...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !success && (
              <div
                className="bg-[var(--error-50)] border-2 border-[var(--error-200)] text-[var(--error-700)] px-4 py-3 rounded-lg flex items-start gap-3 mb-6"
                role="alert"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
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
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>
                  {error.includes('Invalid or expired') && (
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium mt-2 inline-block"
                    >
                      Request a new reset link →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            {!success && isValidLink !== false && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="New Password"
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  minLength={6}
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
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  error={
                    confirmPassword && password !== confirmPassword
                      ? 'Passwords do not match'
                      : undefined
                  }
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

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                  Reset Password
                </Button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-[var(--gray-200)] text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to login
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
