import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Banknote,
  Shield,
  Zap,
  Users,
} from "lucide-react";

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Zap className='h-6 w-6' />,
      title: "Fast Approval",
      description: "Apply in minutes and get a quick decision.",
    },
    {
      icon: <Shield className='h-6 w-6' />,
      title: "Bank-Grade Security",
      description: "Your data is encrypted and protected.",
    },
    {
      icon: <Banknote className='h-6 w-6' />,
      title: "Competitive Rates",
      description: "Fair, transparent pricing with no surprises.",
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: "24/7 Support",
      description: "Real people ready to help anytime.",
    },
  ];

  const steps = [
    { n: "01", t: "Sign Up", d: "Create your account in under 2 minutes." },
    { n: "02", t: "Verify", d: "Securely link and verify your bank account." },
    { n: "03", t: "Apply", d: "Choose amount & tenure—see EMI instantly." },
    { n: "04", t: "Get Funded", d: "Money goes straight to your account." },
  ];

  return (
    <div className='bg-white'>
      {/* HERO */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900' />
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28'>
          <div className='grid lg:grid-cols-12 gap-10 items-center'>
            <div className='lg:col-span-7'>
              <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight'>
                Simple Loans,
                <span className='block text-blue-200'>Zero Headache.</span>
              </h1>
              <p className='mt-5 text-blue-100 text-lg sm:text-xl max-w-2xl'>
                Apply with confidence, track everything in one place, and get
                funded—fast. No hidden fees. No jargon.
              </p>
              <div className='mt-8 flex flex-col sm:flex-row gap-3'>
                <Link
                  to='/register'
                  className='inline-flex items-center justify-center rounded-lg bg-white text-blue-700 px-6 sm:px-7 py-3 font-semibold hover:bg-blue-50 transition'
                >
                  Apply Now
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
                <Link
                  to='/how-it-works'
                  className='inline-flex items-center justify-center rounded-lg border border-white/60 text-white px-6 sm:px-7 py-3 font-semibold hover:bg-white/10 transition'
                >
                  How it works
                </Link>
              </div>
              <div className='mt-6 flex items-center gap-3 text-blue-100 text-sm'>
                <CheckCircle2 className='h-4 w-4' />
                Instant EMI preview · No prepayment penalty
              </div>
            </div>

            {/* Hero Card */}
            <div className='lg:col-span-5'>
              <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-7'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-xl bg-blue-100 p-3'>
                    <Banknote className='h-6 w-6 text-blue-700' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Smart Calculator</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      Estimate your EMI instantly
                    </p>
                  </div>
                </div>
                <div className='mt-5 grid grid-cols-2 gap-4 text-sm'>
                  <div className='rounded-lg border bg-gray-50 p-3'>
                    <p className='text-gray-500'>Sample Amount</p>
                    <p className='font-semibold text-gray-900'>$25,000</p>
                  </div>
                  <div className='rounded-lg border bg-gray-50 p-3'>
                    <p className='text-gray-500'>Sample EMI</p>
                    <p className='font-semibold text-gray-900'>$512 / month</p>
                  </div>
                </div>
                <p className='mt-4 text-xs text-gray-500'>
                  Example only. Actual EMI depends on amount & tenure.
                </p>
                <Link
                  to='/register'
                  className='mt-6 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition'
                >
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className='py-16 sm:py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-center text-3xl sm:text-4xl font-bold text-gray-900'>
            Why Choose LoanPro?
          </h2>
          <p className='mt-3 text-center text-gray-600 max-w-3xl mx-auto'>
            Technology-first, customer-focused lending that just works.
          </p>

          <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((f, i) => (
              <div
                key={i}
                className='rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition'
              >
                <div className='w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4'>
                  {f.icon}
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {f.title}
                </h3>
                <p className='mt-2 text-gray-600 text-sm leading-6'>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className='py-16 sm:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-center text-3xl sm:text-4xl font-bold text-gray-900'>
            How it works
          </h2>
          <p className='mt-3 text-center text-gray-600'>
            Get your loan in 4 simple steps.
          </p>

          <ol className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {steps.map((s, i) => (
              <li key={i} className='rounded-xl border p-6'>
                <span className='text-blue-600 text-xs font-semibold tracking-widest'>
                  STEP {s.n}
                </span>
                <h3 className='mt-2 text-lg font-semibold text-gray-900'>
                  {s.t}
                </h3>
                <p className='mt-1 text-gray-600 text-sm'>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className='py-16 sm:py-20 bg-blue-600 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-extrabold'>
            Ready to get started?
          </h2>
          <p className='mt-3 text-blue-100'>
            Join thousands who trust LoanPro for fast, fair financing.
          </p>
          <div className='mt-7 flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              to='/register'
              className='inline-flex items-center justify-center rounded-lg bg-white text-blue-700 px-6 sm:px-7 py-3 font-semibold hover:bg-blue-50 transition'
            >
              Apply Now
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
            <Link
              to='/how-it-works'
              className='inline-flex items-center justify-center rounded-lg border border-white/70 text-white px-6 sm:px-7 py-3 font-semibold hover:bg-white/10 transition'
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
