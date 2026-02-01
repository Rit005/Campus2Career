import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AcademicDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await studentAPI.getAcademicDashboard();
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  if (!data || !data.overallPerformance) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Academic Dashboard</h2>
        <p className="text-gray-500">No academic data yet. Upload your marksheets to see your analytics.</p>
      </div>
    );
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Academic Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Overall Performance</p>
          <p className="text-3xl font-bold text-blue-600">{data.overallPerformance}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Semesters</p>
          <p className="text-3xl font-bold text-green-600">{data.totalSemesters}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Consistency</p>
          <p className="text-3xl font-bold text-purple-600">{data.consistencyScore}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Strengths</p>
          <p className="text-3xl font-bold text-teal-600">{data.strengths?.length || 0}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Semester Trend */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.semesterTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.subjectWisePerformance?.slice(0, 8) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="average" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Strengths (≥75%)</h3>
          {data.strengths?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No strong subjects yet.</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Areas for Improvement (&lt; 50%)</h3>
          {data.weaknesses?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map((w, i) => (
                <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">{w}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No weak subjects identified!</p>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Academic Insights</h3>
        <ul className="space-y-2">
          {data.recommendations?.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">💡</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AcademicDashboard;

