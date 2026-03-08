export const matchJobsWithSkills = (jobs, resumeSkills) => {
  const normalizedResumeSkills = resumeSkills.map((s) =>
    s.toLowerCase().trim()
  );

  const results = [];

  for (const job of jobs) {
    const jobSkills = (job.requiredSkills || []).map((s) =>
      s.toLowerCase().trim()
    );

    const matchingSkills = jobSkills.filter((skill) =>
      normalizedResumeSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(
      (skill) => !normalizedResumeSkills.includes(skill)
    );

    const matchScore =
      jobSkills.length === 0
        ? 0
        : Math.round((matchingSkills.length / jobSkills.length) * 100);

    results.push({
      job,
      matchScore,
      matchingSkills,
      missingSkills,
    });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
};