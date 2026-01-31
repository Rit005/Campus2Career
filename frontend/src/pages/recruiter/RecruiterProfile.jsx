const RecruiterProfile = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">👤 Recruiter Profile</h1>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Details</h2>

        <div className="grid gap-4">
          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Organization" />

          <button className="bg-primary-600 text-white px-5 py-2 rounded-md w-fit">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
