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

  const openResume = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/recruiter/application/resume/:id`,
      {
        responseType: "blob",
        withCredentials: true,
      }
    );

    const file = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Resume open error:", error);
    alert("Unable to open resume");
  }
};

  const updateNote = async (id, note) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/recruiter/applicants/${id}/note`,
        { note },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("NOTE UPDATE ERROR:", error);
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
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100 text-sm text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-center">Resume</th>
                  <th className="p-3 text-left">Status & Notes</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{app.name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.phone}</td>

                    <td className="p-3 text-center">
                      <a
                        href={`http://localhost:5001/api/application/resume/${app._id}`}
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        View
                      </a>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold capitalize">{app.status}</p>

                      <textarea
                        className="w-full mt-2 p-2 border rounded text-sm"
                        placeholder="Add recruiter notes..."
                        defaultValue={app.recruiterNotes || ""}
                        onBlur={(e) => updateNote(app._id, e.target.value)}
                      />
                    </td>

                    <td className="p-3 text-center space-x-2">
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
          </div>

          <div className="md:hidden space-y-4">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="border rounded-lg p-4 shadow bg-white space-y-4"
              >
                <div className="space-y-1">
                  <p className="font-bold text-lg">{app.name}</p>
                  <p className="text-gray-600 text-sm">{app.email}</p>
                  <p className="text-gray-600 text-sm">{app.phone}</p>
                </div>

                <div>
                  <a
                    href={`http://localhost:5001/api/application/resume/${app._id}`}
                    className="text-blue-600 underline text-sm"
                    target="_blank"
                  >
                    View Resume
                  </a>
                </div>

                <div>
                  <p className="font-semibold capitalize">{app.status}</p>
                  <textarea
                    className="w-full mt-2 p-2 border rounded text-sm"
                    placeholder="Add recruiter notes..."
                    defaultValue={app.recruiterNotes || ""}
                    onBlur={(e) => updateNote(app._id, e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    className="w-full py-2 bg-green-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "selected")}
                  >
                    Select
                  </button>
                  <button
                    className="w-full py-2 bg-yellow-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "shortlisted")}
                  >
                    Shortlist
                  </button>
                  <button
                    className="w-full py-2 bg-red-600 text-white rounded"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewApplicants;