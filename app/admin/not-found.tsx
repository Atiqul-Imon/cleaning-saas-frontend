import Link from 'next/link';
import { Button } from '@/components/ui';

export default function AdminNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
            The admin page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 md:w-16 md:h-16 text-blue-600"
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
          <Link href="/admin">
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
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/admin/businesses">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              View Businesses
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Admin Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/admin/businesses"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Businesses
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/admin/users"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Users
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/admin/subscriptions"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



