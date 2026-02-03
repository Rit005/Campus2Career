export const jobRelevanceScore = ({ studentSkills, jobSkills }) => {
  const matched = jobSkills.filter(s => studentSkills.includes(s));
  const skillMatch = matched.length / jobSkills.length;

  // weight factors
  const score =
    0.7 * skillMatch + 
    0.3 * (studentSkills.length / 20); // richness of resume

  return Number(score.toFixed(2));
};
