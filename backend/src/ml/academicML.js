// src/ml/academicML.js

/*============================================================
  SUBJECT → DOMAIN MAP
============================================================*/
const DOMAIN_MAP = {
  Programming: ["PROGRAMMING", "JAVA", "PYTHON", "C++", "DSA"],
  Mathematics: ["MATH", "STATISTICS", "CALCULUS"],
  CoreCS: ["OS", "DBMS", "NETWORK", "COMPUTER"],
  AI: ["AI", "ML", "DATA", "INTELLIGENCE"],
};

/*============================================================
  PREDICT STRONGEST DOMAIN
============================================================*/
export function predictAcademicDomain(subjectWisePerformance) {
  const domainScores = {};

  subjectWisePerformance.forEach((sub) => {
    const name = sub.name.toUpperCase();

    for (let domain in DOMAIN_MAP) {
      const keywords = DOMAIN_MAP[domain];

      if (keywords.some((k) => name.includes(k))) {
        if (!domainScores[domain]) domainScores[domain] = 0;
        domainScores[domain] += Number(sub.average);
      }
    }
  });

  const sorted = Object.entries(domainScores).sort(
    (a, b) => b[1] - a[1]
  );

  return sorted.length
    ? { domain: sorted[0][0], score: sorted[0][1].toFixed(2) }
    : { domain: "General", score: 0 };
}

/*============================================================
  DETECT WEAK SUBJECTS
============================================================*/
export function detectWeakSubjects(subjectWisePerformance) {
  return subjectWisePerformance
    .filter((s) => Number(s.average) < 60)
    .map((s) => s.name);
}

/*============================================================
  SEMESTER IMPROVEMENT TREND
============================================================*/
export function analyzeTrend(semesterTrend) {
  if (semesterTrend.length < 2) return "Insufficient Data";

  const first = Number(semesterTrend[0].percentage);
  const last = Number(
    semesterTrend[semesterTrend.length - 1].percentage
  );

  if (last > first + 5) return "Improving";
  if (last < first - 5) return "Declining";
  return "Stable";
}

/*============================================================
  ACADEMIC RISK SCORE
============================================================*/
export function calculateRiskScore(overallPerformance, weakSubjects) {
  let risk = 0;

  if (overallPerformance < 60) risk += 40;
  if (weakSubjects.length > 2) risk += 30;
  if (overallPerformance < 50) risk += 30;

  return Math.min(risk, 100);
}

/*============================================================
  CAREER READINESS SCORE
============================================================*/
export function calculateCareerReadiness(
  overallPerformance,
  semesterTrend
) {
  let score = Number(overallPerformance);

  if (semesterTrend === "Improving") score += 10;
  if (semesterTrend === "Declining") score -= 10;

  return Math.max(0, Math.min(score, 100));
}
/*============================================================
  PREDICT NEXT SEMESTER PERFORMANCE
============================================================*/
export function predictNextSemester(semesterTrend) {
  if (semesterTrend.length < 2) {
    return semesterTrend[0]?.percentage || 0;
  }

  const last = semesterTrend[semesterTrend.length - 1].percentage;
  const prev = semesterTrend[semesterTrend.length - 2].percentage;

  const growth = last - prev;

  return Math.max(0, Math.min(100, last + growth)).toFixed(2);
}

/*============================================================
  IMPROVEMENT ROADMAP
============================================================*/
export function generateImprovementRoadmap(weakSubjects) {
  return weakSubjects.map((subject) => ({
    subject,
    recommendation:
      "Revise fundamentals, solve 50+ practice problems, weekly mock test, and peer discussion sessions.",
  }));
}

/*============================================================
  PLACEMENT PROBABILITY
============================================================*/
export function predictPlacementProbability(
  overallPerformance,
  careerReadinessScore
) {
  let probability = 0;

  probability += overallPerformance * 0.6;
  probability += careerReadinessScore * 0.4;

  return Math.min(100, probability).toFixed(2);
}
