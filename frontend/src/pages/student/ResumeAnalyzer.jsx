import { useState ,useEffect} from "react";
import { studentAPI } from "../../api/student";
import { Upload, FileText, Loader2 } from "lucide-react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  useEffect(() => {
  const loadResume = async () => {
    try {
      const res = await studentAPI.getResume();
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        
        setSkills(data.skills || []);
        setSummary(data.experience_summary || "");
        setEducation(data.education || "");
        setRoles(data.suitable_roles || []);
      }
    } catch (err) {
      console.error("Failed to load resume", err);
    }
  };

  loadResume();
}, []);


  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!file) return alert("Please upload a resume file");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    try {
      const res = await studentAPI.analyzeResume(formData);
      const data = res.data.data;

      setSkills(data.skills || []);
      setSummary(data.experience_summary || "");
      setEducation(data.education || "");
      setRoles(data.suitable_roles || []);
    } catch (err) {
      console.error(err);
      alert("Resume analysis failed");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📄 Resume Analyzer</h1>

      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all 
          ${dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-primary-600" />
        <h2 className="text-xl font-semibold mt-3">Drag & Drop Resume Here</h2>
        <p className="text-gray-500">PDF, DOCX, or TXT</p>

        <label className="mt-5 inline-block cursor-pointer text-white bg-primary-600 px-6 py-2 rounded-md">
          Browse Files
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {file && (
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-700">
            <FileText className="h-5 w-5 text-primary-600" />
            <span>{file.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={analyzeResume}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        Analyze Resume
      </button>

      {/* SKILLS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Extracted Skills</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500">AI detected skills will appear here.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-primary-100 px-4 py-2 rounded-md text-primary-700 text-sm text-center"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
        <p className="text-gray-700 whitespace-pre-line">{summary || "Summary will appear here."}</p>
      </div>

      {/* EDUCATION */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        <p className="text-gray-700">{education || "Education details will appear here."}</p>
      </div>

      {/* ROLES */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Suggested Roles</h2>
        {roles.length > 0 ? (
          <ul className="list-disc ml-6 text-gray-700">
            {roles.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">AI-recommended roles will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
