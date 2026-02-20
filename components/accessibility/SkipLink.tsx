'use client';

/**
 * SkipLink Component
 *
 * Provides a "Skip to main content" link for keyboard navigation
 * Improves accessibility for screen reader users
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--primary-600)] focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
