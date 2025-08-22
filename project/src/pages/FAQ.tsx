import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  FileText,
  CreditCard,
} from "lucide-react";

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      icon: CreditCard,
      title: "Loan Applications",
      questions: [
        {
          q: "What documents do I need to apply for a loan?",
          a: "You typically need government-issued ID, proof of income (pay stubs or tax returns), proof of address, and bank statements. Specific requirements may vary by loan type.",
        },
        {
          q: "How long does the application process take?",
          a: "Most applications are processed within 24-48 hours. Some complex cases might take 3-5 business days.",
        },
        {
          q: "Can I apply if I have bad credit?",
          a: "Yes, we consider applications from people with various credit backgrounds. We look at multiple factors beyond just credit scores.",
        },
      ],
    },
    {
      icon: FileText,
      title: "Loan Terms & Payments",
      questions: [
        {
          q: "What is the maximum loan amount I can get?",
          a: "Loan amounts vary by type: Personal loans up to 50,000 Br, Auto loans up to 100,000 Br, and Mortgage loans up to 1,000,000 Br",
        },
        {
          q: "How do I make payments?",
          a: "You can make payments online through your account, set up automatic payments, or pay by phone or mail.",
        },
        {
          q: "What happens if I miss a payment?",
          a: "Contact us immediately. We may offer grace periods or payment plans. Late fees may apply, but we work with customers to find solutions.",
        },
      ],
    },
    {
      icon: HelpCircle,
      title: "General Questions",
      questions: [
        {
          q: "Is my personal information secure?",
          a: "Yes, we use bank-level encryption and follow strict security protocols to protect your data.",
        },
        {
          q: "How do I contact customer service?",
          a: "You can reach us at +2519844273, by email at support@loanpro.com, or through our live chat service.",
        },
        {
          q: "Do you charge any application fees?",
          a: "No, we do not charge any application fees. All our fees are transparently disclosed before you accept any loan offer.",
        },
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-4'>
            <HelpCircle className='h-8 w-8 text-blue-600 mr-2' />
            <h1 className='text-4xl font-bold text-gray-900'>
              Frequently Asked Questions
            </h1>
          </div>
          <p className='text-xl text-gray-600'>
            Find answers to common questions about our loan services and
            processes.
          </p>
        </div>

        {/* Search */}
        <div className='mb-12'>
          <div className='relative max-w-2xl mx-auto'>
            <input
              type='text'
              placeholder='Search questions...'
              className='w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <BookOpen className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className='space-y-8'>
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={categoryIndex}
                className='bg-white rounded-xl shadow-lg overflow-hidden'
              >
                <div className='bg-blue-50 px-6 py-4 flex items-center'>
                  <Icon className='h-6 w-6 text-blue-600 mr-3' />
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {category.title}
                  </h2>
                </div>

                <div className='divide-y divide-gray-200'>
                  {category.questions.map((item, itemIndex) => {
                    const index = categoryIndex * 10 + itemIndex;
                    const isOpen = openItems.has(index);

                    return (
                      <div key={index} className='p-6'>
                        <button
                          onClick={() => toggleItem(index)}
                          className='flex items-center justify-between w-full text-left'
                        >
                          <span className='text-lg font-medium text-gray-900'>
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className='h-5 w-5 text-gray-500' />
                          ) : (
                            <ChevronDown className='h-5 w-5 text-gray-500' />
                          )}
                        </button>

                        {isOpen && (
                          <div className='mt-4 text-gray-600'>
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className='text-center mt-16'>
          <h2 className='text-2xl font-bold mb-4'>Still have questions?</h2>
          <p className='text-gray-600 mb-6'>
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Contact Support
            </button>
            <button className='border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors'>
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
