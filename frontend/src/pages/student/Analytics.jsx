import React from 'react';
import {
  RadarChart,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// Mock subject data with grades
const subjectData = [
  { subject: 'Mathematics', marks: 85, grade: 'A', credits: 4 },
  { subject: 'Physics', marks: 78, grade: 'B+', credits: 3 },
  { subject: 'Chemistry', marks: 82, grade: 'A-', credits: 3 },
  { subject: 'English', marks: 88, grade: 'A', credits: 3 },
  { subject: 'Computer Science', marks: 92, grade: 'A+', credits: 4 },
  { subject: 'History', marks: 70, grade: 'C+', credits: 2 },
];

// Radar chart data for strengths & weaknesses
const radarData = [
  { subject: 'Mathematics', fullMark: 100, value: 85 },
  { subject: 'Physics', fullMark: 100, value: 78 },
  { subject: 'Chemistry', fullMark: 100, value: 82 },
  { subject: 'English', fullMark: 100, value: 88 },
  { subject: 'Computer Science', fullMark: 100, value: 92 },
  { subject: 'History', fullMark: 100, value: 70 },
];

// Progress comparison data
const progressComparison = [
  { semester: 'Sem 3', previous: 72, current: 78 },
  { semester: 'Sem 4', previous: 75, current: 79 },
  { semester: 'Sem 5', previous: 78, current: 85 },
  { semester: 'Sem 6', previous: 80, current: 88 },
];

/**
 * Grade helper function
 */
const getGradeColor = (grade) => {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

/**
 * Academic Analytics Page
 * Detailed analytics with subject table, radar chart, and progress comparison
 */
const Analytics = () => {
  const consistencyScore = 85;
  const averageMarks = Math.round(
    subjectData.reduce((sum, s) => sum + s.marks, 0) / subjectData.length
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Academic Analytics</h1>

      {/* Subject-wise Performance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Subject-wise Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjectData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.marks}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.marks >= 80
                            ? 'bg-green-500'
                            : item.marks >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${item.marks}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(
                        item.grade
                      )}`}
                    >
                      {item.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.marks >= 80 ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Excellent
                      </span>
                    ) : item.marks >= 60 ? (
                      <span className="inline-flex items-center text-yellow-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Needs Work
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        At Risk
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart for Strengths & Weaknesses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Strengths & Weaknesses</h2>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Comparison</h2>
          <p className="text-sm text-gray-500 mb-4">Previous vs Current Semester</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={progressComparison}>
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
              <Bar dataKey="previous" name="Previous Semester" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Semester" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consistency Score Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Consistency Score</h2>
            <p className="text-sm text-gray-500">
              Based on your performance patterns over the last 4 semesters
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-indigo-600">{consistencyScore}%</div>
            <div className="text-sm text-gray-400 mt-1">Very Consistent</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{consistencyScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${consistencyScore}%` }}
            />
          </div>
        </div>
        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">+8%</div>
            <div className="text-xs text-gray-500">Improvement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">92%</div>
            <div className="text-xs text-gray-500">Best Subject (CS)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">70%</div>
            <div className="text-xs text-gray-500">Needs Focus (History)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

