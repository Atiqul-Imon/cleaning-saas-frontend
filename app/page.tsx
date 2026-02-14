import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
              Simple SaaS for UK Cleaning Businesses
            </h1>
            <p className="text-xl md:text-3xl mb-10 text-indigo-100 font-medium">
              Finish the job → Prove the work → Send invoice → Get paid.
              Everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="bg-white text-indigo-700 px-10 py-4 rounded-lg font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl text-lg border-2 border-indigo-500"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-950">
            Everything You Need to Run Your Cleaning Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6 4h7.5a2.5 2.5 0 002.5-2.5V10.5a2.5 2.5 0 00-2.5-2.5h-7.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-950">Client Management</h3>
              <p className="text-gray-700 font-medium">
                Keep track of all your clients, their preferences, and access details in one place.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Scheduling</h3>
              <p className="text-gray-600">
                Schedule one-off or recurring jobs with automatic generation for weekly/bi-weekly cleaning.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Proof of Work</h3>
              <p className="text-gray-600">
                Upload before/after photos with automatic timestamps. Works offline and syncs when online.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Invoicing</h3>
              <p className="text-gray-600">
                Automatically generate invoices on job completion with VAT calculation for UK businesses.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Tracking</h3>
              <p className="text-gray-600">
                Track payments, send reminders via WhatsApp or Email, and mark payments manually for bank transfers.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
              <p className="text-gray-600">
                Works perfectly on mobile devices with offline support. Install as a PWA for app-like experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-950">
            Ready to streamline your cleaning business?
          </h2>
          <p className="text-xl text-gray-700 font-medium mb-10">
            Start your free trial today. No credit card required.
          </p>
          <Link
            href="/register"
            className="bg-indigo-700 text-white px-10 py-4 rounded-lg font-bold hover:bg-indigo-800 transition-all shadow-lg hover:shadow-xl inline-block text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
