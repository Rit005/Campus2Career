import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RouteRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!user.role) return <Navigate to="/choose-dashboard" replace />;
  if (user.role === "student")
    return <Navigate to="/student/dashboard" replace />;

  if (user.role === "recruiter")
    return <Navigate to="/recruiter/dashboard" replace />;

  return <Navigate to="/" replace />;
};

export default RouteRedirect;
