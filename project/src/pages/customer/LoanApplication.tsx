import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Banknote, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { applyLoan } from "../../services/loan";
import {
  calculateEMI,
  getLoanPurposes,
  getInterestRate,
} from "../../utils/loanCalculator";

const LoanApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    purpose: "",
    amount: "",
    duration: "",
  });
  const [emi, setEmi] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const purposes = getLoanPurposes();

  useEffect(() => {
    if (formData.purpose && formData.amount && formData.duration) {
      const rate = getInterestRate(formData.purpose);
      const calculatedEMI = calculateEMI(
        parseFloat(formData.amount) || 0,
        rate,
        parseInt(formData.duration) || 0
      );
      setInterestRate(rate);
      setEmi(calculatedEMI);
    } else {
      setEmi(0);
      setInterestRate(0);
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
    setSubmitOk(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic client-side guards
    if (!agreedToTerms) {
      setSubmitError("Please agree to the Terms & Privacy Policy.");
      return;
    }
    if (!user.accountVerified || !user.bankAccountNumber) {
      setSubmitError(
        "Your bank account must be verified before you can apply."
      );
      return;
    }

    const amountNum = parseFloat(formData.amount);
    const durationNum = parseInt(formData.duration);
    if (!formData.purpose || isNaN(amountNum) || isNaN(durationNum)) {
      setSubmitError("Please fill all fields correctly.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSubmitOk(null);

    try {
      const res = await applyLoan({
        accountNumber: user.bankAccountNumber,
        loanAmount: amountNum,
        purpose: formData.purpose,
        termMonths: durationNum,
      });

      const msg =
        typeof res.data === "string"
          ? res.data
          : "Application submitted successfully.";
      setSubmitOk(msg);

      setTimeout(() => navigate("/my-loans"), 800);
    } catch (err: any) {
      // Show backend error text if present
      const backendMsg =
        err?.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : "Failed to submit the loan application.";
      setSubmitError(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.accountVerified || !user?.bankAccountNumber) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 max-w-md text-center'>
          <div className='bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
            <Banknote className='h-8 w-8 text-red-600' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Account Verification Required
          </h2>
          <p className='text-gray-600 mb-6'>
            You must verify your bank account before applying for a loan.
          </p>
          <button
            onClick={() => navigate("/link-account")}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Verify Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white'>
            <h1 className='text-3xl font-bold'>Apply for a Loan</h1>
            <p className='text-blue-100 mt-2'>
              Fill out the form below to submit your loan application
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 p-6'>
            <div className='lg:col-span-2'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Verified Account Number
                  </label>
                  <input
                    type='text'
                    value={`****${user.bankAccountNumber.slice(-4)}`}
                    disabled
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500'
                  />
                  <p className='text-xs text-green-600 mt-1 flex items-center'>
                    <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                    Account verified
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Loan Purpose *
                  </label>
                  <select
                    name='purpose'
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value=''>Select loan purpose</option>
                    {purposes.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Loan Amount ($) *
                  </label>
                  <input
                    type='number'
                    name='amount'
                    value={formData.amount}
                    onChange={handleChange}
                    min='1000'
                    max='1000000'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter loan amount'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Minimum: $1,000 | Maximum: $1,000,000
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Duration (months) *
                  </label>
                  <input
                    type='number'
                    name='duration'
                    value={formData.duration}
                    onChange={handleChange}
                    min='3'
                    max='84'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter duration in months'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Minimum: 3 months | Maximum: 84 months (7 years)
                  </p>
                </div>

                {submitError && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700'>
                    {submitError}
                  </div>
                )}
                {submitOk && (
                  <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 whitespace-pre-line'>
                    {submitOk}
                  </div>
                )}

                <div className='flex items-start space-x-3 p-4 bg-gray-50 rounded-lg'>
                  <input
                    type='checkbox'
                    id='terms'
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className='mt-1'
                  />
                  <label htmlFor='terms' className='text-sm text-gray-700'>
                    I have read and agree to the{" "}
                    <a
                      href='/terms'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href='/privacy'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                <div className='flex space-x-4'>
                  <button
                    type='submit'
                    disabled={!agreedToTerms || isLoading}
                    className='flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type='button'
                    onClick={() => navigate("/dashboard")}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className='lg:col-span-1'>
              <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 sticky top-6'>
                <div className='flex items-center space-x-2 mb-4'>
                  <Calculator className='h-6 w-6 text-blue-600' />
                  <h3 className='text-lg font-semibold text-blue-900'>
                    Live EMI Calculator
                  </h3>
                </div>

                {emi > 0 ? (
                  <div className='space-y-4'>
                    <div className='bg-white rounded-lg p-4'>
                      <div className='text-center'>
                        <p className='text-sm text-gray-600'>Monthly EMI</p>
                        <p className='text-3xl font-bold text-blue-600'>
                          ${emi.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>
                          Principal Amount:
                        </span>
                        <span className='font-semibold'>
                          ${parseFloat(formData.amount || "0").toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>
                          Interest Rate:
                        </span>
                        <span className='font-semibold'>
                          {interestRate}% per annum
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>Duration:</span>
                        <span className='font-semibold'>
                          {formData.duration} months
                        </span>
                      </div>
                      <hr />
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>
                          Total Amount:
                        </span>
                        <span className='font-semibold'>
                          $
                          {(
                            emi * (parseInt(formData.duration || "0") || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>
                          Total Interest:
                        </span>
                        <span className='font-semibold text-orange-600'>
                          $
                          {(
                            emi * (parseInt(formData.duration || "0") || 0) -
                            (parseFloat(formData.amount || "0") || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center text-gray-500 py-8'>
                    <Clock className='h-12 w-12 mx-auto mb-3 opacity-50' />
                    <p>Fill in the form to see your EMI calculation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
