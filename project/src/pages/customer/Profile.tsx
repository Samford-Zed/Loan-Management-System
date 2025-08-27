import React, { useEffect, useState } from "react";
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
import { displayName } from "../../utils/displayName";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import { getMyActiveLoans, getMyApplications } from "../../services/loan";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (!user?.bankAccountNumber) return;
      try {
        const [loans, applications] = await Promise.all([
          getMyActiveLoans(user.bankAccountNumber),
          getMyApplications(user.bankAccountNumber),
        ]);
        setActiveLoans(loans || []);
        setPendingLoans(
          (applications || []).filter((app) => app.status === "PENDING")
        );
      } catch (err) {
        console.error("Failed to fetch loan data", err);
      }
    };
    fetchLoanData();
  }, [user]);

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
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
          <div className='flex items-center space-x-4'>
            <div className='bg-blue-100 p-3 rounded-full'>
              <User className='h-8 w-8 text-blue-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {displayName(user)}
              </h1>
              <p className='text-gray-600 capitalize'>{user?.role}</p>
            </div>
          </div>
        </div>

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

          <div className='p-6'>
            {activeTab === "personal" && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Left */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-medium mb-4 flex items-center'>
                    <User className='h-5 w-5 mr-2' /> Personal Information
                  </h3>
                  <div className='space-y-3'>
                    <p>
                      <strong>Full Name:</strong>{" "}
                      {user?.fullName || displayName(user)}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>Username:</strong> {user?.username}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='text-lg font-medium mb-4 flex items-center'>
                    <Calendar className='h-5 w-5 mr-2' /> Account Details
                  </h3>
                  <div className='space-y-3'>
                    <p>
                      <strong>User ID:</strong> {user?.id}
                    </p>
                    <p>
                      <strong>Role:</strong> {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "loans" && user?.role === "customer" && (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium mb-4 flex items-center'>
                      <DollarSign className='h-5 w-5 mr-2' /> Active Loans
                    </h3>
                    {activeLoans.length > 0 ? (
                      <div className='space-y-4'>
                        {activeLoans.map((loan) => (
                          <div
                            key={loan.id}
                            className='p-4 border rounded-lg bg-white'
                          >
                            <p>
                              <strong>Amount:</strong> ${loan.totalLoan}
                            </p>
                            <p>
                              <strong>Remaining:</strong> $
                              {loan.remainingAmount}
                            </p>
                            <p>
                              <strong>EMI:</strong> ${loan.emiAmount}
                            </p>
                            <p>
                              <strong>Due Date:</strong>{" "}
                              {formatDate(loan.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No active loans</p>
                    )}
                  </div>

                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h3 className='text-lg font-medium mb-4 flex items-center'>
                      <Clock className='h-5 w-5 mr-2' /> Pending Applications
                    </h3>
                    {pendingLoans.length > 0 ? (
                      <div className='space-y-4'>
                        {pendingLoans.map((loan) => (
                          <div
                            key={loan.id}
                            className='p-4 border rounded-lg bg-white'
                          >
                            <p>
                              <strong>Requested:</strong> ${loan.loanAmount}
                            </p>
                            <p>
                              <strong>EMI:</strong> ${loan.emiPerMonth}
                            </p>
                            <p>
                              <strong>Status:</strong> PENDING
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No pending applications</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='text-lg font-medium mb-4 flex items-center'>
                  <Shield className='h-5 w-5 mr-2' /> Security Settings
                </h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center bg-white p-3 border rounded-lg'>
                    <div>
                      <p className='font-medium'>Password</p>
                      <p className='text-sm text-gray-500'>
                        Last changed 1 months ago
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='text-lg font-medium mb-4 flex items-center'>
                  <Bell className='h-5 w-5 mr-2' /> Notification Settings
                </h3>
                <div className='space-y-4'>
                  <p className='text-sm text-gray-600'>
                    Notification toggles coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
