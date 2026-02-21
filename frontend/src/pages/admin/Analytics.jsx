// frontend/src/pages/admin/Analytics.jsx
import { useState, useEffect } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import adminAPI from "../../api/admin";

export default function Analytics() {
  const [data, setData] = useState({ userGrowth: [], resumeUploads: [], marksheetUploads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getGrowthAnalytics(period);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  // Combine data for display
  const combinedData = [];
  const allDates = new Set([
    ...data.userGrowth.map(d => d._id),
    ...data.resumeUploads.map(d => d._id),
    ...data.marksheetUploads.map(d => d._id)
  ]);

  allDates.forEach(date => {
    const userEntry = data.userGrowth.find(d => d._id === date);
    const resumeEntry = data.resumeUploads.find(d => d._id === date);
    const marksheetEntry = data.marksheetUploads.find(d => d._id === date);
    
    combinedData.push({
      date: date.slice(5), // MM-DD format
      users: userEntry?.total || 0,
      resumes: resumeEntry?.count || 0,
      marksheets: marksheetEntry?.count || 0
    });
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resume & Marksheet Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Resume Uploads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="resumes" fill="#10B981" name="Resumes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Marksheet Uploads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marksheets" fill="#F59E0B" name="Marksheets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

