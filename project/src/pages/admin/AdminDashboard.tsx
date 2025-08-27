import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import {
  fetchAllApplications,
  updateApplicationStatus,
  type LoanApplication,
} from "../../api/loanApi";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const pendingApplications = useMemo(
    () => applications.filter((a) => a.status === "pending"),
    [applications]
  );
  const approvedLoans = useMemo(
    () => applications.filter((a) => a.status === "approved"),
    [applications]
  );
  const totalDisbursed = useMemo(
    () => approvedLoans.reduce((sum, a) => sum + a.amount, 0),
    [approvedLoans]
  );

  const reload = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchAllApplications();
      setApplications(data);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    const prev = applications;
    setApplications((prevApps) =>
      prevApps.map((a) => (a.id === id ? { ...a, status, reason } : a))
    );

    try {
      await updateApplicationStatus(id, status, reason);
    } catch (e) {
      setApplications(prev);
      await reload();
    }
  };

  // const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <p className='text-gray-600 mt-1'>
            Manage loan applications and monitor system performance
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Applications
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {applications.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 relative'>
            <div className='flex items-center'>
              <div className='bg-yellow-100 p-3 rounded-lg'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Pending Review
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {pendingApplications.length}
                </p>
              </div>
            </div>
            {pendingApplications.length > 0 && (
              <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                {pendingApplications.length}
              </div>
            )}
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Approved Loans
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {approvedLoans.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center'>
              <div className='bg-purple-100 p-3 rounded-lg'>
                <TrendingUp className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Disbursed
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${totalDisbursed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Loan Applications
            </h2>
            {pendingApplications.length > 0 && (
              <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium'>
                {pendingApplications.length} Pending Review
              </span>
            )}
          </div>

          {err && (
            <div className='px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100'>
              {err}
            </div>
          )}

          {loading ? (
            <div className='p-12 text-center text-gray-600'>Loading…</div>
          ) : applications.length === 0 ? (
            <div className='p-12 text-center'>
              <CreditCard className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No applications yet
              </h3>
              <p className='text-gray-600'>
                They’ll appear as soon as customers apply.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Purpose
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Duration
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      EMI
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>

                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {applications.map((a) => (
                    <tr
                      key={a.id}
                      className={`hover:bg-gray-50 ${
                        a.status === "pending" ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {a.customerName}
                        </div>
                        <div className='text-sm text-gray-500'>
                          Account: ****{a.accountNumber.slice(-4)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {a.purpose}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        ${a.amount.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {a.duration} months
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${a.emi.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        {a.status === "pending" && (
                          <div className='flex space-x-2'>
                            <button
                              onClick={() =>
                                handleStatusUpdate(a.id, "approved")
                              }
                              className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors'
                            >
                              Approve & Disburse
                            </button>
                          </div>
                        )}
                        {a.status === "approved" && (
                          <span className='text-green-600 text-xs font-medium'>
                            Disbursed
                          </span>
                        )}
                        {a.status === "rejected" && (
                          <span className='text-red-600 text-xs'>Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
