import React, { useState } from "react";
import {
  User,
  Calendar,
  Shield,
  Bell,
  DollarSign,
  Clock,
  Lock,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "../auth/ChangePasswordModal";
const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Mock data - replace with actual data from your backend
  const mockLoans = [
    {
      id: 1,
      amount: 5000,
      interestRate: 10,
      status: "active",
      nextPayment: "2024-01-15",
    },
    {
      id: 2,
      amount: 10000,
      interestRate: 10,
      status: "pending",
      nextPayment: null,
    },
  ];

  const mockPayments = [
    { id: 1, amount: 250, date: "2024-01-01", status: "completed" },
    { id: 2, amount: 250, date: "2023-12-01", status: "completed" },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "loans", label: "Loan Summary", icon: DollarSign },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
          <div className='flex items-center space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              <User className='h-8 w-8 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className='text-gray-600 capitalize'>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl shadow-sm mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-6'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <User className='h-5 w-5 mr-2' />
                      Personal Information
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Full Name
                        </label>
                        <p className='text-gray-900'>
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Email Address
                        </label>
                        <p className='text-gray-900'>{user?.email}</p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Username
                        </label>
                        <p className='text-gray-900'>{user?.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <Calendar className='h-5 w-5 mr-2' />
                      Account Details
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          User ID
                        </label>
                        <p className='text-gray-900'>{user?.id || "N/A"}</p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Role
                        </label>
                        <p className='text-gray-900 capitalize'>{user?.role}</p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Registration Date
                        </label>
                        <p className='text-gray-900'>
                          {formatDate(user?.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-500'>
                          Last Login
                        </label>
                        <p className='text-gray-900'>
                          {formatDate(user?.lastLogin)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === "loans" && user?.role === "customer" && (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Active Loans */}
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <DollarSign className='h-5 w-5 mr-2' />
                      Active Loans
                    </h3>
                    {mockLoans.filter((loan) => loan.status === "active")
                      .length > 0 ? (
                      <div className='space-y-3'>
                        {mockLoans
                          .filter((loan) => loan.status === "active")
                          .map((loan) => (
                            <div
                              key={loan.id}
                              className='border rounded-lg p-3 bg-white'
                            >
                              <div className='flex justify-between items-start'>
                                <div>
                                  <p className='font-medium'>
                                    ${loan.amount.toLocaleString()}
                                  </p>
                                  <p className='text-sm text-gray-600'>
                                    {loan.interestRate}% interest
                                  </p>
                                </div>
                                <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                                  Active
                                </span>
                              </div>
                              <div className='mt-2 text-sm'>
                                <p>
                                  Next payment: {formatDate(loan.nextPayment)}
                                </p>
                              </div>
                              <button className='mt-2 text-blue-600 text-sm hover:underline'>
                                View Details
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No active loans</p>
                    )}
                  </div>

                  {/* Pending Applications */}
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                      <Clock className='h-5 w-5 mr-2' />
                      Pending Applications
                    </h3>
                    {mockLoans.filter((loan) => loan.status === "pending")
                      .length > 0 ? (
                      <div className='space-y-3'>
                        {mockLoans
                          .filter((loan) => loan.status === "pending")
                          .map((loan) => (
                            <div
                              key={loan.id}
                              className='border rounded-lg p-3 bg-white'
                            >
                              <div className='flex justify-between items-start'>
                                <div>
                                  <p className='font-medium'>
                                    ${loan.amount.toLocaleString()}
                                  </p>
                                  <p className='text-sm text-gray-600'>
                                    {loan.interestRate}% interest
                                  </p>
                                </div>
                                <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
                                  Pending
                                </span>
                              </div>
                              <button className='mt-2 text-blue-600 text-sm hover:underline'>
                                View Application
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No pending applications</p>
                    )}
                  </div>
                </div>

                {/* Payment History */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                    <History className='h-5 w-5 mr-2' />
                    Payment History
                  </h3>
                  {mockPayments.length > 0 ? (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                          <tr>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                              Date
                            </th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                              Amount
                            </th>
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                          {mockPayments.map((payment) => (
                            <tr key={payment.id}>
                              <td className='px-4 py-2 text-sm'>
                                {formatDate(payment.date)}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                ${payment.amount}
                              </td>
                              <td className='px-4 py-2 text-sm'>
                                <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                                  Completed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className='text-gray-500'>No payment history</p>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                    <Shield className='h-5 w-5 mr-2' />
                    Security Settings
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div className='flex items-center space-x-3'>
                        <Lock className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='font-medium'>Password</p>
                          <p className='text-sm text-gray-500'>
                            Last changed 2 months ago
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                      >
                        Change Password
                      </button>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div className='flex items-center space-x-3'>
                        <Bell className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='font-medium'>
                            Two-Factor Authentication
                          </p>
                          <p className='text-sm text-gray-500'>
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <button className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
                    <Bell className='h-5 w-5 mr-2' />
                    Notification Settings
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div>
                        <p className='font-medium'>Loan Application Updates</p>
                        <p className='text-sm text-gray-500'>
                          Get notified when your loan application status changes
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          className='sr-only peer'
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div>
                        <p className='font-medium'>Payment Reminders</p>
                        <p className='text-sm text-gray-500'>
                          Receive reminders before payments are due
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          className='sr-only peer'
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                      <div>
                        <p className='font-medium'>Security Alerts</p>
                        <p className='text-sm text-gray-500'>
                          Get notified about important security events
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          className='sr-only peer'
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
