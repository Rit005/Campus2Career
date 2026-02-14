import React, { useEffect, useState } from "react";
import studentAPI from "../api/student";
import { Link } from "react-router-dom";

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

/* ================= HELPERS ================= */

const getGradeColor = (grade) => {
  if (!grade) return "text-gray-600 bg-gray-100";
  if (grade.startsWith("A")) return "text-green-700 bg-green-100";
  if (grade.startsWith("B")) return "text-blue-700 bg-blue-100";
  if (grade.startsWith("C")) return "text-yellow-700 bg-yellow-100";
  return "text-red-700 bg-red-100";
};

const getStatus = (mark) => {
  const m = Number(mark);
  if (m >= 80) return "Excellent";
  if (m >= 35) return "Needs Work";
  return "At Risk";
};

const semesterColors = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#14b8a6",
  "#ef4444",
  "#eab308",
];

/* ================= COMPONENT ================= */

const StudentDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resAnalytics, resSem] = await Promise.all([
          studentAPI.getAcademicAnalytics(),
          studentAPI.getSemesterWise(),
        ]);

        if (resAnalytics.data.success) {
          setAnalytics(resAnalytics.data.data);
        }

        if (resSem.data.success) {
          const semData = resSem.data.data || [];
          setSemesters(semData);
          setSelectedSem(semData.length > 0 ? semData[0] : null);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500 animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */

  if (!analytics || semesters.length === 0) {
    return (
      <div className="text-center mt-20 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">
          No Academic Data Found 📄
        </h2>

        <p className="text-gray-600">
          Upload your first marksheet to unlock analytics & insights.
        </p>

        <Link
          to="/student/marksheet-upload"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Upload Marksheet
        </Link>
      </div>
    );
  }

  /* ================= SAFE DESTRUCTURE ================= */

  const {
    subjectWise = [],
    radarChart = { data: [], semesters: [] },
    progressTrend = [],
    consistencyScore = 0,
  } = analytics;

  /* ================= RENDER ================= */

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Academic Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your academic journey
        </p>
      </div>

      {/* ================= TOP CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl">🎓 Academic Consistency</h2>
          <p className="mt-3 text-4xl font-bold text-indigo-600">
            {consistencyScore}%
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl">⭐ Top Strengths</h2>
          <ul className="mt-3 space-y-2">
            {subjectWise
              .sort((a, b) => b.marks - a.marks)
              .slice(0, 3)
              .map((s) => (
                <li key={s.subject} className="text-indigo-700 font-medium">
                  • {s.subject}
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl">⚡ Quick Tools</h2>
          <p>Resume builder & interview prep</p>
        </div>
      </div>

      {/* ================= SEMESTER SELECT ================= */}

      <div className="bg-white shadow rounded-xl p-6">
        <label className="font-medium">Select Semester:</label>
        <select
          className="w-full mt-2 border p-3 rounded"
          value={selectedSem?.semester || ""}
          onChange={(e) =>
            setSelectedSem(
              semesters.find((s) => s.semester === e.target.value)
            )
          }
        >
          {semesters.map((s) => (
            <option key={s.semester} value={s.semester}>
              {s.semester}
            </option>
          ))}
        </select>
      </div>

      {/* ================= SUBJECT TABLE ================= */}

      {selectedSem && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between">
            <h3 className="text-lg font-semibold">
              📘 Subjects – {selectedSem.semester}
            </h3>

            {selectedSem.percentage && (
              <p className="text-indigo-600 font-semibold text-lg">
                {selectedSem.percentage}%
              </p>
            )}
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Marks</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {selectedSem.subjects.map((item) => {
                const percentage = (
                  (item.marks / item.maxMarks) *
                  100
                ).toFixed(2);

                return (
                  <tr key={item.name}>
                    <td className="px-6 py-4 font-medium">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">{percentage}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                          item.grade
                        )}`}
                      >
                        {item.grade || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatus(percentage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= RADAR ================= */}

      {radarChart.data.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <div className="min-w-[900px]">
            <h3 className="font-semibold mb-4">
              Strengths & Weaknesses (Semester-wise)
            </h3>

            <ResponsiveContainer width="100%" height={450}>
              <RadarChart data={radarChart.data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />

                {radarChart.semesters.map((sem, index) => (
                  <Radar
                    key={sem.dataKey}
                    name={sem.semester}
                    dataKey={sem.dataKey}
                    stroke={semesterColors[index % semesterColors.length]}
                    fill={semesterColors[index % semesterColors.length]}
                    fillOpacity={0.4}
                  />
                ))}

                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ================= PROGRESS ================= */}

      {progressTrend.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            Progress Comparison
          </h3>

          <ResponsiveContainer width="100%" height={350}>
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
      )}

      {/* ================= CONSISTENCY ================= */}

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold">Consistency Score</h3>
        <span className="text-4xl font-bold text-indigo-600">
          {consistencyScore}%
        </span>

        <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${consistencyScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
