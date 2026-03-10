import Job from "../models/Job.js";
import Student from "../models/Student.js";


//POST JOB 
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
    console.error("POST JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  }
};


// GET MY JOBS
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};


// DELETE JOB
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
    console.error("DELETE JOB ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};


// UPDATE JOB 
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

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
        message: "Unauthorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (e) {
    console.error("UPDATE JOB ERROR:", e);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};


//  GET ALL JOBS 
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      jobs,
    });

  } catch (err) {
    console.error("GET ALL JOBS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};


//  MATCH CANDIDATES 
export const matchCandidatesForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const students = await Student.find({}).populate('userId', 'name email');

    if (!students || students.length === 0) {
      return res.json({
        success: true,
        totalCandidates: 0,
        candidates: [],
      });
    }

    const jobSkills = (job.requiredSkills || []).map((skill) =>
      String(skill).toLowerCase().trim()
    );

    const candidates = students
      .map((student) => {
        const studentSkills = (student.skills || []).map((skill) =>
          String(skill).toLowerCase().trim()
        );

        const matchingSkills = jobSkills.filter((jobSkill) =>
          studentSkills.some((studentSkill) => {
            return (
              studentSkill === jobSkill ||
              studentSkill.includes(jobSkill) ||
              jobSkill.includes(studentSkill)
            );
          })
        );

        const matchScore =
          jobSkills.length === 0
            ? 0
            : Math.round((matchingSkills.length / jobSkills.length) * 100);

        return {
          studentId: student._id,
          name: student.userId?.name || student.email || "Unknown",
          email: student.email || student.userId?.email || "",
          matchScore,
          matchingSkills,
        };
      })
      .filter((candidate) => candidate.matchScore > 0);

    const sortedCandidates = candidates.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      totalCandidates: sortedCandidates.length,
      candidates: sortedCandidates,
    });

  } catch (error) {
    console.error("MATCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to match candidates",
    });
  }
};
