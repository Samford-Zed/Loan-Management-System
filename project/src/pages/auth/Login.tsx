import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // role is inferred by backend + stored by AuthProvider
      const ok = await login(formData.username.trim(), formData.password);
      if (!ok) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      // Read role from what AuthProvider saved (robust to different shapes)
      const raw = localStorage.getItem("auth_user");
      const parsed = raw ? JSON.parse(raw) : {};
      const lowerRole = (
        parsed.role ||
        parsed.roles?.[0] ||
        parsed.authorities?.[0] ||
        ""
      )
        .toString()
        .toLowerCase();

      navigate(
        lowerRole.includes("admin") ? "/admin/dashboard" : "/dashboard",
        {
          replace: true,
        }
      );
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{" "}
            <Link
              to='/register'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          {message && (
            <div className='mb-6 bg-green-50 border border-green-200 rounded-md p-3'>
              <p className='text-sm text-green-600'>{message}</p>
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* ⬇⬇⬇  REMOVED Login Type & role buttons  ⬇⬇⬇ */}

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={formData.username}
                onChange={handleChange}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='username'
                autoComplete='username'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
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
                  placeholder='••••••••'
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            <div className='flex items-center justify-end'>
              <Link
                to='/forgot-password'
                className='text-sm text-blue-600 hover:text-blue-500'
              >
                Forgot your password?
              </Link>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2'>
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
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className='mt-6 pt-4 border-t border-gray-200'>
            <Link
              to='/'
              className='flex items-center justify-center text-sm text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
