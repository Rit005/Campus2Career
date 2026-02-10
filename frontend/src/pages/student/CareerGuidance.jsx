import { useState, useEffect } from "react";
import { studentAPI } from "../../api/student";
import ApplyJobModal from "../student/ApplyJobModal";

const CareerGuidance = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [jobsModalOpen, setJobsModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Load & Analyze Career Immediately
  useEffect(() => {
    analyzeCareer();
  }, []);

  // ================= ANALYZE CAREER (Auto Runs) =================
  const analyzeCareer = async () => {
    try {
      const res = await studentAPI.analyzeCareer();
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      console.error("Career analysis failed:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ================= VIEW JOBS =================
  const handleViewJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await studentAPI.getAllJobs();
      if (res.data.success) {
        setJobs(res.data.jobs);
        setJobsModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // ================= APPLY =================
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

  // ================= LOADING SCREEN =================
  if (loadingProfile)
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Career Guidance</h2>

        <button
          onClick={handleViewJobs}
          disabled={loadingJobs}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loadingJobs ? "Loading Jobs..." : "View All Jobs"}
        </button>
      </div>

      {/* ================= SHOW CAREER RESULTS ================= */}
      {profile ? (
        <div className="space-y-10">

          {/* ---- CAREER DOMAINS ---- */}
          <Section title="🎯 Best Career Domains for You">
            <Grid>
              {profile.careerDomains?.map((d, i) => (
                <Card key={i}>
                  <h3 className="font-bold">{d.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">{d.description}</p>
                  <p className="mt-2 text-blue-600 font-bold">
                    Match Score: {d.matchScore}%
                  </p>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- ROLES ---- */}
          <Section title="💼 Recommended Job Roles">
            <Grid>
              {profile.recommendedRoles?.map((r, i) => (
                <Card key={i}>
                  <h3 className="font-bold">{r.title}</h3>
                  <p className="text-gray-700">{r.description}</p>
                  <p className="text-sm text-blue-600">Domain: {r.domain}</p>
                  <p className="text-sm font-bold">Match: {r.matchScore}%</p>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- HIGHER STUDIES ---- */}
          <Section title="🎓 Higher Studies Recommendations">
            <h3 className="text-xl font-semibold mb-3">India (M.Tech)</h3>
            <Grid>
              {profile.higherStudies?.india?.map((h, i) => (
                <Card key={i}>
                  <p className="font-bold">{h.program}</p>
                  <p className="text-gray-700 mt-1">Top Colleges:</p>
                  <ul className="list-disc ml-4 text-gray-600">
                    {h.colleges.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </Grid>

            <h3 className="text-xl font-semibold mt-8 mb-3">Abroad (MS)</h3>
            <Grid>
              {profile.higherStudies?.abroad?.map((h, i) => (
                <Card key={i}>
                  <p className="font-bold">{h.program}</p>
                  <p className="mt-1 text-gray-700">Countries: {h.countries.join(", ")}</p>
                  <p className="mt-1 text-gray-700">Universities:</p>
                  <ul className="list-disc ml-4 text-gray-600">
                    {h.universities.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- RECOMMENDED COLLEGES ---- */}
          <Section title="🏫 Recommended Colleges">
            <Grid>
              {profile.recommendedColleges?.map((c, i) => (
                <Card key={i}>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-gray-700 mt-1">{c.reason}</p>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- SKILL GAPS ---- */}
          <Section title="⚠️ Skill Gaps to Improve">
            <Grid>
              {profile.skillGaps?.map((g, i) => (
                <Card key={i}>
                  <p className="font-bold">{g.skill}</p>
                  <p className="mt-1 text-gray-700">Importance: {g.importance}</p>
                  <p className="text-gray-700 mt-1">Resources:</p>
                  <ul className="list-disc ml-4 text-gray-600">
                    {g.resources.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- CERTIFICATIONS ---- */}
          <Section title="🎖 Recommended Certifications">
            <Grid>
              {profile.recommendedCertifications?.map((c, i) => (
                <Card key={i}>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-gray-700 mt-1">{c.provider}</p>
                  <a href={c.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    View Certification
                  </a>
                  <p className="text-gray-700 mt-1">Priority: {c.priority}</p>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- PROJECTS ---- */}
          <Section title="🛠 Suggested Projects">
            <Grid>
              {profile.suggestedProjects?.map((p, i) => (
                <Card key={i}>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-gray-700">{p.description}</p>
                  <p className="mt-2">Tech: {p.technologies.join(", ")}</p>
                  <p className="mt-1 font-semibold">Outcome: {p.outcome}</p>
                </Card>
              ))}
            </Grid>
          </Section>

          {/* ---- LEARNING ROADMAP ---- */}
          <Section title="📅 Learning Roadmap (6 Months)">
            <div className="space-y-6">
              {profile.learningRoadmap?.map((phase, i) => (
                <div key={i} className="p-5 bg-gray-50 border rounded-lg shadow">
                  <h3 className="text-lg font-bold">{phase.phase}</h3>
                  <p className="text-blue-600">{phase.duration}</p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    {phase.goals.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

        </div>
      ) : (
        <div className="p-10 text-center text-gray-500">
          No career data available. Please upload your marksheets and resume.
        </div>
      )}

      {/* JOBS MODAL */}
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

/* ================= COMPONENT HELPERS ================= */
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
);

const Card = ({ children }) => (
  <div className="bg-white border shadow p-5 rounded-lg">{children}</div>
);

export default CareerGuidance;
