import { useState, useEffect, useRef } from "react";
import { studentAPI } from "../../api/student";

const MarksheetUpload = () => {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [marksheets, setMarksheets] = useState([]);
  const [mlInsights, setMlInsights] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    loadMarksheets();
  }, []);

  const loadMarksheets = async () => {
    try {
      const res = await studentAPI.getAllMarksheets();
      if (res.data.success) {
        setMarksheets(res.data.data);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to load marksheets",
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !semester) {
      setMessage({
        type: "error",
        text: "Please select semester and file",
      });
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

        // 🔥 Capture ML results
        setMlInsights(res.data.mlInsights);

        setFile(null);
        setSemester("");

        if (fileRef.current) fileRef.current.value = "";

        loadMarksheets();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Upload failed",
      });
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this marksheet?")) return;

    await studentAPI.deleteMarksheet(id);
    loadMarksheets();
  };

  const semesterOptions = [
    "Semester 1","Semester 2","Semester 3","Semester 4",
    "Semester 5","Semester 6","Semester 7","Semester 8"
  ];

  return (
    <div className="max-w-5xl mx-auto pt-6 space-y-8">
      <h2 className="text-3xl font-bold">Upload Marksheet</h2>

      {/* MESSAGE */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ================= UPLOAD FORM ================= */}
      <form
        className="bg-white shadow p-6 rounded-xl"
        onSubmit={handleUpload}
      >
        <label className="block mb-2 font-medium">Semester *</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="">Select semester</option>
          {semesterOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Upload File *</label>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: {file.name}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* ================= ML RESULTS SECTION ================= */}
      {mlInsights && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h3 className="text-xl font-bold">
            🤖 AI Academic Insights
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">Predicted Strong Domain</p>
              <h4 className="text-2xl font-bold text-green-600">
                {mlInsights.predictedStrongDomain?.domain}
              </h4>
            </div>

            <div>
              <p className="text-gray-500">Academic Trend</p>
              <h4 className="text-2xl font-bold text-blue-600">
                {mlInsights.academicTrend}
              </h4>
            </div>

            <div>
              <p className="text-gray-500">Next Semester Prediction</p>
              <h4 className="text-2xl font-bold text-indigo-600">
                {mlInsights.nextSemesterPrediction}%
              </h4>
            </div>

            <div>
              <p className="text-gray-500">Placement Probability</p>
              <h4 className="text-2xl font-bold text-purple-600">
                {mlInsights.placementProbability}%
              </h4>
            </div>
          </div>

          {/* Weak Subjects */}
          <div>
            <p className="font-semibold text-red-600">
              Weak Subjects
            </p>
            {mlInsights.weakSubjects?.length ? (
              <ul className="list-disc ml-6 text-red-600">
                {mlInsights.weakSubjects.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600">None 🎉</p>
            )}
          </div>

          {/* Improvement Roadmap */}
          <div>
            <p className="font-semibold text-blue-600">
              Improvement Roadmap
            </p>
            <ul className="list-disc ml-6 text-blue-700">
              {mlInsights.improvementRoadmap?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Risk Score */}
          <div>
            <p className="font-semibold text-red-600">
              Academic Risk Score
            </p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="h-3 rounded-full bg-red-500"
                style={{
                  width: `${mlInsights.academicRiskScore}%`,
                }}
              />
            </div>
            <p className="text-red-600 font-bold mt-1">
              {mlInsights.academicRiskScore}%
            </p>
          </div>
        </div>
      )}

      {/* ================= UPLOADED MARKSHEETS ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-3">
          Uploaded Marksheets
        </h3>

        {marksheets.length === 0 ? (
          <p className="text-gray-500">
            No marksheets uploaded yet.
          </p>
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
                    {m.subjects.length} subjects | {m.percentage}%
                  </p>

                  {/* IMPORTANT FIX */}
                  <a
                    href={`http://localhost:5001/api/student/marksheet/file/${m._id}`}
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
    </div>
  );
};

export default MarksheetUpload;
