'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Contextual variant for default icon (jobs, clients, invoices, calendar, error) */
  variant?: 'default' | 'jobs' | 'clients' | 'invoices' | 'calendar' | 'error';
  title: string;
  description: string;
  /** Optional hint: "What you can do" or contextual tip */
  hint?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const variantIcons: Record<NonNullable<EmptyStateProps['variant']>, React.ReactNode> = {
  default: (
    <svg
      className="w-16 h-16 text-[var(--gray-400)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  jobs: (
    <svg
      className="w-16 h-16 text-[var(--gray-400)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  clients: (
    <svg
      className="w-16 h-16 text-[var(--gray-400)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  invoices: (
    <svg
      className="w-16 h-16 text-[var(--gray-400)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  calendar: (
    <svg
      className="w-16 h-16 text-[var(--gray-400)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-16 h-16 text-[var(--error-500)]"
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
  ),
};

export default function EmptyState({
  icon,
  variant = 'default',
  title,
  description,
  hint,
  action,
  className = '',
}: EmptyStateProps) {
  const displayIcon = icon ?? variantIcons[variant];

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-6">{displayIcon}</div>
      <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">{title}</h3>
      <p className="text-[var(--gray-600)] font-medium mb-4 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {hint && <p className="text-sm text-[var(--gray-500)] mb-6 max-w-md mx-auto">{hint}</p>}
      {action && (
        <div className={hint ? '' : 'mt-6'}>
          {action.href ? (
            <a
              href={action.href}
              className="bg-[var(--primary-600)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-700)] shadow-card hover:shadow-elevated transition-all duration-200 inline-block min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="bg-[var(--primary-600)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-700)] shadow-card hover:shadow-elevated transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
