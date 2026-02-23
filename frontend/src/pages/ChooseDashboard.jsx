import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api";

const ChooseDashboard = () => {
  const { loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = async (role) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await authAPI.selectRole({ role });

      if (!res.data.success) {
        throw new Error("Role selection failed");
      }

      const updatedUser = await refreshUser();

      if (updatedUser?.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (updatedUser?.role === "recruiter") {
        navigate("/recruiter/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to select role"
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f9fd]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f9fd] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Welcome to Campus2Career
      </h1>
      <p className="text-gray-500 mb-12">
        Choose your dashboard to continue
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
        <div
          onClick={() => handleRoleSelect("student")}
          className="bg-white rounded-2xl shadow-lg p-10 text-center cursor-pointer transition hover:shadow-2xl"
        >
         <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center text-6xl">
  🎓
</div>

          <h2 className="text-2xl font-semibold mb-2">
            Student Dashboard
          </h2>
          <p className="text-gray-500 mb-6">
            Access your job search tools, apply to positions, and track your
            career journey.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              Find Jobs
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              Build Profile
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
              Track Applications
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Select Student →
          </button>
        </div>

        <div
          onClick={() => handleRoleSelect("recruiter")}
          className="bg-white rounded-2xl shadow-lg p-10 text-center cursor-pointer transition hover:shadow-2xl border-2 border-blue-500"
        >
         <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center text-5xl">
  🏢
</div>
          <h2 className="text-2xl font-semibold mb-2">
            Recruiter Dashboard
          </h2>
          <p className="text-gray-500 mb-6">
            Post jobs, review candidates, and build your talent pipeline.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              Post Jobs
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              Review Candidates
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
              Manage Team
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Select Recruiter →
          </button>
        </div>
      </div>

      <p className="mt-12 text-sm text-gray-400">
        You can switch between dashboards later in your settings
      </p>
    </div>
  );
};

export default ChooseDashboard;
