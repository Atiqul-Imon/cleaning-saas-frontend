import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--primary-600)] via-[var(--primary-700)] to-[var(--accent-600)] text-white py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium">✨ All-in-One Cleaning Business Management</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Run Your Cleaning Business
              <br />
              <span className="bg-gradient-to-r from-white to-[var(--accent-200)] bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
              Manage clients, schedule jobs, track payments, and get paid faster.
              <br className="hidden sm:block" />
              Everything you need in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="bg-white text-[var(--primary-700)] hover:bg-gray-50 shadow-xl hover:shadow-2xl min-w-[200px] text-lg font-bold"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 min-w-[200px] text-lg font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-white/80">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[var(--gray-900)]">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto">
              Powerful tools designed specifically for cleaning businesses to streamline operations and grow faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--primary-50)] to-white rounded-2xl border border-[var(--primary-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Client Management</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Keep track of all your clients, their preferences, access details, and service history in one organized place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--accent-50)] to-white rounded-2xl border border-[var(--accent-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Smart Scheduling</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Schedule one-off or recurring jobs with automatic generation for weekly, bi-weekly, or monthly cleaning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--success-50)] to-white rounded-2xl border border-[var(--success-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--success-500)] to-[var(--success-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Proof of Work</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Upload before/after photos with automatic timestamps. Works offline and syncs when you're back online.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--warning-50)] to-white rounded-2xl border border-[var(--warning-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Auto Invoicing</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Automatically generate professional invoices on job completion with tax calculation and customizable templates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--primary-50)] to-white rounded-2xl border border-[var(--primary-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Payment Tracking</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Track payments, send automated reminders via email or SMS, and mark payments manually for bank transfers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gradient-to-br from-[var(--accent-50)] to-white rounded-2xl border border-[var(--accent-100)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--gray-900)]">Mobile First</h3>
              <p className="text-[var(--gray-600)] leading-relaxed">
                Works perfectly on mobile devices with offline support. Install as a PWA for an app-like experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-[var(--gray-50)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[var(--gray-900)]">
              Simple Workflow, Powerful Results
            </h2>
            <p className="text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto">
              From scheduling to payment, streamline your entire cleaning business workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Schedule Jobs', desc: 'Create one-time or recurring cleaning jobs with ease' },
              { step: '2', title: 'Complete Work', desc: 'Finish the job and upload proof photos on-site' },
              { step: '3', title: 'Auto Invoice', desc: 'Invoices are automatically generated and sent to clients' },
              { step: '4', title: 'Get Paid', desc: 'Track payments and send reminders until you get paid' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--gray-900)]">{item.title}</h3>
                <p className="text-[var(--gray-600)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-[var(--primary-600)] via-[var(--primary-700)] to-[var(--accent-600)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Transform Your Cleaning Business?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of cleaning professionals who trust FieldNeat to manage their business operations.
            Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-white text-[var(--primary-700)] hover:bg-gray-50 shadow-xl hover:shadow-2xl min-w-[200px] text-lg font-bold"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 min-w-[200px] text-lg font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/80">
            ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
