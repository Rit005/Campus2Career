import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  const loadApplicants = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/recruiter/applicants/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) setApplicants(res.data.applicants);
    } catch (error) {
      console.error("LOAD ERROR:", error);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.patch(
      `http://localhost:5001/api/recruiter/applicants/${id}/status`,
      { status },
      { withCredentials: true }
    );
    loadApplicants();
  };

  useEffect(() => {
    if (jobId) loadApplicants();
  }, [jobId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Applicants</h2>

      {applicants.length === 0 ? (
        <p className="text-gray-500">No students applied yet.</p>
      ) : (
        <table className="w-full border shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Resume</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="p-3 border">{app.name}</td>
                <td className="p-3 border">{app.email}</td>
                <td className="p-3 border">{app.phone}</td>

                <td className="p-3 border text-center">
                  <a
                    href={`http://localhost:5001/api/application/resume/${app._id}`}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    View Resume
                  </a>
                </td>

                <td className="p-3 border font-semibold">{app.status}</td>

                <td className="p-3 border space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "selected")}
                  >
                    Select
                  </button>

                  <button
                    className="px-3 py-1 bg-yellow-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "shortlisted")}
                  >
                    Shortlist
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewApplicants;