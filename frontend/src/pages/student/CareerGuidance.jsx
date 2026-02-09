import { useState, useEffect } from "react";
import { studentAPI } from "../../api/student";
import ApplyJobModal from "../student/ApplyJobModal";

const CareerGuidance = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [jobsModalOpen, setJobsModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadCareerProfile();
  }, []);

  // ================= LOAD CAREER PROFILE =================
  const loadCareerProfile = async () => {
    try {
      const res = await studentAPI.getCareerProfile();
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      console.error("Failed to load career profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= ANALYZE CAREER =================
  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await studentAPI.analyzeCareer();
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      console.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  // ================= VIEW ALL JOBS =================
  const handleViewJobs = async () => {
    setLoadingJobs(true);

    try {
      const res = await studentAPI.getAllJobs();
      if (res.data.success) {
        setJobs(res.data.jobs);
        setJobsModalOpen(true);   // OPEN MODAL
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // ================= APPLY JOB =================
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

  // ================= LOADING UI =================
  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Career Guidance</h2>

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze My Career"}
          </button>

          <button
            onClick={handleViewJobs}
            disabled={loadingJobs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loadingJobs ? "Loading Jobs..." : "View All Jobs"}
          </button>
        </div>
      </div>

      {/* ================= PROFILE SECTIONS (same as your code) ================= */}
      {/* your same UI continues… */}

      {/* ================= JOBS MODAL ================= */}
      {jobsModalOpen && (
        <JobsModal
          jobs={jobs}
          close={() => setJobsModalOpen(false)}
          onApply={(job) => {
            setSelectedJob(job);
            setApplyModalOpen(true);
          }}
        />
      )}

      {/* APPLY JOB MODAL */}
      {applyModalOpen && selectedJob && (
        <ApplyJobModal
          job={selectedJob}
          onClose={() => setApplyModalOpen(false)}
          onSubmit={submitJobApplication}
        />
      )}
    </div>
  );
};

/* ========================= JOBS MODAL (COPIED FROM RECRUITER) ========================= */
/* ========================= JOBS MODAL WITH DROPDOWN FILTER ========================= */
const JobsModal = ({ jobs, close, onApply }) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Extract unique roles dynamically
  const jobRoles = [...new Set(jobs.map((job) => job.jobTitle))];

  const filtered = jobs.filter((job) => {
    const textMatch =
      (job.jobTitle + job.company + job.jobLocation)
        .toLowerCase()
        .includes(search.toLowerCase());

    const roleMatch = roleFilter ? job.jobTitle === roleFilter : true;

    return textMatch && roleMatch;
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] flex flex-col">
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b shadow">
        <h2 className="text-2xl font-bold">📄 All Available Jobs</h2>
        <button
          onClick={close}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>

      {/* Search + Dropdown Row */}
      <div className="p-4 border-b bg-gray-50 flex gap-4">
        <input
          type="text"
          placeholder="Search job title, company, location…"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 border rounded-lg w-56 bg-white"
        >
          <option value="">All Roles</option>
          {jobRoles.map((role, i) => (
            <option key={i} value={role}>
              {role}
            </option>
          ))}
        </select>
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


export default CareerGuidance;
