// src/pages/customer/MyLoans.tsx
import React, { useState } from "react";
import { X, CheckCircle, DollarSign } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLoan, LoanApplication } from "../../contexts/LoanContext";

const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const { getCustomerApplications } = useLoan();
  const applications = user ? getCustomerApplications(user.id) : [];

  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [repaymentSuccess, setRepaymentSuccess] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleRepayClick = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setIsRepayModalOpen(true);
    setRepaymentSuccess(false);
  };

  const handleRepayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500)); // mock payment
    setIsProcessing(false);
    setRepaymentSuccess(true);
    setTimeout(() => {
      setIsRepayModalOpen(false);
      setRepaymentSuccess(false);
    }, 1600);
  };

  const closeModal = () => {
    if (!isProcessing) {
      setIsRepayModalOpen(false);
      setSelectedLoan(null);
      setRepaymentSuccess(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>My Loans</h1>
          <p className='text-gray-600'>
            View your applications and make repayments.
          </p>
        </div>

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Your Loan Applications
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <DollarSign className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-1'>
                No loan applications yet
              </h3>
              <p className='text-gray-600'>
                Apply for your first loan from the Dashboard.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Purpose
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Monthly EMI
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Applied Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {applications.map((a) => (
                    <tr key={a.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {a.purpose}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {a.amount.toLocaleString()} Br
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {a.duration} months
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {a.emi.toLocaleString()} Br
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(a.appliedDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        {a.status === "approved" && (
                          <button
                            onClick={() => handleRepayClick(a)}
                            className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors'
                          >
                            Repay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Repayment Modal */}
      {isRepayModalOpen && selectedLoan && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-lg max-w-md w-full'>
            <div className='flex items-center justify-between p-6 border-b'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Make a Payment
              </h2>
              <button
                onClick={closeModal}
                disabled={isProcessing}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='p-6'>
              {repaymentSuccess ? (
                <div className='text-center'>
                  <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Payment Successful!
                  </h3>
                  <p className='text-gray-600'>
                    Your payment of {selectedLoan.emi.toLocaleString()} Br has
                    been processed.
                  </p>
                </div>
              ) : (
                <>
                  <div className='space-y-4 mb-6'>
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <h3 className='font-medium text-gray-900 mb-2'>
                        Loan Details
                      </h3>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <span className='text-gray-600'>Purpose:</span>
                        <span className='font-medium'>
                          {selectedLoan.purpose}
                        </span>
                        <span className='text-gray-600'>Amount:</span>
                        <span className='font-medium'>
                          {selectedLoan.amount.toLocaleString()} Br
                        </span>
                        <span className='text-gray-600'>EMI Amount:</span>
                        <span className='font-medium'>
                          {selectedLoan.emi.toLocaleString()} Br
                        </span>
                      </div>
                    </div>
                    <div className='bg-blue-50 rounded-lg p-4'>
                      <h3 className='font-medium text-gray-900 mb-2'>
                        Payment Details
                      </h3>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Payment Amount:</span>
                          <span className='font-medium'>
                            {selectedLoan.emi.toLocaleString()} Br
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Payment Date:</span>
                          <span className='font-medium'>
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <button
                      onClick={handleRepayment}
                      disabled={isProcessing}
                      className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50'
                    >
                      {isProcessing ? "Processing..." : "Confirm Payment"}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={isProcessing}
                      className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50'
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;
