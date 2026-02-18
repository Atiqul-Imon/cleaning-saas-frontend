import Link from 'next/link';
import { Button } from '@/components/ui';
import { Container, Section } from '@/components/layout';

export default function DashboardNotFound() {
  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <div className="min-h-[60vh] flex items-center justify-center py-12">
          <div className="max-w-2xl w-full text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-[var(--primary-600)] via-[var(--accent-500)] to-[var(--primary-600)] bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)]">
                Page Not Found
              </h2>
              <p className="text-base md:text-lg text-[var(--gray-600)] max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Illustration Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-[var(--primary-600)]"
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
              <Link href="/dashboard">
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
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/jobs">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  View Jobs
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-[var(--gray-200)]">
              <p className="text-sm text-[var(--gray-500)] mb-4">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
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
                <span className="text-[var(--gray-300)]">•</span>
                <Link
                  href="/invoices"
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
                >
                  Invoices
                </Link>
                <span className="text-[var(--gray-300)]">•</span>
                <Link
                  href="/reports"
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium transition-colors"
                >
                  Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}



