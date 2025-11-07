import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";


import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoanProducts from "./pages/LoanProducts";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/customer/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LinkAccount from "./pages/customer/LinkAccount";
import Dashboard from "./pages/customer/Dashboard";
import LoanApplication from "./pages/customer/LoanApplication";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";

const HomeGate: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (user) {
    const role = (user.role || "").toString().toLowerCase();
    return (
      <Navigate
        to={role === "admin" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }
  return <Landing />;
};

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path='/' element={<HomeGate />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/loan-products' element={<LoanProducts />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Customer */}
        <Route
          path='/link-account'
          element={
            <ProtectedRoute requiredRole='customer'>
              <LinkAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute requiredRole='customer'>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute requiredRole='customer'>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/my-loans'
          element={
            <ProtectedRoute requiredRole='customer'>
              <Dashboard showOnlyLoans />
            </ProtectedRoute>
          }
        />
        <Route
          path='/apply-loan'
          element={
            <ProtectedRoute requiredRole='customer' requireVerification>
              <LoanApplication />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/applications'
          element={
            <ProtectedRoute requiredRole='admin'>
              <AdminApplications />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
