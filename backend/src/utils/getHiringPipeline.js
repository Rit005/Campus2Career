import Resume from "../models/Resume.js";
import Job from "../models/Job.js";

export const getHiringPipeline = async () => {
  const applicants = await Resume.countDocuments();
  const shortlisted = await Resume.countDocuments({ isShortlisted: true });
  const interviews = await Resume.countDocuments({ interviewScheduled: true });

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
