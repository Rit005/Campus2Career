const Analytics = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📈 Workforce Analytics</h1>

      <AnalyticsCard title="Attrition Trends" />
      <AnalyticsCard title="Skill Demand Chart" />
      <AnalyticsCard title="Diversity Metrics" />
    </div>
  );
};

const AnalyticsCard = ({ title }) => (
  <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    <div className="h-60 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
      Chart Placeholder
    </div>
  </div>
);

export default Analytics;
