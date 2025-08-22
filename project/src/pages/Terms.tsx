import React from "react";
import {
  FileText,
  Scale,
  AlertTriangle,
  BookOpen,
  Clock,
  Shield,
  Mail,
  Phone,
} from "lucide-react";

const Terms: React.FC = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "1. Agreement to Terms",
      content: `By accessing or using LoanPro's services, you agree to be bound by these Terms of Service and our Privacy Policy. 
      If you do not agree to these terms, you may not access or use our services.`,
    },
    {
      icon: Scale,
      title: "2. Eligibility",
      content: `To use our services, you must:
      - Be at least 18 years old
      - Be a legal resident of the United States
      - Have a valid Social Security Number
      - Meet our credit and income requirements
      - Provide accurate and complete information`,
    },
    {
      icon: Shield,
      title: "3. User Responsibilities",
      content: `You agree to:
      - Provide accurate and current information
      - Maintain the security of your account credentials
      - Notify us immediately of any unauthorized use
      - Use our services for lawful purposes only
      - Comply with all applicable laws and regulations`,
    },
    {
      icon: AlertTriangle,
      title: "4. Prohibited Activities",
      content: `You may not:
      - Use our services for any illegal purpose
      - Attempt to gain unauthorized access to our systems
      - Provide false or misleading information
      - Interfere with or disrupt our services
      - Use our services to harass or harm others
      - Reverse engineer or decompile our technology`,
    },
    {
      icon: Clock,
      title: "5. Loan Terms",
      content: `All loans are subject to:
      - Credit approval and verification
      - Terms disclosed in your loan agreement
      - Applicable state and federal laws
      - Our underwriting criteria
      - Your continued eligibility throughout the loan process`,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-4'>
            <FileText className='h-8 w-8 text-blue-600 mr-2' />
            <h1 className='text-4xl font-bold text-gray-900'>
              Terms of Service
            </h1>
          </div>
          <p className='text-xl text-gray-600'>
            Last updated: January 15, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <p className='text-gray-700'>
            These Terms of Service govern your use of LoanPro's website and
            services. Please read them carefully before using our services.
            These terms constitute a legal agreement between you and LoanPro.
          </p>
        </div>

        {/* Terms Sections */}
        <div className='space-y-8'>
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className='bg-white rounded-xl shadow-lg p-8'>
                <div className='flex items-center mb-6'>
                  <div className='bg-blue-100 p-3 rounded-lg'>
                    <Icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <h2 className='text-2xl font-semibold ml-4'>
                    {section.title}
                  </h2>
                </div>
                <div className='text-gray-700 whitespace-pre-line'>
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Sections */}
        <div className='bg-white rounded-xl shadow-lg p-8 mt-8'>
          <h2 className='text-2xl font-semibold mb-4'>
            6. Limitation of Liability
          </h2>
          <p className='text-gray-700 mb-6'>
            LoanPro shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to
            loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2 className='text-2xl font-semibold mb-4'>7. Governing Law</h2>
          <p className='text-gray-700 mb-6'>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Delaware, without regard to its conflict of
            law provisions.
          </p>

          <h2 className='text-2xl font-semibold mb-4'>8. Termination</h2>
          <p className='text-gray-700 mb-6'>
            We reserve the right to suspend or terminate your account and access
            to our services if we believe you have violated these Terms or
            engaged in any fraudulent or unlawful activity.
          </p>

          <h2 className='text-2xl font-semibold mb-4'>9. Changes to Terms</h2>
          <p className='text-gray-700 mb-6'>
            We may update these Terms from time to time. If we make material
            changes, we will notify you by email or through a notice on our
            platform. Your continued use of the services after changes take
            effect constitutes your acceptance.
          </p>

          <h2 className='text-2xl font-semibold mb-4'>10. Contact Us</h2>
          <p className='text-gray-700 mb-4'>
            If you have any questions about these Terms of Service, please
            contact us:
          </p>
          <ul className='text-gray-700 space-y-2'>
            <li className='flex items-center'>
              <Mail className='h-5 w-5 text-blue-600 mr-2' />{" "}
              support@loanpro.com
            </li>
            <li className='flex items-center'>
              <Phone className='h-5 w-5 text-blue-600 mr-2' /> +2519-555-1234
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Terms;
