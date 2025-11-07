import React from "react";
import { Shield, Lock, Eye, User, Database, Mail } from "lucide-react";

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: `We collect information you provide directly to us, including:
      - Personal identification information (Name, email address, phone number, etc.)
      - Financial information for loan applications
      - Documentation required for verification
      - Usage data and analytics from our website`,
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: `Your information is used to:
      - Process your loan applications and provide services
      - Communicate with you about your account
      - Improve our services and website
      - Comply with legal obligations
      - Prevent fraud and ensure security`,
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: `We implement robust security measures including:
      - SSL encryption for all data transmissions
      - Regular security audits and monitoring
      - Access controls and authentication
      - Secure data storage practices
      - Employee training on data protection`,
    },
    {
      icon: User,
      title: "Your Rights",
      content: `You have the right to:
      - Access your personal information
      - Correct inaccurate data
      - Request deletion of your data
      - Object to processing of your data
      - Data portability
      - Withdraw consent at any time`,
    },
    {
      icon: Mail,
      title: "Contact Information",
      content: `For privacy-related questions or concerns:
      Email: privacy@loanpro.com
      Phone: +251-905-662-676
      Address: Rwanda St, Bole, Addis Ababa
      
      Our Data Protection Officer is available to address any concerns.`,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-4'>
            <Lock className='h-8 w-8 text-blue-600 mr-2' />
            <h1 className='text-4xl font-bold text-gray-900'>Privacy Policy</h1>
          </div>
          <p className='text-xl text-gray-600'>Last updated: July 25, 2025</p>
        </div>

        {/* Introduction */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <p className='text-gray-700 mb-6'>
            At LoanPro, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our services.
          </p>
          <p className='text-gray-700'>
            By using our website and services, you consent to the practices
            described in this policy. We encourage you to read this policy
            carefully to understand our views and practices regarding your
            personal data.
          </p>
        </div>

        {/* Policy Sections */}
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

        {/* Updates */}
        <div className='bg-yellow-50 rounded-xl p-8 mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Policy Updates</h2>
          <p className='text-gray-700'>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for other operational, legal, or
            regulatory reasons. We will notify you of any material changes by
            posting the new Privacy Policy on this page and updating the "Last
            updated" date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
