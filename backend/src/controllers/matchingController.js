import Resume from "../models/Resume.js";

export const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills = [], jobDescription = "" } = req.body;

    if (!requiredSkills.length) {
      return res.status(400).json({
        success: false,
        message: "Required skills are required",
      });
    }

    const normalizedSkills = requiredSkills.map((s) =>
      String(s).toLowerCase().trim()
    );

    const descKeywords = jobDescription
      .toLowerCase()
      .split(/[\s,.-]+/)
      .filter((w) => w.length > 3);

    const resumes = await Resume.find().populate("studentId", "name email phone");

    const rankedCandidates = [];

    for (const resume of resumes) {
      if (!resume || !resume.studentId) continue;

      let skillArr = [];

      if (Array.isArray(resume.skills)) {
        skillArr = resume.skills;
      } else if (typeof resume.skills === "string") {
        skillArr = resume.skills.split(",").map((s) => s.trim());
      }

      const candidateSkills = skillArr.map((s) => String(s).toLowerCase());


      const matchedSkills = normalizedSkills.filter((reqSkill) =>
        candidateSkills.includes(reqSkill)
      );

      const skillScore =
        normalizedSkills.length > 0
          ? Math.round((matchedSkills.length / normalizedSkills.length) * 100)
          : 0;


      const expText = String(resume.experience_summary || "").toLowerCase();
      const matchedExpWords = descKeywords.filter((w) => expText.includes(w));

      const experienceScore =
        descKeywords.length > 0
          ? Math.min(
              30,
              Math.round((matchedExpWords.length / descKeywords.length) * 30)
            )
          : 0;

      const finalScore = Math.min(skillScore + experienceScore, 100);

      rankedCandidates.push({
        studentId: resume.studentId._id,
        name: resume.studentId.name,
        email: resume.studentId.email,
        phone: resume.studentId.phone,
        skills: skillArr,
        matchedSkills,
        matchScore: finalScore,
        summary: resume.experience_summary || "",
        education: resume.education || "",
        roles: resume.suitable_roles || [],
      });
    }

    rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      candidates: rankedCandidates,
    });

  } catch (err) {
    console.error(" Smart Matching Error:", err);
    return res.status(500).json({
      success: false,
      message: "Candidate matching failed",
      error: err.message,
    });
  }
};
