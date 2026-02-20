'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useApiMutation } from '@/lib/hooks/use-api';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const supabase = createClient();

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) {
      strength++;
    }
    if (pwd.length >= 8) {
      strength++;
    }
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
      strength++;
    }
    if (/\d/.test(pwd)) {
      strength++;
    }
    if (/[^a-zA-Z\d]/.test(pwd)) {
      strength++;
    }
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  // Signup mutation
  const signupMutation = useApiMutation<
    { user: { id: string; email: string }; message: string },
    { email: string; password: string }
  >({
    endpoint: '/auth/signup',
    method: 'POST',
    mutationOptions: {
      onSuccess: async () => {
        // After signup, sign in the user automatically
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If auto-login fails, redirect to login page
          setError('Account created successfully! Please login.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // Successfully signed in, redirect to onboarding for business setup
        router.push('/onboarding');
        router.refresh();
      },
      onError: (error) => {
        setError((error as Error)?.message || 'Failed to register');
      },
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    signupMutation.mutate({ email, password });
  };

  const handleGoogleSignup = async () => {
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
    } catch (error: any) {
      setError((error as Error)?.message || 'Failed to sign up with Google');
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) {
      return '';
    }
    if (passwordStrength <= 2) {
      return 'Weak';
    }
    if (passwordStrength <= 3) {
      return 'Fair';
    }
    if (passwordStrength <= 4) {
      return 'Good';
    }
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) {
      return 'bg-[var(--error-500)]';
    }
    if (passwordStrength <= 3) {
      return 'bg-[var(--warning-500)]';
    }
    if (passwordStrength <= 4) {
      return 'bg-[var(--primary-500)]';
    }
    return 'bg-[var(--success-500)]';
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
                Create your account
              </h1>
              <p className="text-base text-[var(--gray-600)]">
                Start managing your cleaning business today
              </p>
            </div>
          </div>

          {/* Register Card */}
          <Card variant="elevated" padding="lg" className="shadow-xl">
            <form className="space-y-6" onSubmit={handleRegister}>
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
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
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
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--gray-600)]">Password strength</span>
                      <span
                        className={`font-semibold ${
                          passwordStrength <= 2
                            ? 'text-[var(--error-600)]'
                            : passwordStrength <= 3
                              ? 'text-[var(--warning-600)]'
                              : passwordStrength <= 4
                                ? 'text-[var(--primary-600)]'
                                : 'text-[var(--success-600)]'
                        }`}
                      >
                        {getPasswordStrengthLabel()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--gray-200)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={signupMutation.isPending}
                className="mt-6"
              >
                Create account
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

              {/* Google Signup */}
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleGoogleSignup}
                disabled={signupMutation.isPending}
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
                Sign up with Google
              </Button>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-[var(--gray-200)]">
                <p className="text-sm text-[var(--gray-600)]">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          {/* Help Text */}
          <p className="text-center text-xs text-[var(--gray-500)]">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Container>
    </div>
  );
}
