// src/pages/customer/LinkAccount.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ArrowRight,
  Shield,
  Clock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { sendAccountToBms, confirmDeposit } from "../../services/loan";

const LinkAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState<"initiate" | "verify">("initiate");
  const [accountNumber, setAccountNumber] = useState<string>(
    user?.bankAccountNumber ?? ""
  );
  const [microDeposit, setMicroDeposit] = useState<string>("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [sendMsg, setSendMsg] = useState<string | null>(null);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitiateLinking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSendMsg(null);

    const acc = accountNumber.trim();
    if (!acc) return;

    try {
      setSending(true);
      const { data } = await sendAccountToBms(acc); // POST /api/lms/account/send
      setSendMsg(typeof data === "string" ? data : "Micro-deposit requested.");
      setStep("verify");
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.message ||
        "Could not send micro-deposit. Please check the account number.";
      setError(String(msg));
    } finally {
      setSending(false);
    }
  };

  const handleVerifyDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerifyMsg(null);

    const acc = accountNumber.trim();
    const amt = microDeposit.trim();
    if (!acc || !amt) return;

    try {
      setVerifying(true);
      const { data } = await confirmDeposit(acc, Number(amt)); // POST /api/lms/account/confirm-deposit
      setVerifyMsg(typeof data === "string" ? data : "Bank account verified.");

      // reflect verification in UI
      updateUser({ accountVerified: true, bankAccountNumber: acc });

      // go back to dashboard after a short delay
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err: any) {
      // backend sends useful messages, surface them
      const msg =
        err?.response?.data ||
        err?.message ||
        "Verification failed. Please re-check the amount and try again.";
      setError(String(msg));
    } finally {
      setVerifying(false);
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
                      Deposit sent
                    </h3>
                    <p className='text-sm text-blue-700'>
                      Please check the statement for account ****
                      {accountNumber.slice(-4)} and enter the deposit amount.
                    </p>
                  </div>
                </div>
              </div>

              {sendMsg && (
                <p className='text-sm mb-4 text-gray-700'>{sendMsg}</p>
              )}

              <form onSubmit={handleVerifyDeposit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Deposit amount (e.g. 0.27)
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

                {verifyMsg && (
                  <div className='bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <p className='text-sm text-green-700'>{verifyMsg}</p>
                  </div>
                )}

                <div className='flex gap-4'>
                  <button
                    type='submit'
                    disabled={verifying}
                    className='flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2'
                  >
                    {verifying ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : null}
                    <span>{verifying ? "Verifying..." : "Verify Account"}</span>
                    {!verifying && <ArrowRight className='h-4 w-4' />}
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
            <div className='flex items-center gap-3'>
              <CreditCard className='h-8 w-8' />
              <div>
                <h1 className='text-3xl font-bold'>Link your bank account</h1>
                <p className='text-blue-100 mt-1'>
                  Secure verification required to apply for loans
                </p>
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='mb-8'>
              <div className='flex items-center gap-3 p-4 bg-blue-50 rounded-lg'>
                <Shield className='h-6 w-6 text-blue-600' />
                <div>
                  <h3 className='font-semibold text-blue-900'>
                    Bank-level security
                  </h3>
                  <p className='text-sm text-blue-700'>
                    Your account information is encrypted and protected using
                    industry-standard security.
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-6 mb-8'>
              <h3 className='text-lg font-semibold text-gray-900'>
                How it works
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                    1
                  </div>
                  <p className='text-gray-700'>
                    Enter your bank account number below.
                  </p>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                    2
                  </div>
                  <p className='text-gray-700'>
                    We’ll send a small micro-deposit (less than 1.00) to that
                    account.
                  </p>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold'>
                    3
                  </div>
                  <p className='text-gray-700'>
                    Enter that amount here to confirm ownership.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleInitiateLinking} className='space-y-6'>
              <div>
                <label
                  htmlFor='accountNumber'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Bank account number *
                </label>
                <input
                  id='accountNumber'
                  type='text'
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg'
                  placeholder='Enter your bank account number'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>
                  We’ll only use this to verify your ownership.
                </p>
              </div>

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              {sendMsg && <p className='text-sm text-gray-700'>{sendMsg}</p>}

              <button
                type='submit'
                disabled={sending || !accountNumber.trim()}
                className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 text-lg font-semibold'
              >
                {sending ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <ArrowRight className='h-5 w-5' />
                )}
                <span>
                  {sending ? "Sending micro-deposit..." : "Send micro-deposit"}
                </span>
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
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAccount;
