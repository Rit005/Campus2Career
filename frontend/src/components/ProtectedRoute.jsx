import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authChecked, refreshUser } = useAuth();
  const location = useLocation();

  if (!authChecked) {
    refreshUser();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role && location.pathname !== "/choose-dashboard") {
    return <Navigate to="/choose-dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/choose-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
