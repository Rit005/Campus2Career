import Job from "../models/Job.js";
export const postJob = async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      salary,
      jobLocation,
      jobDescription,
      requiredSkills = [],
    } = req.body;


    if (!jobTitle || !company || !jobLocation || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      recruiterId: req.user._id,
      jobTitle,
      company,
      salary,
      jobLocation,
      jobDescription,
      requiredSkills,
    });

    return res.json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error(" Post Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(" Get Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job",
      });
    }

    await job.deleteOne();

    return res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    console.error(" Delete Job Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, message: "Job updated successfully", job: updatedJob });
  } catch (e) {
    console.error("UPDATE JOB ERROR:", e);
    return res.status(500).json({ success: false, message: "Failed to update job" });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error("Get All Jobs Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};