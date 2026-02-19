import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/lib/toast-context';
import { ReactQueryProvider } from '@/lib/react-query-provider';

export const metadata: Metadata = {
  title: 'Clenvora - Professional Cleaning Business Management',
  description:
    'Run your cleaning business. Simply. All-in-one SaaS platform for cleaning businesses. Manage clients, schedule jobs, track payments, and get paid faster.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress WebSocket connection errors to localhost:8081
              // This is typically from browser extensions or development tools
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  // Suppress WebSocket errors to port 8081
                  if (message.includes('WebSocket') && message.includes('8081')) {
                    return; // Silently ignore
                  }
                  originalError.apply(console, args);
                };
                
                // Also catch unhandled WebSocket errors
                window.addEventListener('error', function(e) {
                  if (e.message && e.message.includes('WebSocket') && e.message.includes('8081')) {
                    e.preventDefault();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ReactQueryProvider>
          <ToastProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
