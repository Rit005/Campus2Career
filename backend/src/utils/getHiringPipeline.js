import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const getHiringPipeline = async () => {
  const applicants = await Application.countDocuments({ status: "applied" });
  const shortlisted = await Application.countDocuments({ status: "shortlisted" });
  const interviews = await Application.countDocuments({ status: "interview" });

  const jobsPosted = await Job.countDocuments();

  const applicationsPerJob = applicants / (jobsPosted || 1);

  return {
    applicants,
    shortlisted,
    interviews,
    jobsPosted,
    applicationsPerJob,
  };
};