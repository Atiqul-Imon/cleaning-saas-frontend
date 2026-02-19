'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useApiMutation } from '@/lib/hooks/use-api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-950">
            Create your account
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form className="space-y-8" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-900 px-6 py-4 rounded-lg font-bold flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-red-700 flex-shrink-0"
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
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-950 mb-3">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border-2 border-gray-400 placeholder-gray-400 text-gray-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 bg-white font-medium transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-950 mb-3"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border-2 border-gray-400 placeholder-gray-400 text-gray-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 bg-white font-medium transition-all"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-950 mb-3"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border-2 border-gray-400 placeholder-gray-400 text-gray-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 bg-white font-medium transition-all"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="group relative w-full flex justify-center py-3.5 px-6 border border-transparent text-base font-bold rounded-lg text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-medium">Or</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={signupMutation.isPending}
                className="w-full flex justify-center py-3.5 px-6 border-2 border-gray-400 rounded-lg shadow-sm text-base font-semibold text-gray-950 bg-white hover:bg-gray-50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                Sign up with Google
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
