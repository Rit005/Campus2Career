import { useState } from "react";

const ApplyJobModal = ({ job, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);

  const handleSubmit = () => {
    if (!name || !email || !phone || !expectedSalary) {
      return alert("Please fill all required fields!");
    }
    if (!resume) return alert("Please upload your resume!");

    onSubmit({
      jobId: job._id,
      jobRole: job.jobTitle,
      name,
      email,
      phone,
      expectedSalary,
      message,
      resume,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200000]">
      <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl border">

        <h2 className="text-2xl font-bold mb-4">Apply for {job.jobTitle}</h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Expected Salary (₹) *</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Message (optional)</label>
            <textarea
              rows="3"
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Write a message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Upload Resume *</label>
            <input
              type="file"
              className="w-full border rounded-lg p-2 mt-1"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Submit Application
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplyJobModal;
