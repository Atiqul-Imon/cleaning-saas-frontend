'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Get user role to determine redirect destination
      if (data.session) {
        try {
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL ||
            (process.env.NODE_ENV === 'production'
              ? 'https://api.clenvora.com'
              : 'http://localhost:5000');

          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userRole = await response.json();
            // Redirect based on role
            if (userRole?.role === 'ADMIN') {
              router.push('/admin');
            } else if (userRole?.role === 'CLEANER') {
              router.push('/my-jobs');
            } else {
              router.push('/dashboard');
            }
          } else {
            // Fallback to dashboard if role fetch fails
            router.push('/dashboard');
          }
        } catch {
          // Fallback to dashboard if role fetch fails
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }

      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login with Google';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--accent-50)] px-4 py-12">
      <Container size="sm">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo and Welcome */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--gray-900)] mb-2">
                Welcome back
              </h1>
              <p className="text-base text-[var(--gray-600)]">
                Sign in to manage your cleaning business
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card variant="elevated" padding="lg" className="shadow-xl">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Error Message */}
              {error && (
                <div
                  className="bg-[var(--error-50)] border-2 border-[var(--error-200)] text-[var(--error-700)] px-4 py-3 rounded-lg flex items-start gap-3"
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

              {/* Email Input */}
              <Input
                label="Email address"
                type="email"
                id="email"
                name="email"
                autoComplete="email"
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

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[var(--gray-700)]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-[var(--gray-300)] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--gray-700)]">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                className="mt-6"
              >
                Sign in
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--gray-200)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[var(--gray-500)] font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={loading}
                leftIcon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                }
              >
                Sign in with Google
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-[var(--gray-200)]">
                <p className="text-sm text-[var(--gray-600)]">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          {/* Help Text */}
          <p className="text-center text-xs text-[var(--gray-500)]">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Container>
    </div>
  );
}
