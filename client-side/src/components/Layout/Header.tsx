import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Bell, User, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const displayName = (u?: { fullName?: string; username?: string }) => {
  if (!u) return "User";
  return u.fullName?.trim() || u.username || "User";
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = (user?.role || "").toString().toLowerCase();
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

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
          {/* Brand */}
          <div className='flex items-center gap-8'>
            <a
              href='/'
              onClick={handleBrandClick}
              className='flex items-center gap-2'
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
                    <NavLink to='/my-loans' className={navLinkClass}>
                      My Loans
                    </NavLink>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right actions */}
          <div className='flex items-center gap-3'>
            {user ? (
              <>
                <button className='p-2 rounded-full hover:bg-gray-100'>
                  <Bell className='h-5 w-5' />
                </button>
                <div className='relative'>
                  <button
                    onClick={() => setMenuOpen((s) => !s)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100'
                  >
                    <User className='h-5 w-5 text-gray-600' />
                    <span className='hidden md:inline text-sm text-gray-700'>
                      {isAdmin ? "Admin" : displayName(user)}
                    </span>
                  </button>

                  {menuOpen && (
                    <div className='absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md'>
                      <div className='px-4 py-3 text-sm border-b text-gray-700'>
                        {isAdmin ? "Admin User" : displayName(user)}
                      </div>
                      {isCustomer && (
                        <Link
                          to='/profile'
                          onClick={() => setMenuOpen(false)}
                          className='flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'
                        >
                          <User className='h-4 w-4' /> Profile
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className='w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-50'
                      >
                        <LogOut className='h-4 w-4' /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  to='/login'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg'
                >
                  Sign in
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 border rounded-lg text-gray-700'
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
