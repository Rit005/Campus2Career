import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import recruiterAPI from "../../api/recruiter";
import { Briefcase, MapPin, Building2, Users } from "lucide-react";

const ApplicantsHome = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      const res = await recruiterAPI.getMyJobs();
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800">Applicants</h2>
        <p className="text-gray-500 mt-2">
          Select a job to check the students who applied.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          You haven’t posted any jobs yet.
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  {job.jobTitle}
                </h3>

                <p className="text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {job.company}
                </p>

                <p className="text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.jobLocation}
                </p>
              </div>

              <button
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
              >
                <Users className="w-5 h-5" />
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsHome;