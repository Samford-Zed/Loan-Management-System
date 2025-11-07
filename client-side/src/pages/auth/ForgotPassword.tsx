import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";
import api from "../../lib/publicApi";

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

    try {
      await api.post("/forgotPassword", { email });
      setMessage("If an account exists, a reset token has been sent.");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch {
      setError("Failed to send reset token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-50 px-4'>
      <div className='max-w-md w-full space-y-8'>
        <h2 className='text-2xl font-bold text-center'>Reset Your Password</h2>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded-xl shadow space-y-6'
        >
          <div>
            <label className='block text-sm font-medium'>Email Address</label>
            <div className='relative mt-1'>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 py-2 border rounded-md'
              />
              <Mail className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {message && (
            <div className='text-green-600 text-sm bg-green-50 p-3 rounded-md'>
              {message}
            </div>
          )}
          {error && (
            <div className='text-red-600 text-sm bg-red-50 p-3 rounded-md flex items-center'>
              <AlertCircle className='w-4 h-4 mr-2' />
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            {isLoading ? "Sending..." : "Send Reset Token"}
          </button>

          <Link
            to='/login'
            className='block mt-4 text-center text-sm text-blue-600 hover:underline'
          >
            <ArrowLeft className='inline h-4 w-4 mr-1' />
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
