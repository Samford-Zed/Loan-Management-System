import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";
import api from "../../lib/api"; // 👈 make sure this is correct path

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // inside handleSubmit
    try {
      await api.post("/forgotPassword", { email }); // real backend call
      setMessage(
        "If an account with that email exists, a password reset token has been sent."
      );
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch {
      setError("Failed to send reset token. Please try again.");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Reset Your Password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter your email address and we'll send you a token to reset your
            password
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <div className='mt-1 relative'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter your email'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>

            {message && (
              <div className='bg-green-50 border border-green-200 rounded-md p-3'>
                <p className='text-sm text-green-600'>{message}</p>
              </div>
            )}

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2'>
                <AlertCircle className='h-5 w-5 text-red-500' />
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? "Sending Token..." : "Send Reset Token"}
              </button>
            </div>
          </form>

          <div className='mt-6 pt-4 border-t border-gray-200'>
            <Link
              to='/login'
              className='flex items-center justify-center text-sm text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
