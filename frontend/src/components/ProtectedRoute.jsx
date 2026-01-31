import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authChecked, refreshUser } = useAuth();
  const location = useLocation();

  // 🔄 First time only: verify token
  if (!authChecked) {
    refreshUser();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🧠 Role not selected
  if (!user.role && location.pathname !== "/choose-dashboard") {
    return <Navigate to="/choose-dashboard" replace />;
  }

  // 🔐 Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "student" ? "/student/dashboard" : "/recruiter/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
