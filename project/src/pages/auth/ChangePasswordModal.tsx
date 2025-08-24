import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff, X, Lock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggle = (key: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    if (newPassword.length < 8) return setError("Password too short.");

    setLoading(true);
    try {
      await updatePassword(oldPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setError("Incorrect password or server error.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    val: string,
    setVal: (v: string) => void,
    visible: boolean,
    toggleFn: () => void
  ) => (
    <div>
      <label className='text-sm block mb-1'>{label}</label>
      <div className='relative'>
        <input
          type={visible ? "text" : "password"}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className='w-full border rounded-md py-2 px-3 pr-10'
        />
        <button
          type='button'
          onClick={toggleFn}
          className='absolute top-2 right-3'
        >
          {visible ? (
            <EyeOff className='w-4 h-4 text-gray-400' />
          ) : (
            <Eye className='w-4 h-4 text-gray-400' />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-md'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='flex items-center text-lg font-semibold'>
            <Lock className='w-5 h-5 mr-2' />
            Change Password
          </h3>
          <button onClick={onClose}>
            <X className='w-5 h-5 text-gray-500 hover:text-gray-700' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {renderInput(
            "Current Password",
            oldPassword,
            setOldPassword,
            show.old,
            () => toggle("old")
          )}
          {renderInput(
            "New Password",
            newPassword,
            setNewPassword,
            show.new,
            () => toggle("new")
          )}
          {renderInput(
            "Confirm Password",
            confirmPassword,
            setConfirmPassword,
            show.confirm,
            () => toggle("confirm")
          )}

          {error && <p className='text-sm text-red-600'>{error}</p>}
          {success && (
            <p className='text-sm text-green-600'>✅ Password updated!</p>
          )}

          <div className='flex space-x-3 pt-4'>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='py-2 px-4 border rounded-md'
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
