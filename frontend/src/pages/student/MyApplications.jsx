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

  if (loading) return <p className="p-6 text-gray-700">Loading applications...</p>;

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">📄</span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white shadow-sm border border-gray-200 p-6 rounded-xl text-gray-600 text-center">
          You haven't applied for any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-lg 
              transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                    {app.jobId?.jobTitle || "No Title"}
                  </h2>
                  <p className="text-gray-600 text-base">
                    {app.jobId?.company || "Unknown Company"}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(app._id)}
                  className="px-4 py-1.5 rounded-full border border-red-500 text-red-600 
                  hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold capitalize tracking-wide
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

              <p className="text-gray-500 text-sm mt-3">
                Applied on:{" "}
                <span className="font-medium text-gray-700">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </p>

              {app.recruiterNotes && (
                <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Recruiter Notes:</strong>{" "}
                    {app.recruiterNotes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;