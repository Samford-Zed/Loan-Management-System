import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, UserCheck, Clock, DollarSign, CheckCircle, Phone } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: FileText,
      title: '1. Apply Online',
      description: 'Fill out our simple application form with your basic information and loan requirements.'
    },
    {
      icon: UserCheck,
      title: '2. Get Verified',
      description: 'Our team will verify your information and may request additional documents if needed.'
    },
    {
      icon: Clock,
      title: '3. Wait for Approval',
      description: 'Get a decision quickly - most applications are processed within 24-48 hours.'
    },
    {
      icon: DollarSign,
      title: '4. Receive Funds',
      description: 'Once approved, funds are transferred directly to your bank account.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting the funds you need has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose LoanPro?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'No hidden fees or charges',
              'Competitive interest rates',
              'Fast approval process',
              'Secure online application',
              'Flexible repayment options',
              '24/7 customer support'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers who have found financial freedom with LoanPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </Link>
            <button className="flex items-center justify-center gap-2 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              <Phone className="h-5 w-5" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;