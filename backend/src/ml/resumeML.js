// src/ml/resumeML.js

export const DOMAIN_SKILLS = {
  "Software Engineering": ["java", "python", "c++", "dsa", "oop", "sql"],
  "Web Development": ["html", "css", "javascript", "react", "node", "mongodb"],
  "Data Science": ["python", "pandas", "numpy", "statistics", "machine learning"],
  "AI/ML": ["machine learning", "deep learning", "tensorflow", "pytorch"],
  "Cyber Security": ["networking", "linux", "security", "ethical hacking"],
  "DevOps": ["docker", "kubernetes", "aws", "ci/cd"],
};

export function predictDomain(skills = []) {
  const lowerSkills = skills.map((s) => s.toLowerCase());
  let scores = {};

  for (let domain in DOMAIN_SKILLS) {
    let matchCount = DOMAIN_SKILLS[domain].filter((skill) =>
      lowerSkills.includes(skill)
    ).length;

    scores[domain] = matchCount;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return {
    predictedDomain: sorted[0]?.[0] || "General",
    confidenceScore: (sorted[0]?.[1] || 0) * 15,
  };
}

export function calculateResumeStrength(parsed) {
  let score = 0;

  if (parsed.skills.length > 5) score += 30;
  if (parsed.projects.length > 2) score += 25;
  if (parsed.experience_summary) score += 20;
  if (parsed.education) score += 15;

  score += Math.min(parsed.skills.length * 2, 10);

  return Math.min(score, 100);
}

export function autoFillMissingSkills(parsed, predictedDomain) {
  const domainSkills = DOMAIN_SKILLS[predictedDomain] || [];
  const lowerSkills = parsed.skills.map((s) => s.toLowerCase());

  if (!parsed.missing_skills.length) {
    parsed.missing_skills = domainSkills.filter(
      (skill) => !lowerSkills.includes(skill)
    );
  }

  return parsed;
}
