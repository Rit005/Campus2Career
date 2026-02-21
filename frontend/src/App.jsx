import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* AUTH */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OAuthCallback from "./pages/OAuthCallback";

/* COMMON */
import Home from "./pages/Home";
import ChooseDashboard from "./pages/ChooseDashboard";
import RouteRedirect from "./pages/RouteRedirect";

/* STUDENT */
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import Career from "./pages/student/Career";
import Profile from "./pages/student/Profile";
import AiMentor from "./pages/student/AiMentor";
import ResumeAnalyzer from "./pages/student/ResumeAnalyzer";
import MarksheetUpload from "./pages/student/MarksheetUpload";
import AcademicDashboard from "./pages/student/AcademicDashboard";
import CareerGuidance from "./pages/student/CareerGuidance";

/* RECRUITER */
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import Dashboard from "./pages/recruiter/Dashboard";
import Matching from "./pages/recruiter/Matching";
import RecruiterAnalytics from "./pages/recruiter/Analytics";
import HrAssistant from "./pages/recruiter/HrAssistant";

/* ADMIN */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Recruiters from "./pages/admin/Recruiters";
import Analytics from "./pages/admin/Analytics";
import SkillTrends from "./pages/admin/SkillTrends";
import RiskStudents from "./pages/admin/RiskStudents";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/redirect" element={<RouteRedirect />} />

          {/* CHOOSE DASHBOARD */}
          <Route
            path="/choose-dashboard"
            element={
              <ProtectedRoute>
                <ChooseDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------------- STUDENT ROUTES ---------------- */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >

            {/* Dashboard & Other Pages */}
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="marksheet-upload" element={<MarksheetUpload />} />
            <Route path="academic-dashboard" element={<AcademicDashboard />} />
            <Route path="career-guidance" element={<CareerGuidance />} />
            <Route path="career" element={<Career />} />
            <Route path="ai-mentor" element={<AiMentor />} />
            <Route path="profile" element={<Profile />} />

          </Route>

          {/* ---------------- RECRUITER ROUTES ---------------- */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="matching" element={<Matching />} />
            <Route path="analytics" element={<RecruiterAnalytics />} />
            <Route path="hr-assistant" element={<HrAssistant />} />
          </Route>

          {/* ---------------- ADMIN ROUTES ---------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="students" element={<Students />} />
            <Route path="recruiters" element={<Recruiters />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="skills" element={<SkillTrends />} />
            <Route path="risk-students" element={<RiskStudents />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
