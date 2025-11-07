import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Contact Us</h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            We're here to help. Get in touch with our team for any questions or
            support.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <div>
            <h2 className='text-2xl font-bold mb-6'>Get In Touch</h2>

            <div className='space-y-6 mb-8'>
              <div className='flex items-start'>
                <Phone className='h-6 w-6 text-blue-600 mt-1 mr-4' />
                <div>
                  <h3 className='font-semibold'>Phone</h3>
                  <p className='text-gray-600'>+251-905-662-676</p>
                  <p className='text-sm text-gray-500'>
                    Mon-Fri: 8:00 AM - 8:00 PM EST
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <Mail className='h-6 w-6 text-blue-600 mt-1 mr-4' />
                <div>
                  <h3 className='font-semibold'>Email</h3>
                  <p className='text-gray-600'>support@loanpro.com</p>
                  <p className='text-sm text-gray-500'>
                    We respond within 24 hours
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <MapPin className='h-6 w-6 text-blue-600 mt-1 mr-4' />
                <div>
                  <h3 className='font-semibold'>Address</h3>
                  <p className='text-gray-600'>Rwanda Street</p>
                  <p className='text-gray-600'>Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <div className='flex items-start'>
                <Clock className='h-6 w-6 text-blue-600 mt-1 mr-4' />
                <div>
                  <h3 className='font-semibold'>Business Hours</h3>
                  <p className='text-gray-600'>
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className='text-gray-600'>Saturday: 10:00 AM - 4:00 PM</p>
                  <p className='text-gray-600'>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className='bg-blue-50 rounded-lg p-6'>
              <MessageCircle className='h-8 w-8 text-blue-600 mb-3' />
              <h3 className='font-semibold mb-2'>Live Chat Support</h3>
              <p className='text-gray-600 mb-4'>
                Get instant help from our support team
              </p>
              <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                Start Chat
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Subject *
                </label>
                <select
                  name='subject'
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value=''>Select a subject</option>
                  <option value='loan-inquiry'>Loan Inquiry</option>
                  <option value='application-help'>Application Help</option>
                  <option value='payment-issue'>Payment Issue</option>
                  <option value='technical-support'>Technical Support</option>
                  <option value='general-question'>General Question</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Message *
                </label>
                <textarea
                  name='message'
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center'
              >
                <Send className='h-5 w-5 mr-2' />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
