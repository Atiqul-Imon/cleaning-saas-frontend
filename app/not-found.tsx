import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-extrabold bg-gradient-to-r from-[var(--primary-600)] via-[var(--accent-500)] to-[var(--primary-600)] bg-clip-text text-transparent leading-none animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)]">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-[var(--gray-600)] max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 md:w-20 md:h-20 text-[var(--primary-600)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Homepage
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
          <p className="text-sm text-[var(--gray-500)] mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
            >
              Login
            </Link>
            <span className="text-[var(--gray-300)]">•</span>
            <Link
              href="/register"
              className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
            >
              Sign Up
            </Link>
            <span className="text-[var(--gray-300)]">•</span>
            <Link
              href="/jobs"
              className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
            >
              Jobs
            </Link>
            <span className="text-[var(--gray-300)]">•</span>
            <Link
              href="/clients"
              className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
            >
              Clients
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

