export const matchJobsWithSkills = (jobs, studentSkills) => {
  const lowerSkills = studentSkills.map((s) => s.toLowerCase().trim());

  return jobs
    .map((job) => {
      const jobSkills = job.requiredSkills.map((s) =>
        s.toLowerCase().trim()
      );

      const matching = jobSkills.filter((skill) =>
        lowerSkills.includes(skill)
      );

      const matchScore = jobSkills.length
        ? (matching.length / jobSkills.length) * 100
        : 0;

      return {
        job,
        matchingSkills: matching,
        missingSkills: jobSkills.filter((s) => !lowerSkills.includes(s)),
        matchScore: Number(matchScore.toFixed(2)),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore); // highest first
};