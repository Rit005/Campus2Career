export const predictHiringSuccess = (pipeline) => {
  const {
    applicants = 0,
    shortlisted = 0,
    interviews = 0,
    jobsPosted = 1,
  } = pipeline;

  const shortlistRate = applicants ? shortlisted / applicants : 0;
  const interviewRate = applicants ? interviews / applicants : 0;
  const applicationVolume = applicants / jobsPosted;

  const score =
    0.5 * shortlistRate +
    0.3 * interviewRate +
    0.2 * (applicationVolume / 100);

  let prediction = "";

  if (score > 0.7) prediction = "Hiring pipeline is performing very well.";
  else if (score > 0.4) prediction = "Moderate hiring performance. Improvements recommended.";
  else prediction = "Weak hiring pipeline. Optimization is needed.";

  return {
    score: Number(score.toFixed(2)),
    prediction,
  };
};
