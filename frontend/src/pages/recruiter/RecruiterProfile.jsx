import React, { useState, useEffect } from "react";
import recruiterAPI  from "../../api/recruiter";

const RecruiterProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    designation: "",
    department: "",
    companyWebsite: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await recruiterAPI.getProfile();
      if (res.data.success && res.data.data) {
        const p = res.data.data;
        setFormData({
          fullName: p.fullName || "",
          email: p.email || "",
          organization: p.organization || "",
          designation: p.designation || "",
          department: p.department || "",
          companyWebsite: p.companyWebsite || "",
        });
      }
    } catch (err) {
      console.error("Load recruiter profile error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setSuccess(false);

      const res = await recruiterAPI.saveProfile(formData);

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Save recruiter profile error:", err);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">👤 Recruiter Profile</h1>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-300">
          Profile saved successfully!
        </div>
      )}

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>

        <div className="grid gap-4">
          <input
            className="input"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="Organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="Company Website"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            className={`bg-primary-600 text-white px-5 py-2 rounded-md w-fit ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;