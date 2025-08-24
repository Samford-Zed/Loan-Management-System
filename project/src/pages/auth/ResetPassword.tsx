import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ArrowLeft, Key } from "lucide-react";
import api from "../../lib/api";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = location?.state?.email ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { token, password, confirmPassword } = formData;

    if (!token || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/resetPassword", {
        token,
        newPassword: password,
      });

      setMessage("✅ Password reset successfully!");
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successfully. Please login." },
        });
      }, 2000);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Token expired or invalid.");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name: string,
    label: string,
    type: "text" | "password",
    value: string,
    toggleVisibility?: () => void,
    show?: boolean
  ) => (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='mt-1 relative'>
        <input
          id={name}
          name={name}
          type={show !== undefined ? (show ? "text" : "password") : type}
          value={value}
          onChange={handleChange}
          required
          className='block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          placeholder={label}
        />
        {toggleVisibility && (
          <button
            type='button'
            onClick={toggleVisibility}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {show ? (
              <EyeOff className='h-4 w-4 text-gray-400' />
            ) : (
              <Eye className='h-4 w-4 text-gray-400' />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Set New Password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter the reset token sent to your email and your new password.
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          {email && (
            <div className='mb-4 p-3 bg-blue-50 rounded-md'>
              <p className='text-sm text-blue-800'>
                Token sent to: <strong>{email}</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Token */}
            <div>
              <label
                htmlFor='token'
                className='block text-sm font-medium text-gray-700'
              >
                Reset Token
              </label>
              <div className='mt-1 relative'>
                <input
                  id='token'
                  name='token'
                  type='text'
                  required
                  value={formData.token}
                  onChange={handleChange}
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter your token'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Key className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>

            {/* New Password */}
            {renderInput(
              "password",
              "New Password",
              "password",
              formData.password,
              () => setShowPassword(!showPassword),
              showPassword
            )}

            {/* Confirm Password */}
            {renderInput(
              "confirmPassword",
              "Confirm New Password",
              "password",
              formData.confirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword),
              showConfirmPassword
            )}

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
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
