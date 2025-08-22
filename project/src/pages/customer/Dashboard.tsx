import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Banknote,
  Calendar,
  TrendingUp,
  CreditCard,
  X,
  CheckCircle,
  History,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLoan } from "../../contexts/LoanContext";

type LoanApplication = {
  id: string;
  purpose: string;
  amount: number;
  duration: number; // months
  emi: number;
  status: "pending" | "approved" | "rejected" | string;
  appliedDate: string; // ISO string
};

type DashboardProps = { showOnlyLoans?: boolean };

const Dashboard: React.FC<DashboardProps> = ({ showOnlyLoans = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCustomerApplications, addRepayment, getCustomerRepayments } =
    useLoan();

  // UI state
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [repaymentSuccess, setRepaymentSuccess] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const goToVerify = () => navigate("/link-account");

  // Data
  const applications: LoanApplication[] = user
    ? getCustomerApplications(user.id)
    : [];
  const repayments = user ? getCustomerRepayments(user.id) : [];

  const norm = (s: string) => String(s || "").toLowerCase();

  const activeLoans = useMemo(
    () => applications.filter((a) => norm(a.status) === "approved"),
    [applications]
  );

  const totalOutstanding = activeLoans.reduce(
    (sum, loan) => sum + (loan.amount || 0),
    0
  );
  const nextEMI = activeLoans.length > 0 ? activeLoans[0].emi : 0;

  const getStatusColor = (status: string) => {
    switch (norm(status)) {
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
    if (!selectedLoan || !user) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate payment
    addRepayment(
      selectedLoan.id,
      user.id,
      user.bankAccountNumber || "****XXXX",
      selectedLoan.emi
    );
    setIsProcessing(false);
    setRepaymentSuccess(true);
    setTimeout(() => {
      setIsRepayModalOpen(false);
      setRepaymentSuccess(false);
      setSelectedLoan(null);
      setHistoryOpen(true);
    }, 1200);
  };

  const closeModal = () => {
    if (isProcessing) return;
    setIsRepayModalOpen(false);
    setSelectedLoan(null);
    setRepaymentSuccess(false);
  };

  /* ------------------------------ MY LOANS ONLY ------------------------------ */
  if (showOnlyLoans) {
    return (
      <div className='min-h-screen bg-gray-50 py-6 sm:py-8'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8'>
          <div className='mb-6 sm:mb-8'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              My Loans
            </h1>
            <p className='text-gray-600 mt-1'>
              All of your loan applications in one place.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
            <div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Your Loan Applications
              </h2>
            </div>

            {applications.length === 0 ? (
              <div className='p-8 sm:p-12 text-center'>
                <div className='bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                  <Banknote className='h-8 w-8 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No loan applications yet
                </h3>
                <p className='text-gray-600 mb-6'>
                  Start your financial journey by applying for your first loan.
                </p>
                {user?.accountVerified ? (
                  <Link
                    to='/apply-loan'
                    className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    <span>Apply Now</span>
                  </Link>
                ) : (
                  <Link
                    to='/link-account'
                    className='bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2'
                  >
                    <CreditCard className='h-4 w-4' />
                    <span>Verify Account First</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Purpose
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Amount
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Duration
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Monthly EMI
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Applied Date
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {applications.map((application) => {
                      const s = (application.status || "").toLowerCase();
                      return (
                        <tr key={application.id} className='hover:bg-gray-50'>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                            {application.purpose}
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900'>
                            {application.amount.toLocaleString()} Br
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900'>
                            {application.duration} months
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900'>
                            {application.emi.toLocaleString()} Br
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                s
                              )}`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </span>
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900'>
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </td>
                          <td className='px-4 sm:px-6 py-4 whitespace-nowrap font-medium'>
                            {s === "approved" && (
                              <button
                                onClick={() => handleRepayClick(application)}
                                className='bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors'
                              >
                                Repay
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment History Modal */}
        {historyOpen && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-xl'>
              <div className='flex items-center justify-between p-6 border-b'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Payment History
                </h3>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                  aria-label='Close'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='p-6'>
                {repayments.length === 0 ? (
                  <p className='text-gray-600'>No payments yet.</p>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm'>
                      <thead>
                        <tr className='text-left text-gray-500 border-b'>
                          <th className='py-2 pr-4'>Date</th>
                          <th className='py-2 pr-4'>Loan</th>
                          <th className='py-2 pr-4'>Amount</th>
                          <th className='py-2'>Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repayments.map((r) => (
                          <tr key={r.id} className='border-b last:border-none'>
                            <td className='py-2 pr-4'>
                              {new Date(r.paidAt).toLocaleDateString()}
                            </td>
                            <td className='py-2 pr-4'>{r.loanId}</td>
                            <td className='py-2 pr-4'>
                              {r.amount.toLocaleString()} Br
                            </td>
                            <td className='py-2'>
                              ****{r.accountNumber.slice(-4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className='px-6 pb-6'>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
                  className='text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50'
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
                      been processed successfully.
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
                            <span className='text-gray-600'>
                              Account Number:
                            </span>
                            <span className='font-medium'>
                              ****{user?.bankAccountNumber?.slice(-4) ?? "XXXX"}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Payment Amount:
                            </span>
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
                        className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        {isProcessing ? "Processing..." : "Confirm Payment"}
                      </button>
                      <button
                        onClick={closeModal}
                        disabled={isProcessing}
                        className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
  }

  /* ------------------------------ DASHBOARD ONLY ----------------------------- */
  return (
    <div className='min-h-screen bg-gray-50 py-6 sm:py-8'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Welcome back, {user?.firstName}!
          </h1>
          <p className='text-gray-600 mt-1'>
            Here&apos;s your loan portfolio overview
          </p>
        </div>

        {/* Verify account banner (only shows if NOT verified) */}
        {!user?.accountVerified && (
          <div className='mb-6'>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-start justify-between gap-4'>
              <div className='flex gap-3'>
                <div className='mt-0.5'>
                  <Shield className='h-5 w-5 text-yellow-600' />
                </div>
                <div>
                  <p className='font-semibold text-yellow-900'>
                    Verify your bank account
                  </p>
                  <p className='text-sm text-yellow-800'>
                    You need a verified account before applying for a loan.
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className='px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm hover:bg-yellow-700'
                >
                  Learn more
                </button>
                <button
                  onClick={() => navigate("/link-account")}
                  className='px-4 py-2 rounded-lg border border-yellow-600 text-yellow-700 text-sm hover:bg-yellow-100 flex items-center gap-1'
                >
                  Verify now <ArrowRight className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8'>
          <div className='bg-white rounded-lg shadow-sm p-5'>
            <div className='flex items-center'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Banknote className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Outstanding
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {totalOutstanding.toLocaleString()} Br
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-5'>
            <div className='flex items-center'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <Calendar className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Next EMI</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {nextEMI.toLocaleString()} Br
                </p>
                <p className='text-xs text-gray-500'>Due: March 15, 2025</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-5'>
            <div className='flex items-center'>
              <div className='bg-orange-100 p-3 rounded-lg'>
                <TrendingUp className='h-6 w-6 text-orange-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Active Loans
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {activeLoans.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-lg shadow-sm p-5 mb-6 sm:mb-8'>
          <div className='flex items-center justify-between flex-wrap gap-3'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Quick Actions
            </h2>
            <div className='flex flex-wrap gap-3'>
              {user?.accountVerified ? (
                <Link
                  to='/apply-loan'
                  className='bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2'
                >
                  <Plus className='h-5 w-5' />
                  <span>Apply for New Loan</span>
                </Link>
              ) : (
                <Link
                  to='/link-account'
                  className='bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2'
                >
                  <CreditCard className='h-5 w-5' />
                  <span>Verify Bank Account</span>
                </Link>
              )}

              <button
                onClick={() => setHistoryOpen(true)}
                className='border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2'
              >
                <History className='h-5 w-5' />
                <span>View Payment History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Account Modal */}
      {showVerifyModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-lg max-w-lg w-full'>
            <div className='p-6 border-b'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Verify your bank account
              </h2>
            </div>
            <div className='p-6 space-y-3 text-sm text-gray-700'>
              <p>
                We’ll send two small micro-deposits (each less than 1.00) to
                your bank account.
              </p>
              <ol className='list-decimal ml-5 space-y-1'>
                <li>Enter your account number on the verification page.</li>
                <li>Check your statement in 1–2 business days.</li>
                <li>Return and input the two amounts to confirm ownership.</li>
              </ol>
            </div>
            <div className='p-6 flex justify-end gap-2 border-t'>
              <button
                onClick={() => setShowVerifyModal(false)}
                className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                Close
              </button>
              <button
                onClick={goToVerify}
                className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'
              >
                Go to verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {historyOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-lg w-full max-w-xl'>
            <div className='flex items-center justify-between p-6 border-b'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Payment History
              </h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Close'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='p-6'>
              {repayments.length === 0 ? (
                <p className='text-gray-600'>No payments yet.</p>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='min-w-full text-sm'>
                    <thead>
                      <tr className='text-left text-gray-500 border-b'>
                        <th className='py-2 pr-4'>Date</th>
                        <th className='py-2 pr-4'>Loan</th>
                        <th className='py-2 pr-4'>Amount</th>
                        <th className='py-2'>Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repayments.map((r) => (
                        <tr key={r.id} className='border-b last:border-none'>
                          <td className='py-2 pr-4'>
                            {new Date(r.paidAt).toLocaleDateString()}
                          </td>
                          <td className='py-2 pr-4'>{r.loanId}</td>
                          <td className='py-2 pr-4'>
                            {r.amount.toLocaleString()} Br
                          </td>
                          <td className='py-2'>
                            ****{r.accountNumber.slice(-4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className='px-6 pb-6'>
              <button
                onClick={() => setHistoryOpen(false)}
                className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
