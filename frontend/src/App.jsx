import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChooseDashboard from './pages/ChooseDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🌐 Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* 🔁 Smart dashboard redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/choose-dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* 🧠 Role selection */}
          <Route
            path="/choose-dashboard"
            element={
              <ProtectedRoute>
                <ChooseDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🎓 Student dashboard */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 Recruiter dashboard */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
