const StudentDashboard = () => {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Academic Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your academics, goals, and progress.
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1 */}
        <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">🎓 Academic Progress</h2>
          <p className="text-gray-600">
            Track your semester performance and course completion.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">📝 Upcoming Deadlines</h2>
          <p className="text-gray-600">
            Assignments, quiz dates, and exam reminders.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">⚡ Quick Tools</h2>
          <p className="text-gray-600">
            Résumé builder, interview prep & skill development.
          </p>
        </div>

      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SECTION */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">📘 Current Courses</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="p-3 bg-gray-50 rounded-lg">• Data Structures</li>
            <li className="p-3 bg-gray-50 rounded-lg">• Operating Systems</li>
            <li className="p-3 bg-gray-50 rounded-lg">• DBMS</li>
            <li className="p-3 bg-gray-50 rounded-lg">• Computer Networks</li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">🚀 Career Suggestions</h3>
          <p className="text-gray-600">
            AI-powered insights based on your skills and academics.
          </p>

          <div className="mt-4 space-y-3">
            <div className="p-3 bg-primary-50 rounded-lg">
              • Software Developer Roadmap
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              • Competitive Coding Guide
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              • Resume Improvement Tips
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
