import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Key, AlertCircle, ArrowLeft } from "lucide-react";
import api from "../../lib/publicApi";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [formData, setFormData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { token, password, confirmPassword } = formData;

    if (!token || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await api.post("/resetPassword", { token, newPassword: password });
      setMessage("✅ Password reset successful!");
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successfully. Please login." },
        });
      }, 2000);
    } catch (err: any) {
      setError("Token expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    name: string,
    label: string,
    show: boolean,
    toggle: () => void
  ) => (
    <div>
      <label className='block text-sm font-medium'>{label}</label>
      <div className='relative mt-1'>
        <input
          name={name}
          type={show ? "text" : "password"}
          value={(formData as any)[name]}
          onChange={handleChange}
          className='w-full py-2 pr-10 border rounded-md'
        />
        <button
          type='button'
          onClick={toggle}
          className='absolute right-3 top-2.5'
        >
          {show ? (
            <EyeOff className='w-5 h-5 text-gray-400' />
          ) : (
            <Eye className='w-5 h-5 text-gray-400' />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-50 px-4'>
      <div className='max-w-md w-full space-y-8'>
        <h2 className='text-2xl font-bold text-center'>Set New Password</h2>

        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded-xl shadow space-y-6'
        >
          {email && (
            <p className='text-blue-700 text-sm'>
              Reset token sent to: <strong>{email}</strong>
            </p>
          )}

          <div>
            <label className='block text-sm font-medium'>Reset Token</label>
            <div className='relative mt-1'>
              <input
                name='token'
                value={formData.token}
                onChange={handleChange}
                className='w-full pl-10 py-2 border rounded-md'
              />
              <Key className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {renderPasswordInput("password", "New Password", showPassword, () =>
            setShowPassword(!showPassword)
          )}
          {renderPasswordInput(
            "confirmPassword",
            "Confirm Password",
            showConfirm,
            () => setShowConfirm(!showConfirm)
          )}

          {message && <div className='text-green-600 text-sm'>{message}</div>}
          {error && (
            <div className='text-red-600 text-sm flex items-center'>
              <AlertCircle className='w-4 h-4 mr-1' />
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
