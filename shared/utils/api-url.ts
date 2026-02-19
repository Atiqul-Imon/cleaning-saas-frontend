/**
 * Get the API URL based on environment
 * Production: https://fieldnetapi.pixelforgebd.com
 * Development: http://localhost:5000
 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://fieldnetapi.pixelforgebd.com'
        : 'http://localhost:5000')
    );
  }
  // Server-side: use environment variable or default
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://fieldnetapi.pixelforgebd.com'
      : 'http://localhost:5000')
  );
}
