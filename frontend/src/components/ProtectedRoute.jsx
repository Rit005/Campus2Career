import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ⏳ Auth still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🧠 Logged in BUT role not selected
  if (!user?.role && location.pathname !== "/choose-dashboard") {
    return <Navigate to="/choose-dashboard" replace />;
  }

  // 🔐 Role-based protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
  }

  // ✅ Access allowed
  return children;
};

export default ProtectedRoute;
