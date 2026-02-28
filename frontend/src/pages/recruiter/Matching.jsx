import { useState, useEffect } from "react";
import recruiterAPI from "../../api/recruiter";

const Matching = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");

  const [loading, setLoading] = useState(false); 
  const [myJobs, setMyJobs] = useState([]);

  const [jobMatches, setJobMatches] = useState({}); 
  const [matchLoadingFor, setMatchLoadingFor] = useState(null); 

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await recruiterAPI.getMyJobs();
      if (res.data.success) {
        setMyJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      setLoading(true);
      const res = await recruiterAPI.deleteJob(jobId);

      if (res.data.success) {
        alert("Job deleted successfully");
        loadJobs();
      }
    } catch (err) {
      console.error("DELETE JOB ERROR:", err);
      alert("Failed to delete job");
    }

    setLoading(false);
  };

  const handlePostJob = async () => {
    if (!jobTitle || !company || !jobLocation || !jobDescription || !requiredSkills) {
      return alert("Please fill required fields");
    }

    const skillsArray = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    const jobData = {
      jobTitle,
      company,
      salary,
      jobLocation,
      jobDescription,
      requiredSkills: skillsArray,
    };

    try {
      setLoading(true);
      const res = await recruiterAPI.postJob(jobData);

      if (res.data.success) {
        alert("Job posted successfully!");
        await loadJobs();

        setJobTitle("");
        setCompany("");
        setSalary("");
        setJobLocation("");
        setJobDescription("");
        setRequiredSkills("");
      }
    } catch (err) {
      console.error("POST JOB ERROR:", err);
      alert("Failed to post job");
    }

    setLoading(false);
  };

  const matchForJob = async (job) => {
    setMatchLoadingFor(job._id); 

    try {
      const res = await recruiterAPI.matchCandidates({
        requiredSkills: job.requiredSkills || [],
        jobDescription: job.jobDescription || "",
      });

      if (res.data.success) {
        setJobMatches((prev) => ({
          ...prev,
          [job._id]: res.data.candidates,
        }));
      }
    } catch (err) {
      console.error("MATCH ERROR:", err);
      alert("Error while matching candidates");
    }

    setMatchLoadingFor(null);
  };

  return (
    <div className="space-y-10 py-6">

      <h1 className="text-3xl font-bold text-gray-900">🤝 Post Jobs</h1>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Post a Job</h2>

        <div className="grid gap-4">

          <label>Company Name</label>
          <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />

          <label>Job Location</label>
          <input className="input" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} />

          <label>Job Title</label>
          <input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

          <label>Salary</label>
          <input className="input" value={salary} onChange={(e) => setSalary(e.target.value)} />

          <label>Job Description</label>
          <textarea className="input" rows="3" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />

          <label>Required Skills (comma separated)</label>
          <input className="input" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />

          <button
            onClick={handlePostJob}
            className="bg-primary-600 text-white px-5 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📄 Your Posted Jobs</h2>

        {myJobs.length === 0 ? (
          <p className="text-gray-500">You haven't posted any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg bg-gray-50">


                <h3 className="font-bold text-lg">{job.jobTitle}</h3>
                <p>Company: {job.company}</p>
                <p>Salary: {job.salary || "Not specified"}</p>
                <p>Location: {job.jobLocation}</p>

                <p><strong>Skills:</strong> {(job.requiredSkills || []).join(", ")}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => matchForJob(job)}
                    disabled={!job.requiredSkills?.length}
                    className={`px-4 py-1 rounded-md ${
                      job.requiredSkills?.length
                        ? "bg-blue-600 text-white"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {matchLoadingFor === job._id ? "Matching..." : "🔍 Match"}
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-md"
                  >
                    🗑 Delete
                  </button>
                </div>

                {jobMatches[job._id] && (
                  <div className="mt-4 p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Matched Candidates</h4>

                    {jobMatches[job._id].length === 0 ? (
                      <p className="text-gray-500">No matches found.</p>
                    ) : (
                      <div className="space-y-3">
                        {jobMatches[job._id].map((c, i) => (
                          <div key={i} className="p-3 border rounded-lg bg-gray-100">
                            <div className="flex justify-between">
                              <p className="font-medium">{c.name}</p>
                              <span className="text-primary-600 font-semibold">
                                {c.matchScore}%
                              </span>
                            </div>
                            <p className="text-gray-700">{c.email}</p>
                            <p><strong>Matched Skills:</strong> {c.matchedSkills.join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Matching;
