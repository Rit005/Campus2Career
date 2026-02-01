import { useState, useRef } from 'react';
import { studentAPI } from '../../api/student';
import { useEffect } from 'react';

const MarksheetUpload = () => {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [marksheets, setMarksheets] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMarksheets();
  }, []);

  const loadMarksheets = async () => {
    try {
      const res = await studentAPI.getAllMarksheets();
      if (res.data.success) setMarksheets(res.data.data);
    } catch (err) {
      console.error('Failed to load marksheets');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && 
          !selected.name.endsWith('.docx') && 
          selected.type !== 'text/plain') {
        setMessage({ type: 'error', text: 'Only PDF, DOCX, or TXT files allowed' });
        return;
      }
      setFile(selected);
      setMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !semester) {
      setMessage({ type: 'error', text: 'Please select file and semester' });
      return;
    }

    const formData = new FormData();
    formData.append('marksheet', file);
    formData.append('semester', semester);

    setLoading(true);
    setMessage(null);

    try {
      const res = await studentAPI.uploadMarksheet(formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Marksheet uploaded successfully!' });
        setFile(null);
        setSemester('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        loadMarksheets();
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this marksheet?')) return;
    try {
      const res = await studentAPI.deleteMarksheet(id);
      if (res.data.success) loadMarksheets();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 
                     'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8',
                     'Fall 2023', 'Spring 2024', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Marksheet</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus ring-2 focus ring-blue-500"
          >
            <option value="">Select semester</option>
            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Marksheet File (PDF/DOCX/TXT)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600 mb-4">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Marksheet'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Uploaded Marksheets</h3>
      {marksheets.length === 0 ? (
        <p className="text-gray-500">No marksheets uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {marksheets.map(ms => (
            <div key={ms._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{ms.semester}</p>
                <p className="text-sm text-gray-500">{ms.institution || 'Unknown Institution'}</p>
                <p className="text-sm text-gray-500">
                  {ms.subjects?.length || 0} subjects | {ms.overallPercentage}% | {ms.fileName}
                </p>
                <p className="text-xs text-gray-400">{new Date(ms.uploadedAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(ms._id)}
                className="text-red-600 hover:text-red-800 text-sm"
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

