import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for performance trends (semester-wise)
const performanceTrend = [
  { semester: 'Sem 1', marks: 75 },
  { semester: 'Sem 2', marks: 78 },
  { semester: 'Sem 3', marks: 82 },
  { semester: 'Sem 4', marks: 79 },
  { semester: 'Sem 5', marks: 85 },
  { semester: 'Sem 6', marks: 88 },
];

// Mock data for subject-wise performance
const subjectPerformance = [
  { subject: 'Math', marks: 85, credits: 4 },
  { subject: 'Science', marks: 78, credits: 3 },
  { subject: 'English', marks: 88, credits: 3 },
  { subject: 'History', marks: 72, credits: 2 },
  { subject: 'Physics', marks: 90, credits: 4 },
];

// Static insights data
const insights = [
  'Your performance has improved by 13% compared to first semester',
  'Physics and English are your strongest subjects',
  'Consider focusing on History to improve overall GPA',
];

/**
 * Student Dashboard Overview Page
 * Displays KPIs, performance charts, and insights
 */
const Dashboard = () => {
  // Calculate KPIs from mock data
  const averageMarks = Math.round(
    subjectPerformance.reduce((sum, s) => sum + s.marks, 0) / subjectPerformance.length
  );
  const attendancePercentage = 87;
  const riskLevel = averageMarks >= 80 ? 'Low' : averageMarks >= 60 ? 'Medium' : 'High';
  const totalSkills = 8;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Average Marks Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Average Marks</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{averageMarks}%</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">↑ 2.5%</span>
            <span className="text-gray-400 ml-2">vs last semester</span>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Attendance</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{attendancePercentage}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        {/* Academic Risk Level Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Risk Level</p>
          <p
            className={`text-3xl font-bold mt-2 ${
              riskLevel === 'Low'
                ? 'text-green-500'
                : riskLevel === 'Medium'
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}
          >
            {riskLevel}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {riskLevel === 'Low' ? 'On track for graduation' : 'Needs improvement'}
          </p>
        </div>

        {/* Total Skills Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Total Skills</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalSkills}</p>
          <p className="text-sm text-gray-400 mt-2">Skills in your portfolio</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semester" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="marks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI Insights
        </h2>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

