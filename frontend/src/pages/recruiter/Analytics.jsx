import { useEffect, useState } from "react";
import recruiterAPI from "../../api/recruiter";
import { Pie, Bar, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const COLORS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444",
  "#3B82F6", "#8B5CF6", "#14B8A6", "#EC4899"
];

const RecruiterAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    recruiterAPI.getAnalytics().then((res) => {
      if (res.data.success) setData(res.data.data);
    });
  }, []);

  if (!data)
    return (
      <div className="text-center mt-20 text-xl text-gray-500 animate-pulse">
        Loading analytics…
      </div>
    );

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-1">
        📊 Recruiter Analytics
      </h1>

      {/* TOTAL STUDENTS */}
      <div className="bg-white p-8 shadow border border-gray-200 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-700">Total Students</h2>
        <p className="text-6xl font-bold text-[#11a1de] mt-2">
          {data.totalStudents}
        </p>
      </div>

      {/* SKILL DISTRIBUTION */}
      <ChartCard title="Skill Distribution">
        <Bar
          data={{
            labels: data.skillDistribution.map((s) => s._id),
            datasets: [
              {
                label: "Students",
                data: data.skillDistribution.map((s) => s.count),
                backgroundColor: "#6366F1",
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </ChartCard>

      {/* JOB SKILL DEMAND */}
      <ChartCard title="Top Job Skill Demand">
        <Bar
          data={{
            labels: data.jobSkillDemand.map((s) => s._id),
            datasets: [
              {
                label: "Jobs Requiring Skill",
                data: data.jobSkillDemand.map((s) => s.jobCount),
                backgroundColor: "#10B981",
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </ChartCard>

      {/* MONTHLY JOB POST TREND */}
      <ChartCard title="Monthly Job Posting Trend">
        <Line
          data={{
            labels: data.jobPostingTrend.map((t) => t._id),
            datasets: [
              {
                label: "Jobs Posted",
                data: data.jobPostingTrend.map((t) => t.count),
                borderColor: "#3B82F6",
                tension: 0.4,
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </ChartCard>

      {/* JOB DEMAND VS STUDENT SUPPLY */}
      <ChartCard title="Job Demand VS Student Supply">
        <Bar
          data={{
            labels: data.skillDistribution.map((s) => s._id),
            datasets: [
              {
                label: "Students",
                data: data.skillDistribution.map((s) => s.count),
                backgroundColor: "#6366F1",
              },
              {
                label: "Job Demand",
                // Align jobDemand counts with same labels by mapping correctly
                data: data.skillDistribution.map(
                  (s) =>
                    data.jobSkillDemand.find((d) => d._id === s._id)?.jobCount ||
                    0
                ),
                backgroundColor: "#10B981",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </ChartCard>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-8 shadow border border-gray-200 rounded-xl space-y-4">
    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
    <div className="h-[320px]">{children}</div>
  </div>
);

export default RecruiterAnalytics;
