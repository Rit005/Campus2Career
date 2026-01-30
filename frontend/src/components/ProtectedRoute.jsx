import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    // If user has no role (first-time user), redirect to choose dashboard
    if (!user?.role) {
      return <Navigate to="/choose-dashboard" state={{ from: location }} replace />;
    }

    // Check if user's role is in allowedRoles
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have required role, redirect to their appropriate dashboard
      if (user.role === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      } else if (user.role === 'recruiter') {
        return <Navigate to="/recruiter/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;

