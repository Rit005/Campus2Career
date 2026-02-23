export const jobRelevanceScore = ({ studentSkills, jobSkills }) => {
  const matched = jobSkills.filter(s => studentSkills.includes(s));
  const skillMatch = matched.length / jobSkills.length;

  const score =
    0.7 * skillMatch + 
    0.3 * (studentSkills.length / 20); 

  return Number(score.toFixed(2));
};
