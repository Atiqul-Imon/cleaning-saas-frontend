/**
 * Format date to British format (dd/mm/yy)
 */
export function formatDateBritish(date: Date | string | null | undefined): string {
  if (!date) {
    return '';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

/**
 * Format date to British format with full year (dd/mm/yyyy)
 */
export function formatDateBritishFull(date: Date | string | null | undefined): string {
  if (!date) {
    return '';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Format date to British format with weekday (e.g., "Mon, 15/01/24")
 */
export function formatDateBritishWithWeekday(date: Date | string | null | undefined): string {
  if (!date) {
    return '';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }

  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const formatted = formatDateBritish(d);

  return `${weekday}, ${formatted}`;
}

/**
 * Format date and time to British format (dd/mm/yy HH:mm)
 */
export function formatDateTimeBritish(
  date: Date | string | null | undefined,
  time?: string | null,
): string {
  if (!date) {
    return '';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }

  const dateStr = formatDateBritish(d);
  if (!time) {
    return dateStr;
  }

  return `${dateStr} ${time}`;
}

/**
 * Get today's date in YYYY-MM-DD format for date inputs
 */
export function getTodayDateInput(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get tomorrow's date in YYYY-MM-DD format for date inputs
 */
export function getTomorrowDateInput(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get next week's date in YYYY-MM-DD format for date inputs
 */
export function getNextWeekDateInput(): string {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const year = nextWeek.getFullYear();
  const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
  const day = String(nextWeek.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
