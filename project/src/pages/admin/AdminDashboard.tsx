import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useLoan } from "../../contexts/LoanContext";

const AdminDashboard: React.FC = () => {
  const { applications } = useLoan();

  const pending = applications.filter((a) => a.status === "pending");
  const approved = applications.filter((a) => a.status === "approved");
  const totalDisbursed = approved.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <p className='text-gray-600 mt-1'>System overview and key metrics</p>
        </div>

        {/* KPI Cards */}
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
                  {pending.length}
                </p>
              </div>
            </div>
            {pending.length > 0 && (
              <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                {pending.length}
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
                  {approved.length}
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
                  {totalDisbursed.toLocaleString()} Br
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manage Applications CTA */}
        <div className='bg-white rounded-lg shadow-sm p-6 flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Manage Applications
            </h2>
            <p className='text-gray-600 text-sm'>
              Review, approve, or reject customer loan requests on the
              applications page.
            </p>
          </div>
          <Link
            to='/admin/applications'
            className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
          >
            Go to Applications
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
