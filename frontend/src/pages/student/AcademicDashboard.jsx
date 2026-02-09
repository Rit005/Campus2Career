import React, { useEffect, useState } from "react";
import { studentAPI } from "../../api/student";

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
} from "recharts";

/* ---------------- HELPERS ---------------- */

const getGradeColor = (grade) => {
  if (!grade) return "text-gray-600 bg-gray-100";

  if (grade.startsWith("A")) return "text-green-700 bg-green-100";
  if (grade.startsWith("B")) return "text-blue-700 bg-blue-100";
  if (grade.startsWith("C")) return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
};

/* ---------------- COMPONENT ---------------- */

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH FROM BACKEND ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentAPI.getAcademicAnalytics();
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !analytics)
    return (
      <div className="text-center mt-20 text-xl text-gray-500 animate-pulse">
        Loading Dashboard…
      </div>
    );

  const { subjectWise, radarChart, progressTrend, consistencyScore } = analytics;

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-600 mt-1">
          Track performance trends, strengths, and risks
        </p>
      </div>

      {/* ---------------- SUBJECT-WISE TABLE ---------------- */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Subject-wise Performance</h3>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Marks (%)</th>
              <th className="px-6 py-3 text-left">Grade</th>
              <th className="px-6 py-3 text-left">Credits</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {subjectWise.map((item) => (
              <tr key={item.subject} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{item.subject}</td>

                <td className="px-6 py-4">
                  <div>{item.marks}%</div>

                  <div className="w-full bg-gray-200 h-1.5 rounded mt-1">
                    <div
                      className={`h-1.5 rounded ${
                        item.marks >= 80
                          ? "bg-green-500"
                          : item.marks >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.marks}%` }}
                    />
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                      item.grade
                    )}`}
                  >
                    {item.grade}
                  </span>
                </td>

                <td className="px-6 py-4">{item.credits}</td>

                <td className="px-6 py-4 font-medium">
                  {item.marks >= 80
                    ? "Excellent"
                    : item.marks >= 60
                    ? "Needs Work"
                    : "At Risk"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- RADAR + BAR CHART ---------------- */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* RADAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Strengths & Weaknesses</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarChart}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* PROGRESS BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Progress Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={progressTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="previous" fill="#94a3b8" />
              <Bar dataKey="current" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- CONSISTENCY SCORE ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Consistency Score</h3>
          <span className="text-4xl font-bold text-indigo-600">
            {consistencyScore}%
          </span>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${consistencyScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
