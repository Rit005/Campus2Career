import { useState, useEffect } from "react";
import { studentAPI } from "../../api/student";
import { Upload, FileText, Loader2, Brain, Briefcase } from "lucide-react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");
  const [roles, setRoles] = useState([]);

  const [projects, setProjects] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);

  const [predictedDomain, setPredictedDomain] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [resumeStrength, setResumeStrength] = useState(0);

  const [jobRecommendations, setJobRecommendations] = useState([]);

  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const res = await studentAPI.getResume();
        if (res.data.success && res.data.data) {
          const d = res.data.data;

          setSkills(d.skills || []);
          setSummary(d.experience_summary || "");
          setEducation(d.education || "");
          setRoles(d.suitable_roles || []);
          setProjects(d.projects || []);
          setMissingSkills(d.missing_skills || []);
          setRecommendedProjects(d.project_recommendations || []);

          setPredictedDomain(d.predictedDomain || "");
          setConfidence(d.domainConfidence || 0);
          setResumeStrength(d.resumeStrengthScore || 0);

          setJobRecommendations(d.recommendedJobs || []);
        }
      } catch (err) {
        console.error("Failed to load resume", err);
      }
    };

    loadResume();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!file) return alert("Please upload a resume.");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await studentAPI.analyzeResume(formData);
      const d = res.data.data;
      const ml = res.data.mlInsights;

      setSkills(d.skills || []);
      setSummary(d.experience_summary || "");
      setEducation(d.education || "");
      setRoles(d.suitable_roles || []);
      setProjects(d.projects || []);
      setMissingSkills(d.missing_skills || []);
      setRecommendedProjects(d.project_recommendations || []);

      setPredictedDomain(ml?.predictedDomain || "");
      setConfidence(ml?.confidence || 0);
      setResumeStrength(ml?.resumeStrengthScore || 0);

      setJobRecommendations(res.data.jobRecommendations || []);

    } catch (err) {
      console.error(err);
      alert("Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        📄 Resume Analyzer
      </h1>

      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all
        ${dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="text-xl font-semibold mt-3">
          Drag & Drop Resume Here
        </h2>
        <p className="text-gray-500">PDF, DOCX, or TXT</p>

        <label className="mt-5 inline-block cursor-pointer text-white bg-blue-600 px-6 py-2 rounded-md">
          Browse Files
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="mt-4 flex justify-center items-center gap-2 text-gray-700">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>{file.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={analyzeResume}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        Analyze Resume
      </button>

      {/* AI insights */}
      {(predictedDomain || resumeStrength > 0) && (
        <Section title="🧠 AI Resume Intelligence">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Predicted Career Domain
              </h3>
              <p className="text-purple-700 font-bold text-xl mt-2">
                {predictedDomain}
              </p>
              <p className="text-gray-600 text-sm">
                Confidence: {confidence}%
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Resume Strength Score
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${resumeStrength}%` }}
                ></div>
              </div>
              <p className="text-gray-600 mt-1">
                {resumeStrength}/100
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* Extracted skills */}
      <Section title="Extracted Skills">
        {skills.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="bg-blue-100 px-4 py-2 rounded-md text-blue-700 text-sm text-center"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <Empty text="Skills will appear here." />
        )}
      </Section>

      {/* Extracted Projects */}
      <Section title="Extracted Projects">
        {projects.length ? (
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <div key={idx} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-gray-700 mt-1">{p.summary}</p>
                {p.technologies?.length > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    Tech Used: {p.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty text="No projects extracted." />
        )}
      </Section>

      {/* Missing Skills */}
      <Section title="Missing Skills (Recommended)">
        {missingSkills.length ? (
          <ul className="list-disc ml-6 text-gray-700">
            {missingSkills.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        ) : (
          <Empty text="AI did not detect missing skills." />
        )}
      </Section>

      {/* AI Recommended Projects */}
      <Section title="AI Recommended Projects">
        {recommendedProjects.length ? (
          <ul className="list-disc ml-6 text-gray-700">
            {recommendedProjects.map((p, idx) => <li key={idx}>{p}</li>)}
          </ul>
        ) : (
          <Empty text="AI recommendations will appear here." />
        )}
      </Section>

      {/* AI Summary */}
      <Section title="AI Summary">
        <p className="text-gray-700 whitespace-pre-line">
          {summary || "Summary will appear here."}
        </p>
      </Section>

      {/* Education */}
      <Section title="Education">
        <p className="text-gray-700">
          {education || "Education details will appear here."}
        </p>
      </Section>

      {/* Suggested Roles */}
      <Section title="Suggested Roles">
        {roles.length ? (
          <ul className="list-disc ml-6 text-gray-700">
            {roles.map((role, i) => <li key={i}>{role}</li>)}
          </ul>
        ) : (
          <Empty text="AI-suggested roles will appear here." />
        )}
      </Section>

      {/* Recommended Jobs */}
      <Section title="Recommended Jobs Based on Your Skills">
        {jobRecommendations.length ? (
          <div className="space-y-4">
            {jobRecommendations.map((job, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="text-blue-600 h-6 w-6" />
                  <h3 className="text-lg font-semibold">
                    {job.title}
                  </h3>
                </div>

                <p className="text-gray-700 mt-1 font-medium">
                  Company: {job.company}
                </p>

                <p className="text-green-700 font-bold mt-2">
                  Match Score: {job.matchScore}%
                </p>

                {job.matchingSkills.length > 0 && (
                  <p className="text-blue-700 text-sm mt-2">
                    Matching Skills: {job.matchingSkills.join(", ")}
                  </p>
                )}

                {job.missingSkills.length > 0 && (
                  <p className="text-red-700 text-sm mt-1">
                    Missing Skills: {job.missingSkills.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty text="AI will recommend jobs based on your resume." />
        )}
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-500 italic">{text}</p>
);

export default ResumeAnalyzer;