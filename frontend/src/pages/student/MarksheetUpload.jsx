import { useState, useEffect, useRef } from "react";
import { studentAPI } from "../../api/student";

const MarksheetUpload = () => {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [marksheets, setMarksheets] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    loadMarksheets();
  }, []);

  const loadMarksheets = async () => {
    try {
      const res = await studentAPI.getAllMarksheets();
      if (res.data.success) setMarksheets(res.data.data);
    } catch (err) {
      console.error("Failed to load marksheets");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const valid =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.endsWith(".docx") ||
      selectedFile.type === "text/plain";

    if (!valid) {
      setMessage({
        type: "error",
        text: "Only PDF, DOCX, or TXT files allowed",
      });
      return;
    }

    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !semester) {
      setMessage({ type: "error", text: "Please select semester and file" });
      return;
    }

    const formData = new FormData();
    formData.append("marksheet", file);
    formData.append("semester", semester);

    setLoading(true);

    try {
      const res = await studentAPI.uploadMarksheet(formData);
      if (res.data.success) {
        setMessage({
          type: "success",
          text: "Marksheet uploaded successfully!",
        });

        setFile(null);
        setSemester("");
        if (fileRef.current) fileRef.current.value = "";

        loadMarksheets();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upload failed",
      });
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this marksheet?")) return;
    try {
      await studentAPI.deleteMarksheet(id);
      loadMarksheets();
    } catch (err) {
      console.error("Failed to delete marksheet");
    }
  };

  const semesterOptions = [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4",
    "Semester 5", "Semester 6", "Semester 7", "Semester 8",
    "Year 1", "Year 2", "Year 3", "Year 4",
    "12th", "10th"
  ];

  /* ================================================================
     UTIL: DISPLAY SCORE (CGPA or Percentage)
  ================================================================= */
  const displayScore = (m) => {
    if (m.cgpa && m.cgpa !== "") return `CGPA: ${m.cgpa}`;
    if (m.percentage && m.percentage !== "") return `${m.percentage}%`;
    return "Score not available";
  };

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h2 className="text-3xl font-bold mb-6">Upload Marksheet</h2>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Form */}
      <form className="bg-white shadow p-6 rounded-xl mb-8" onSubmit={handleUpload}>
        <label className="block mb-2 font-medium">Semester *</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="">Select semester</option>
          {semesterOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Upload File *</label>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="w-full border p-3 rounded mb-4"
          onChange={handleFileChange}
        />

        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {/* Uploaded Marksheets */}
      <h3 className="text-xl font-semibold mb-3">Uploaded Marksheets</h3>

      {marksheets.length === 0 ? (
        <p className="text-gray-500">No marksheets uploaded.</p>
      ) : (
        <div className="space-y-4">
          {marksheets.map((m) => (
            <div
              key={m._id}
              className="bg-white shadow p-4 rounded flex justify-between"
            >
              <div>
                <p className="font-semibold">{m.semester}</p>

                <p className="text-sm text-gray-500">
                  {m.subjects.length} subjects | {displayScore(m)}
                </p>

                <a
                  href={`http://localhost:5001/${m.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  View File
                </a>

                <p className="text-xs text-gray-400 mt-1">
                  Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(m._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarksheetUpload;
