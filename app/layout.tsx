import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/lib/toast-context";
import { ReactQueryProvider } from "@/lib/react-query-provider";

export const metadata: Metadata = {
  title: "CleanSaaS - UK Domestic Cleaning Business Management",
  description: "Simple SaaS for UK Domestic Cleaning Businesses. Manage clients, schedule jobs, track payments, and get paid faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
