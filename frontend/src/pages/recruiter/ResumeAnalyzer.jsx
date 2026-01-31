import { Upload } from "lucide-react";

const ResumeAnalyzer = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">📄 Resume Analyzer</h1>

      {/* UPLOAD SECTION */}
      <div className="bg-white shadow rounded-xl p-6 text-center">
        <Upload className="mx-auto h-10 w-10 text-primary-600" />
        <h2 className="text-xl font-semibold mt-3">Upload a Resume</h2>
        <p className="text-gray-500 mb-4">PDF or DOCX formats supported</p>

        <label className="cursor-pointer bg-primary-600 text-white px-6 py-2 rounded-md">
          Upload File
          <input type="file" className="hidden" />
        </label>
      </div>

      {/* SKILL EXTRACTION */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Extracted Skills</h2>
        <p className="text-gray-500">AI detected skills will appear here.</p>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Java", "React", "Leadership", "SQL"].map((skill, idx) => (
            <span key={idx} className="bg-primary-100 px-4 py-2 rounded-md text-primary-700 text-sm text-center">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
        <p className="text-gray-500">AI-generated summary will appear here.</p>
        <div className="mt-4 h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
          Summary Placeholder
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
