import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipLink from '@/components/accessibility/SkipLink';
import { ToastProvider } from '@/lib/toast-context';
import { ReactQueryProvider } from '@/lib/react-query-provider';

// Configure Inter font (Primary)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Configure Roboto font (Secondary/Fallback)
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  preload: true,
});

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
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
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
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <ReactQueryProvider>
          <ToastProvider>
            <SkipLink />
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
