import { useEffect, useState } from "react";
import recruiterAPI from "../../api/recruiter";
import { studentAPI } from "../../api/student";

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

  const [allJobs, setAllJobs] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const cleanValue = (val) => {
    if (Array.isArray(val)) return val.map(cleanValue);
    if (typeof val === "object" && val !== null) return JSON.stringify(val);
    return val;
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await recruiterAPI.dashboard({});
      const data = res.data;

      setPipeline(data.pipeline || {});
      setInsights({
        funnel_metrics: cleanValue(data.insights?.funnel_metrics || []),
        bottlenecks: cleanValue(data.insights?.bottlenecks || []),
        recommendations: cleanValue(data.insights?.recommendations || []),
        prediction: cleanValue(data.insights?.future_prediction || ""),
      });
    } catch (err) {
      console.error("Dashboard error:", err);
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
      console.error("Jobs Load Error:", err);
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
      console.error("Students Load Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      {/* ---- BLUR EVERYTHING WHEN MODAL IS OPEN ---- */}
      <div
        className={`space-y-10 transition-all duration-300 ${
          jobsModalOpen || studentsModalOpen ? "blur-md pointer-events-none" : ""
        }`}
      >
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          📊 Hiring Dashboard
        </h1>

        {/* ACTION BUTTONS */}
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

        {/* PIPELINE CARDS */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card title="🧑‍💼 Applicants" value={pipeline.applicants} color="blue" />
          <Card title="📌 Shortlisted" value={pipeline.shortlisted} color="green" />
          <Card title="🎤 Interviews" value={pipeline.interviews} color="orange" />
          <Card title="📢 Jobs Posted" value={pipeline.jobsPosted} color="red" />
        </div>

        {/* SECTIONS */}
        <FancySection title="Hiring Funnel" list={insights.funnel_metrics} />
        <FancySection title="Process Bottlenecks" list={insights.bottlenecks} />
        <FancySection title="AI Recommendations" list={insights.recommendations} />

        {/* PREDICTION */}
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📈 Future Hiring Prediction
          </h2>

          {(() => {
            try {
              const obj =
                typeof insights.prediction === "string"
                  ? JSON.parse(insights.prediction)
                  : insights.prediction;

              return (
                <div className="text-gray-700 leading-relaxed space-y-1">
                  <p>score : {obj.score}</p>
                  <p>prediction : {obj.prediction}</p>
                </div>
              );
            } catch {
              return <p className="text-gray-700">{insights.prediction}</p>;
            }
          })()}
        </div>
      </div>

      {/* ---- MODALS (overlay on top, no blur needed here) ---- */}
      {jobsModalOpen && (
        <JobsModal jobs={allJobs} close={() => setJobsModalOpen(false)} />
      )}

      {studentsModalOpen && (
        <StudentsModal students={allStudents} close={() => setStudentsModalOpen(false)} />
      )}
    </>
  );
};

/* -----------------------------------------
   METRIC CARD
--------------------------------------------- */
const Card = ({ title, value, color }) => (
  <div className="bg-white shadow-md border rounded-xl p-6 text-center hover:shadow-xl transition">
    <h3 className="text-gray-600 text-l">{title}</h3>
    <p className={`text-4xl font-bold mt-2 text-${color}-600`}>{value ?? 0}</p>
  </div>
);

/* -----------------------------------------
  SECTION WITH ICON + FORMATTED TEXT
--------------------------------------------- */
const FancySection = ({ title, list }) => {
  const getImage = () => {
    if (title.toLowerCase().includes("funnel"))
      return "https://cdn-icons-png.flaticon.com/512/924/924915.png";
    if (title.toLowerCase().includes("bottleneck"))
      return "https://cdn-icons-png.flaticon.com/512/992/992651.png";
    if (title.toLowerCase().includes("recommend"))
      return "https://cdn-icons-png.flaticon.com/512/1827/1827504.png";
    return "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
  };

  const formatted = list.map((item) => {
    try {
      if (typeof item === "string") item = JSON.parse(item);
      return `stage : ${item.stage} , value : ${item.value}`;
    } catch {
      return item;
    }
  });

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
      <div className="flex items-center gap-3 mb-4">
        <img src={getImage()} className="w-8 h-8" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {formatted.length === 0 ? (
        <p className="text-gray-500 italic">AI is analyzing…</p>
      ) : (
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          {formatted.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* -----------------------------------------
  JOBS MODAL – FULL PAGE OVERLAY
--------------------------------------------- */
const JobsModal = ({ jobs, close }) => {
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const s = search.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(s) ||
      job.company.toLowerCase().includes(s) ||
      job.jobLocation.toLowerCase().includes(s)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex flex-col z-[99999]">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-lg border-b">
        <h2 className="text-2xl font-bold">📄 All Posted Jobs</h2>
        <button
          onClick={close}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow"
        >
          Close
        </button>
      </div>

      <div className="p-6 bg-gray-50 border-b">
        <input
          type="text"
          placeholder="🔍 Search jobs..."
          className="w-full px-4 py-3 border rounded-xl shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Job Title</th>
                <th className="p-3 border">Company</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Skills</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border font-medium">{job.jobTitle}</td>
                  <td className="p-3 border">{job.company}</td>
                  <td className="p-3 border">{job.jobLocation}</td>
                  <td className="p-3 border">{job.requiredSkills.join(", ")}</td>
                  <td className="p-3 border text-center">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------
  STUDENTS MODAL – CENTERED BIG WINDOW
--------------------------------------------- */
const StudentsModal = ({ students, close }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex justify-center items-center p-6 z-[99999]">
    <div className="bg-white rounded-xl p-6 w-full max-w-5xl shadow-2xl border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">👨‍🎓 All Students</h2>
        <button
          onClick={close}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
        >
          Close
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full border rounded-xl shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Skills</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr
                key={s._id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
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
