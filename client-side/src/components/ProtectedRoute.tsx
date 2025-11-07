import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer";
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({
  children,
  requiredRole,
  requireVerification,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div />;

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/' replace />;
  }

  if (
    requireVerification &&
    user.role === "customer" &&
    !user.accountVerified
  ) {
    return <Navigate to='/link-account' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
