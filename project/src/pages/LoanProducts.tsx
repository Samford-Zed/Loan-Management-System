import React from "react";
import {
  Home,
  Car,
  GraduationCap,
  CreditCard,
  Building,
  Calculator,
} from "lucide-react";

const LoanProducts: React.FC = () => {
  const loanProducts = [
    {
      icon: Home,
      title: "Home Loans",
      description:
        "Competitive mortgage rates for your dream home with flexible repayment options.",
      features: [
        "Low interest rates",
        "Up to 30-year terms",
        "Fixed & adjustable rates",
      ],
      rate: "10% APR",
    },
    {
      icon: Car,
      title: "Auto Loans",
      description:
        "Finance your new or used vehicle with quick approval and competitive rates.",
      features: ["Fast approval", "New & used vehicles", "Flexible terms"],
      rate: "10% APR",
    },
    {
      icon: GraduationCap,
      title: "Education Loans",
      description:
        "Invest in your future with student loans that support your educational goals.",
      features: ["Deferred payments", "Grace periods", "Cosigner options"],
      rate: "10% APR",
    },
    {
      icon: CreditCard,
      title: "Personal Loans",
      description:
        "Flexible personal loans for any purpose with quick funding and no collateral needed.",
      features: ["No collateral", "Quick funding", "Multiple purposes"],
      rate: "10% APR",
    },
    {
      icon: Building,
      title: "Business Loans",
      description:
        "Fuel your business growth with capital for expansion, equipment, or operations.",
      features: [
        "Business expansion",
        "Equipment financing",
        "Working capital",
      ],
      rate: "10% APR",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Our Loan Products
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover our comprehensive range of loan options designed to meet
            your financial needs
          </p>
        </div>

        {/* Loan Products Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {loanProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow'
              >
                <div className='flex items-center mb-4'>
                  <div className='bg-blue-100 p-3 rounded-lg'>
                    <Icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <h3 className='text-xl font-semibold ml-4'>
                    {product.title}
                  </h3>
                </div>
                <p className='text-gray-600 mb-4'>{product.description}</p>
                <div className='mb-4'>
                  <h4 className='font-semibold mb-2'>Key Features:</h4>
                  <ul className='text-sm text-gray-600 space-y-1'>
                    {product.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className='bg-blue-50 rounded-lg p-3'>
                  <p className='text-blue-600 font-semibold'>
                    Interest Rate: {product.rate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calculator CTA */}
        <div className='bg-blue-600 rounded-xl p-8 text-center text-white'>
          <Calculator className='h-12 w-12 mx-auto mb-4' />
          <h2 className='text-2xl font-bold mb-4'>
            Not sure which loan is right for you?
          </h2>
          <p className='text-blue-100 mb-6'>
            Use our loan calculator to find the perfect product for your needs
            and budget.
          </p>
          <button className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
            Try Our Loan Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanProducts;
