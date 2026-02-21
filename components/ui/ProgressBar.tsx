'use client';

interface ProgressBarProps {
  /** Indeterminate: animates to show progress without a specific value */
  indeterminate?: boolean;
  /** 0-100 for determinate progress */
  value?: number;
  className?: string;
}

/**
 * Progress bar for uploads and loading states.
 * Use indeterminate when progress percentage is unknown.
 */
export default function ProgressBar({
  indeterminate = true,
  value = 0,
  className = '',
}: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-[var(--gray-200)] ${className}`}
    >
      {indeterminate ? (
        <div
          className="h-full w-1/3 rounded-full bg-[var(--primary-600)]"
          style={{ animation: 'progress-indeterminate 1.5s ease-in-out infinite' }}
        />
      ) : (
        <div
          className="h-full rounded-full bg-[var(--primary-600)] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
    </div>
  );
}
