const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900">📊 Hiring Dashboard</h1>

      {/* PIPELINE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Applicants" value="142" color="primary" />
        <Card title="Shortlisted" value="38" color="green" />
        <Card title="Interviews Scheduled" value="14" color="orange" />
      </div>

      {/* HIRING FUNNEL */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Hiring Funnel</h2>
        <p className="text-gray-500 mb-4">Visualizing candidate drop-off across hiring stages.</p>

        <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Funnel Chart Placeholder
        </div>
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
