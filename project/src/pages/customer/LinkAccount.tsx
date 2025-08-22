import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowRight, Shield, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LinkAccount: React.FC = () => {
  const [step, setStep] = useState<"initiate" | "verify">("initiate");
  const [accountNumber, setAccountNumber] = useState("");
  const [microDeposit, setMicroDeposit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleInitiateLinking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    setIsLoading(true);
    // Simulate API call to initiate micro-deposit
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep("verify");
  };

  const handleVerifyDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate verification - for demo, accept 0.12
    const isValid = microDeposit === "0.12";

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isValid) {
      updateUser({
        accountVerified: true,
        bankAccountNumber: accountNumber,
      });
      setIsLoading(false);
      navigate("/dashboard");
    } else {
      setError("The amount you entered did not match. Please try again.");
      setIsLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='bg-blue-600 px-6 py-4'>
              <h1 className='text-2xl font-bold text-white'>
                Verify Micro-Deposit
              </h1>
            </div>

            <div className='p-6'>
              <div className='mb-6'>
                <div className='flex items-center space-x-3 p-4 bg-blue-50 rounded-lg'>
                  <Clock className='h-6 w-6 text-blue-600' />
                  <div>
                    <h3 className='font-semibold text-blue-900'>
                      Deposit Sent!
                    </h3>
                    <p className='text-sm text-blue-700'>
                      A small deposit has been sent to your account ending in
                      ****{accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-4 mb-6'>
                <p className='text-gray-700'>
                  Please check your bank statement and enter the amount of the
                  small deposit we sent. This may take 1-2 business days to
                  appear in your account.
                </p>

                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <p className='text-sm text-yellow-800'>
                    <strong>Demo Mode:</strong> For testing purposes, enter 0.12
                    as the amount.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyDeposit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Deposit Amount (Br)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    max='1'
                    value={microDeposit}
                    onChange={(e) => setMicroDeposit(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='0.00'
                    required
                  />
                </div>

                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                )}

                <div className='flex space-x-4'>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2'
                  >
                    {isLoading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <span>Verify Account</span>
                        <ArrowRight className='h-4 w-4' />
                      </>
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() => setStep("initiate")}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white'>
            <div className='flex items-center space-x-3'>
              <CreditCard className='h-8 w-8' />
              <div>
                <h1 className='text-3xl font-bold'>Link Your Bank Account</h1>
                <p className='text-blue-100 mt-1'>
                  Secure verification required to apply for loans
                </p>
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='mb-8'>
              <div className='flex items-center space-x-3 p-4 bg-blue-50 rounded-lg'>
                <Shield className='h-6 w-6 text-blue-600' />
                <div>
                  <h3 className='font-semibold text-blue-900'>
                    Bank-Level Security
                  </h3>
                  <p className='text-sm text-blue-700'>
                    Your account information is encrypted and protected using
                    industry-standard security
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-6 mb-8'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  How it works:
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                      1
                    </div>
                    <p className='text-gray-700'>
                      Enter your bank account number below
                    </p>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                      2
                    </div>
                    <p className='text-gray-700'>
                      We'll send a small deposit (less than $1.00) to your
                      account
                    </p>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                      3
                    </div>
                    <p className='text-gray-700'>
                      Verify the deposit amount to confirm account ownership
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleInitiateLinking} className='space-y-6'>
              <div>
                <label
                  htmlFor='accountNumber'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Bank Account Number *
                </label>
                <input
                  type='text'
                  id='accountNumber'
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg'
                  placeholder='Enter your bank account number'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>
                  This information is encrypted and securely stored
                </p>
              </div>

              <button
                type='submit'
                disabled={isLoading || !accountNumber.trim()}
                className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-lg font-semibold'
              >
                {isLoading ? (
                  <span>Sending Micro-Deposit...</span>
                ) : (
                  <>
                    <span>Send Micro-Deposit</span>
                    <ArrowRight className='h-5 w-5' />
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 text-xs text-gray-500'>
              By linking your account, you agree to our{" "}
              <a href='/terms' className='text-blue-600 hover:underline'>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href='/privacy' className='text-blue-600 hover:underline'>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAccount;
