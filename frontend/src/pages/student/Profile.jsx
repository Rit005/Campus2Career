import React, { useState } from 'react';

/**
 * My Academic Profile Page
 * Form for inputting academic details, attendance, and skills
 */
const Profile = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    // Academic details
    currentSemester: '',
    cgpa: '',
    totalCredits: '',
    // Skills
    skills: [],
    currentSkillInput: '',
    // Interests
    interests: [],
    currentInterestInput: '',
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pre-defined options
  const semesterOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const availableSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git',
    'HTML/CSS', 'TypeScript', 'Docker', 'AWS', 'Machine Learning', 'Data Analysis',
    'Communication', 'Teamwork', 'Problem Solving', 'Project Management',
  ];
  const availableInterests = [
    'Web Development', 'Mobile Development', 'Data Science', 'AI/ML',
    'Cloud Computing', 'Cybersecurity', 'DevOps', 'Blockchain',
    'Product Management', 'UI/UX Design', 'Embedded Systems', 'Robotics',
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Add skill
  const handleAddSkill = () => {
    const skill = formData.currentSkillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        currentSkillInput: '',
      }));
    }
  };

  // Add skill on Enter key
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Add interest
  const handleAddInterest = (interest) => {
    if (!formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  // Remove interest
  const handleRemoveInterest = (interestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((interest) => interest !== interestToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.currentSemester) newErrors.currentSemester = 'Please select a semester';
    if (!formData.cgpa) newErrors.cgpa = 'CGPA is required';
    if (formData.cgpa && (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10)) {
      newErrors.cgpa = 'CGPA must be between 0 and 10';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        console.log('Profile data:', formData);
      }, 1500);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Academic Profile</h1>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Profile saved successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@university.edu"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Academic Details
            </h2>

            <div className="space-y-4">
              {/* Current Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="currentSemester"
                  value={formData.currentSemester}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.currentSemester ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select semester</option>
                  {semesterOptions.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem} Semester
                    </option>
                  ))}
                </select>
                {errors.currentSemester && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentSemester}</p>
                )}
              </div>

              {/* CGPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current CGPA <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cgpa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 8.5"
                />
                {errors.cgpa && <p className="mt-1 text-sm text-red-500">{errors.cgpa}</p>}
              </div>

              {/* Total Credits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Credits Completed
                </label>
                <input
                  type="number"
                  name="totalCredits"
                  value={formData.totalCredits}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 90"
                />
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendance Percentage
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="attendance"
                    min="0"
                    max="100"
                    value={formData.attendance || 75}
                    onChange={(e) => setFormData((prev) => ({ ...prev, attendance: e.target.value }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {formData.attendance || 75}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Skills
          </h2>

          {/* Selected skills */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add skill input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={formData.currentSkillInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentSkillInput: e.target.value }))}
              onKeyDown={handleSkillKeyDown}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Suggested skills */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Suggested skills:</p>
            <div className="flex flex-wrap gap-2">
              {availableSkills
                .filter((skill) => !formData.skills.includes(skill))
                .slice(0, 10)
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, skill],
                      }))
                    }
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Areas of Interest
          </h2>

          {/* Selected interests */}
          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Interest options */}
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() =>
                  formData.interests.includes(interest)
                    ? handleRemoveInterest(interest)
                    : handleAddInterest(interest)
                }
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

