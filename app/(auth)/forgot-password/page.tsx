'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
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
                Forgot Password?
              </h1>
              <p className="text-base text-[var(--gray-600)]">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>
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
                    <p className="font-semibold mb-1">Check your email</p>
                    <p className="text-sm">
                      We&apos;ve sent a password reset link to <strong>{email}</strong>. Please
                      check your inbox and follow the instructions.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--gray-200)]">
                  <p className="text-sm text-[var(--gray-600)] mb-4">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                  >
                    Send another email
                  </Button>
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
                <span className="text-sm font-medium flex-1">{error}</span>
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-[var(--gray-600)]">
                    Enter the email address associated with your account and we&apos;ll send you a
                    link to reset your password.
                  </p>
                </div>

                <Input
                  label="Email address"
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  }
                />

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                  Send reset link
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
