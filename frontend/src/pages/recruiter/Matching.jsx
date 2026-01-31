const Matching = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">🤝 Candidate Matching</h1>

      {/* JOB POST FORM */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Post a Job</h2>

        <div className="grid gap-4">
          <input type="text" placeholder="Job Title" className="input" />
          <textarea placeholder="Job Description" rows="4" className="input"></textarea>
          <input type="text" placeholder="Required Skills (comma separated)" className="input" />

          <button className="bg-primary-600 text-white px-5 py-2 rounded-md hover:bg-primary-700 w-fit">
            Match Candidates
          </button>
        </div>
      </div>

      {/* RANKED CANDIDATES */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Ranked Candidate List</h2>

        <div className="space-y-4">
          {["Alice Johnson", "Ravi Kumar", "Sarah Lee"].map((c, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between">
              <p className="font-medium">{c}</p>
              <span className="text-primary-600 font-semibold">{90 - i * 5}% match</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matching;
