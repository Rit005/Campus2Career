import Student from "../models/Student.js";

const SKILL_ALIASES = {
  html5: "html",
  js: "javascript",
  node: "nodejs",
  nodejs: "nodejs",
  express: "expressjs",
  expressjs: "expressjs",
  spring: "springboot",
  springboot: "springboot",
  postgres: "postgresql",
  postgre: "postgresql",
  postgresql: "postgresql",
  vscode: "vscode",
  visualstudiocode: "vscode"
};

const normalizeSkill = (skill = "") => {
  let cleaned = String(skill)
    .toLowerCase()
    .trim()
    .replace(/[.\s_-]/g, "");

  return SKILL_ALIASES[cleaned] || cleaned;
};

//match candidates
export const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills = [], jobDescription = "" } = req.body;

    if (!requiredSkills.length) {
      return res.status(400).json({
        success: false,
        message: "Required skills are required"
      });
    }

    const normalizedSkills = [
      ...new Set(requiredSkills.map((s) => normalizeSkill(s)))
    ];

    const descKeywords = jobDescription
      .toLowerCase()
      .split(/[\s,.-]+/)
      .filter((w) => w.length > 3);

    // Fetch from Student model instead of Resume
    const students = await Student.find().populate(
      "userId",
      "name email"
    );

    // Handle case where no students exist
    if (!students || students.length === 0) {
      return res.json({
        success: true,
        totalCandidates: 0,
        candidates: []
      });
    }

    const rankedCandidates = [];

    for (const student of students) {
      if (!student?.userId) continue;

      let skillArr = [];

      if (Array.isArray(student.skills)) {
        skillArr = student.skills;
      } else if (typeof student.skills === "string") {
        skillArr = student.skills.split(",").map((s) => s.trim());
      }

      const candidateSkills = [
        ...new Set(skillArr.map((s) => normalizeSkill(s)))
      ];

      console.log("Required Skills:", normalizedSkills);
      console.log("Candidate Skills:", candidateSkills);

      const matchedSkills = normalizedSkills.filter((reqSkill) =>
        candidateSkills.some((skill) => skill.includes(reqSkill))
      );

      console.log("Matched Skills:", matchedSkills);

      const skillScore =
        normalizedSkills.length > 0
          ? Math.round((matchedSkills.length / normalizedSkills.length) * 70)
          : 0;

      const expText = String(student.experienceSummary || "").toLowerCase();

      const matchedExpWords = descKeywords.filter((w) =>
        expText.includes(w)
      );

      const experienceScore =
        descKeywords.length > 0
          ? Math.min(
              30,
              Math.round(
                (matchedExpWords.length / descKeywords.length) * 30
              )
            )
          : 0;

      const finalScore = Math.min(skillScore + experienceScore, 100);

      if (finalScore < 20) continue;

      rankedCandidates.push({
        studentId: student._id,
        name: student.userId.name,
        email: student.userId.email,
        phone: student.phone || "",

        skills: skillArr,
        matchedSkills,

        matchScore: finalScore,

        summary: student.experienceSummary || "",
        education: student.education || "",
        roles: student.suitableRoles || []
      });
    }

    rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      totalCandidates: rankedCandidates.length,
      candidates: rankedCandidates
    });

  } catch (err) {
    console.error("Smart Matching Error:", err);

    return res.status(500).json({
      success: false,
      message: "Candidate matching failed",
      error: err.message
    });
  }
};
