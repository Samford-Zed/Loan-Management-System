import React from "react";
import { CreditCard } from "lucide-react";
import { useLoan } from "../../contexts/LoanContext";

const AdminApplications: React.FC = () => {
  const { applications, updateApplicationStatus } = useLoan();

  const pending = applications.filter((a) => a.status === "pending");

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

  const handleStatusUpdate = (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    updateApplicationStatus(id, status, reason);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Applications</h1>
          <p className='text-gray-600 mt-1'>
            Review and manage all loan applications
          </p>
        </div>

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Loan Applications
            </h2>
            {pending.length > 0 && (
              <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium'>
                {pending.length} Pending Review
              </span>
            )}
          </div>

          {applications.length === 0 ? (
            <div className='p-12 text-center'>
              <CreditCard className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No applications yet
              </h3>
              <p className='text-gray-600'>
                Applications will appear here once customers start applying for
                loans.
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
                      Applied
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className={`hover:bg-gray-50 ${
                        application.status === "pending" ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {application.customerName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            Account: ****{application.accountNumber.slice(-4)}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {application.purpose}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {application.amount.toLocaleString()} Br
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {application.duration} months
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {application.emi.toLocaleString()} Br
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        {application.status === "pending" && (
                          <div className='flex space-x-2'>
                            <button
                              onClick={() =>
                                handleStatusUpdate(application.id, "approved")
                              }
                              className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  application.id,
                                  "rejected",
                                  "Application did not meet criteria"
                                )
                              }
                              className='bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors'
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {application.status === "approved" && (
                          <span className='text-green-600 text-xs font-medium'>
                            Disbursed
                          </span>
                        )}
                        {application.status === "rejected" &&
                          application.reason && (
                            <span
                              className='text-red-600 text-xs'
                              title={application.reason}
                            >
                              Rejected
                            </span>
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

export default AdminApplications;
