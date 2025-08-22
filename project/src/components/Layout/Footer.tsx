import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <CreditCard className='h-8 w-8 text-blue-400' />
              <span className='text-xl font-bold'>LoanPro</span>
            </div>
            <p className='text-gray-300 mb-4'>
              Your trusted partner for all lending needs. We provide fast,
              secure, and transparent loan services with competitive rates.
            </p>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Phone className='h-4 w-4 text-blue-400' />
                <span>+2519307428</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-blue-400' />
                <span>support@loanpro.com</span>
              </div>
              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-blue-400' />
                <span>Rwanda St, Bole , Addis Ababa</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/about'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/loan-products'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Loan Products
                </Link>
              </li>
              <li>
                <Link
                  to='/how-it-works'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to='/faq'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/privacy'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center'>
          <p className='text-gray-300'>
            © 2025 LoanPro. All rights reserved. Your financial success is our
            commitment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
