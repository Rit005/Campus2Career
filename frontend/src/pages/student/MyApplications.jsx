import React, { useEffect, useState } from "react";
import { studentAPI } from "../../api/student";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this application?")) return;

  try {
    const res = await studentAPI.deleteApplication(id);
    if (res.data.success) {
      setApplications(applications.filter((app) => app._id !== id));
    }
  } catch (err) {
    console.error("DELETE ERROR:", err);
  }
};

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await studentAPI.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error("LOAD APPLICATIONS ERROR:", err);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">📄 My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven't applied for any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
          <div key={app._id} className="bg-white shadow rounded-xl p-5 border">

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {app.jobId?.jobTitle || "No Title"}
                </h2>

                <p className="text-gray-600">
                  {app.jobId?.company || "Unknown Company"}
                </p>
              </div>

              <button
              onClick={() => handleDelete(app._id)}
              className="px-4 py-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 
                        rounded-full text-sm font-semibold transition-all duration-200"
            >
              Delete
            </button>
            </div>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    app.status === "applied"
                      ? "bg-blue-100 text-blue-700"
                      : app.status === "under review"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "shortlisted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : app.status === "selected"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {app.status}
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-2">
              Applied on: {new Date(app.createdAt).toLocaleDateString()}
            </p>

            {app.recruiterNotes && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Recruiter Notes:</strong> {app.recruiterNotes}
              </p>
            )}

          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;