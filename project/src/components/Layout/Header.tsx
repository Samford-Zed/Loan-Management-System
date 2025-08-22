import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Bell, User, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) navigate("/admin/dashboard", { replace: true });
    else if (isCustomer) navigate("/dashboard", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleSignOut = () => {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${
      isActive
        ? "text-gray-900 font-medium"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-8'>
            <a
              href='/'
              onClick={handleBrandClick}
              className='flex items-center gap-2'
              aria-label='LoanPro'
              title='LoanPro'
            >
              <CreditCard className='h-8 w-8 text-blue-600' />
              <span className='text-xl font-bold text-gray-900'>LoanPro</span>
            </a>

            {user && (
              <nav className='hidden md:flex items-center gap-6'>
                {isAdmin ? (
                  <>
                    <NavLink to='/admin/dashboard' className={navLinkClass}>
                      Dashboard
                    </NavLink>
                    <NavLink to='/admin/applications' className={navLinkClass}>
                      Applications
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to='/dashboard' className={navLinkClass} end>
                      Dashboard
                    </NavLink>
                    <NavLink to='/apply-loan' className={navLinkClass}>
                      Apply Loan
                    </NavLink>
                    {/* ✅ now goes to /my-loans */}
                    <NavLink to='/my-loans' className={navLinkClass}>
                      My Loans
                    </NavLink>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className='flex items-center gap-3'>
            {user ? (
              <>
                <button
                  className='p-2 rounded-full hover:bg-gray-100 text-gray-500'
                  title='Notifications'
                >
                  <Bell className='h-5 w-5' />
                </button>

                <div className='relative'>
                  <button
                    onClick={() => setMenuOpen((s) => !s)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100'
                  >
                    <User className='h-5 w-5 text-gray-600' />
                    <span className='hidden md:inline text-sm text-gray-700'>
                      {isAdmin ? "Admin" : user.firstName}
                    </span>
                  </button>

                  {menuOpen && (
                    <div
                      className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-50'
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <div className='px-4 py-3 text-sm text-gray-700 border-b'>
                        {isAdmin
                          ? "Admin User"
                          : `${user.firstName} ${user.lastName}`}
                      </div>

                      {isCustomer && (
                        <Link
                          to='/profile'
                          className='flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'
                          onClick={() => setMenuOpen(false)}
                        >
                          <User className='h-4 w-4' />
                          Profile
                        </Link>
                      )}

                      <button
                        onClick={handleSignOut}
                        className='w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-50'
                      >
                        <LogOut className='h-4 w-4' />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  to='/login'
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700'
                >
                  Sign in
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50'
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
