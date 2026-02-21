// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import adminAPI from "../../api/admin";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getOverview();
      if (res.data.success) {
        setOverview(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch overview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={overview?.totalUsers || 0} 
          icon="👥" 
          color="bg-blue-100" 
        />
        <StatCard 
          title="Students" 
          value={overview?.totalStudents || 0} 
          icon="🎓" 
          color="bg-green-100" 
        />
        <StatCard 
          title="Recruiters" 
          value={overview?.totalRecruiters || 0} 
          icon="💼" 
          color="bg-purple-100" 
        />
        <StatCard 
          title="Resumes Uploaded" 
          value={overview?.totalResumesUploaded || 0} 
          icon="📄" 
          color="bg-yellow-100" 
        />
        <StatCard 
          title="Marksheets Uploaded" 
          value={overview?.totalMarksheetsUploaded || 0} 
          icon="📋" 
          color="bg-orange-100" 
        />
        <StatCard 
          title="Active Users (7 days)" 
          value={overview?.totalActiveUsers || 0} 
          icon="⚡" 
          color="bg-red-100" 
        />
      </div>
    </div>
  );
}

