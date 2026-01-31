import { useEffect, useState } from "react";
import { recruiterAPI } from "../../api/recruiter";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState({
    applicants: 0,
    shortlisted: 0,
    interviews: 0,
  });

  const [funnel, setFunnel] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const samplePipeline = {
        applicants: 142,
        shortlisted: 38,
        interviews: 14,
      };

      const res = await recruiterAPI.dashboard({ pipeline: samplePipeline });

      const data = res.data.data;

      setPipeline(samplePipeline);
      setFunnel(data.funnel_metrics || []);
      setBottlenecks(data.bottlenecks || []);
      setRecommendations(data.recommendations || []);

    } catch (err) {
      console.error("Dashboard error:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-xl">
        Loading hiring dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📊 Hiring Dashboard</h1>

      {/* PIPELINE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Applicants" value={pipeline.applicants} color="primary" />
        <Card title="Shortlisted" value={pipeline.shortlisted} color="green" />
        <Card title="Interviews" value={pipeline.interviews} color="orange" />
      </div>

      {/* FUNNEL */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Hiring Funnel</h2>

        {funnel.length === 0 ? (
          <p className="text-gray-500">AI is analyzing the hiring funnel...</p>
        ) : (
          <ul className="list-disc ml-5 text-gray-700">
            {funnel.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
      </div>

      {/* BOTTLENECKS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Process Bottlenecks</h2>

        {bottlenecks.length === 0 ? (
          <p className="text-gray-500">No bottlenecks found.</p>
        ) : (
          <ul className="list-disc ml-5 text-gray-700">
            {bottlenecks.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>

        {recommendations.length === 0 ? (
          <p className="text-gray-500">AI suggestions will appear here.</p>
        ) : (
          <ul className="list-disc ml-5 text-gray-700">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className="bg-white shadow rounded-xl p-6">
    <h3 className="text-gray-600">{title}</h3>
    <p className={`text-3xl font-bold mt-2 text-${color}-600`}>{value}</p>
  </div>
);

export default Dashboard;
