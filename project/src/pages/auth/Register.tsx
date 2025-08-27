import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, X, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const requirements = [
      { test: password.length >= 8, text: "At least 8 characters" },
      { test: /[A-Z]/.test(password), text: "One uppercase letter" },
      { test: /[a-z]/.test(password), text: "One lowercase letter" },
      { test: /\d/.test(password), text: "One number" },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        text: "One special character",
      },
    ];
    return requirements;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const passwordRequirements = validatePassword(formData.password);
    const invalidRequirements = passwordRequirements.filter((req) => !req.test);
    if (invalidRequirements.length > 0) {
      newErrors.password = "Password does not meet requirements";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const success = await register({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });

        if (success) {
          navigate("/login?message=Registration successful! Please log in.");
        }
      } catch {
        setErrors({ general: "Registration failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const passwordRequirements = validatePassword(formData.password);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{" "}
            <Link
              to='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='fullName'
                className='block text-sm font-medium text-gray-700'
              >
                Full Name *
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                required
                value={formData.fullName}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your full name'
              />
              {errors.fullName && (
                <p className='mt-1 text-sm text-red-600'>{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address *
              </label>
              <div className='relative'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter your email address'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
              </div>
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username *
              </label>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={formData.username}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Choose a username'
              />
              {errors.username && (
                <p className='mt-1 text-sm text-red-600'>{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password *
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Create a strong password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className='mt-2 space-y-1'>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      {req.test ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <X className='h-4 w-4 text-red-500' />
                      )}
                      <span
                        className={`text-sm ${
                          req.test ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                Confirm Password *
              </label>
              <div className='relative'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Confirm your password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.general && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <p className='text-sm text-red-600'>{errors.general}</p>
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className='text-xs text-gray-500'>
              By creating an account, you agree to our{" "}
              <a
                href='/terms'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-500'
              >
                Terms of Service
              </a>
              <a
                href='/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-500'
              >
                Privacy Policy
              </a>
              .
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
