import React, { useState } from "react";
import { X, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleVisibility = (field: keyof typeof visible) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError("Incorrect current password");
      }
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    isVisible: boolean,
    toggle: () => void,
    name: keyof typeof visible
  ) => (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <div className='relative'>
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10'
          required
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 pr-3 flex items-center'
          onClick={toggle}
        >
          {isVisible ? (
            <EyeOff className='h-4 w-4 text-gray-400' />
          ) : (
            <Eye className='h-4 w-4 text-gray-400' />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-lg max-w-md w-full'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
            <Lock className='h-5 w-5 mr-2' />
            Change Password
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {success && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
              <p className='text-sm text-green-600'>
                ✅ Password updated successfully!
              </p>
            </div>
          )}

          {renderInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            visible.current,
            () => toggleVisibility("current"),
            "current"
          )}

          {renderInput(
            "New Password",
            newPassword,
            setNewPassword,
            visible.new,
            () => toggleVisibility("new"),
            "new"
          )}

          {renderInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            visible.confirm,
            () => toggleVisibility("confirm"),
            "confirm"
          )}

          <div className='flex space-x-3 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
