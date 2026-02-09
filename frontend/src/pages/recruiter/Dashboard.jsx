import { useEffect, useState } from "react";
import recruiterAPI from "../../api/recruiter";
import { studentAPI } from "../../api/student";
import ApplyJobModal from "../student/ApplyJobModal.jsx";


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState({});
  const [insights, setInsights] = useState({
    funnel_metrics: [],
    bottlenecks: [],
    recommendations: [],
    prediction: "",
  });

  const [jobsModalOpen, setJobsModalOpen] = useState(false);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [allJobs, setAllJobs] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const cleanValue = (v) => {
    if (Array.isArray(v)) return v.map(cleanValue);
    if (typeof v === "object" && v !== null) return JSON.stringify(v);
    return v;
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await recruiterAPI.dashboard({});
      const d = res.data;

      setPipeline(d.pipeline || {});
      setInsights({
        funnel_metrics: cleanValue(d.insights?.funnel_metrics || []),
        bottlenecks: cleanValue(d.insights?.bottlenecks || []),
        recommendations: cleanValue(d.insights?.recommendations || []),
        prediction: cleanValue(d.insights?.future_prediction || ""),
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadAllJobs = async () => {
    try {
      const res = await recruiterAPI.getAllJobs();
      if (res.data.success) {
        setAllJobs(res.data.jobs);
        setJobsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllStudents = async () => {
    try {
      const res = await studentAPI.getAllStudents();
      if (res.data.success) {
        setAllStudents(res.data.students);
        setStudentsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitJobApplication = async ({ jobId, jobRole, message, resume }) => {
    try {
      const form = new FormData();
      form.append("jobId", jobId);
      form.append("jobRole", jobRole);
      form.append("message", message);
      form.append("resume", resume);

      const res = await studentAPI.applyForJob(form);

      if (res.data.success) {
        alert("Application Submitted!");
        setApplyModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-xl">Loading...</div>
    );
  }

  return (
    <>
      {/* MAIN DASHBOARD */}
      <div
        className={`space-y-10 transition-all ${
          jobsModalOpen || studentsModalOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <h1 className="text-4xl font-bold">📊 Hiring Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={loadAllJobs}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            📄 View All Jobs
          </button>

          <button
            onClick={loadAllStudents}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            👨‍🎓 View All Students
          </button>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card title="🧑‍💼 Applicants" value={pipeline.applicants} color="blue" />
          <Card title="📌 Shortlisted" value={pipeline.shortlisted} color="green" />
          <Card title="🎤 Interviews" value={pipeline.interviews} color="orange" />
          <Card title="📢 Jobs Posted" value={pipeline.jobsPosted} color="red" />
        </div>

        <FancySection title="Hiring Funnel" list={insights.funnel_metrics} />
        <FancySection title="Process Bottlenecks" list={insights.bottlenecks} />
        <FancySection title="AI Recommendations" list={insights.recommendations} />
      </div>

      {/* JOBS MODAL */}
      {jobsModalOpen && (
        <JobsModal
          jobs={allJobs}
          close={() => setJobsModalOpen(false)}
          onApply={(job) => {
            setSelectedJob(job);
            setApplyModalOpen(true);
          }}
        />
      )}

      {/* STUDENTS MODAL */}
      {studentsModalOpen && (
        <StudentsModal
          students={allStudents}
          close={() => setStudentsModalOpen(false)}
        />
      )}

      {/* APPLY JOB MODAL – HIGHEST LAYER */}
      {applyModalOpen && selectedJob && (
        <ApplyJobModal
          job={selectedJob}
          onClose={() => setApplyModalOpen(false)}
          onSubmit={submitJobApplication}
        />
      )}
    </>
  );
};

/* CARD */
const Card = ({ title, value, color }) => (
  <div className="bg-white shadow-md border rounded-xl p-6 text-center">
    <h3 className="text-gray-600">{title}</h3>
    <p className={`text-4xl font-bold mt-2 text-${color}-600`}>{value ?? 0}</p>
  </div>
);

/* SECTION */
const FancySection = ({ title, list }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 border">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {list.length === 0 ? (
      <p className="text-gray-500 italic">AI is analyzing…</p>
    ) : (
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        {list.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    )}
  </div>
);

/* JOBS MODAL */
const JobsModal = ({ jobs, close, onApply }) => {
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) =>
    (job.jobTitle + job.company + job.jobLocation)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] flex flex-col">
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow">
        <h2 className="text-2xl font-bold">📄 All Posted Jobs</h2>
        <button onClick={close} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Close
        </button>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <table className="w-full border bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Job Title</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border">Skills</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="p-3 border">{job.jobTitle}</td>
                <td className="p-3 border">{job.company}</td>
                <td className="p-3 border">{job.jobLocation}</td>
                <td className="p-3 border">{job.requiredSkills.join(", ")}</td>
                <td className="p-3 border text-center">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => onApply(job)}
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* STUDENTS MODAL */
const StudentsModal = ({ students, close }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90000] flex justify-center items-center">
    <div className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-xl border">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">👨‍🎓 All Students</h2>
        <button onClick={close} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Close
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full border bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Skills</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="p-3 border">{s.name}</td>
                <td className="p-3 border">{s.email}</td>
                <td className="p-3 border">{s.branch}</td>
                <td className="p-3 border">{s.skills?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Dashboard;
