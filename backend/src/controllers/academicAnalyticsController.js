import Marksheet from "../models/Marksheet.js";

export const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;

    const marksheets = await Marksheet.find({ studentId }).sort({ semester: 1 });

    if (!marksheets.length) {
      return res.json({
        success: true,
        data: {
          subjectWise: [],
          radarChart: [],
          progressTrend: [],
          consistencyScore: 0,
        },
      });
    }

    const subjectPerf = {};

    marksheets.forEach((ms) => {
      ms.subjects.forEach((s) => {
        const marks = Number(s.marks);
        const max = Number(s.maxMarks);

        if (!marks || !max || isNaN(marks) || isNaN(max)) return;

        if (!subjectPerf[s.name]) {
          subjectPerf[s.name] = {
            totalMarks: 0,
            count: 0,
            grade: "",
            credits: s.credits || 3,
          };
        }

        const percent = (marks / max) * 100;

        subjectPerf[s.name].totalMarks += percent;
        subjectPerf[s.name].count++;

        if (s.grade && s.grade.trim() !== "") {
          subjectPerf[s.name].grade = s.grade.trim();
        }
      });
    });

    const computeGrade = (mark) => {
      if (mark >= 90) return "A+";
      if (mark >= 80) return "A";
      if (mark >= 70) return "B+";
      if (mark >= 60) return "B";
      if (mark >= 50) return "C";
      if (mark >= 40) return "D";
      return "F";
    };

    const subjectWise = Object.keys(subjectPerf).map((name) => {
      const avgMarks = subjectPerf[name].totalMarks / subjectPerf[name].count;

      return {
        subject: name,
        marks: Number(avgMarks.toFixed(2)),
        grade: subjectPerf[name].grade || computeGrade(avgMarks),
        credits: subjectPerf[name].credits,
      };
    });

const radarSubjects = subjectWise.map((s) => s.subject);

const radarDataset = radarSubjects.map((subject) => {
  const values = marksheets.map((ms) => {
    const sub = ms.subjects.find((s) => s.name === subject);
    if (!sub) return 0;
    return Number(((sub.marks / sub.maxMarks) * 100).toFixed(2));
  });

  const entry = { subject };
  marksheets.forEach((ms, index) => {
    entry[`sem${index + 1}`] = values[index] || 0;
  });

  return entry;
});

const radarChart = {
  data: radarDataset,
  semesters: marksheets.map((ms, index) => ({
    semester: ms.semester,
    dataKey: `sem${index + 1}`
  }))
};

    const progressTrend = marksheets.map((m, i) => {
      const prev = i === 0
        ? 0
        : Number(marksheets[i - 1].percentage || (marksheets[i - 1].cgpa * 9.5) || 0);

      const curr = Number(m.percentage || (m.cgpa * 9.5) || 0);

      return {
        semester: m.semester,
        previous: Number(prev.toFixed(2)),
        current: Number(curr.toFixed(2)),
      };
    });

    const allPercentages = marksheets
      .map((m) => Number(m.percentage || m.cgpa * 9.5))
      .filter((n) => !isNaN(n));

    const avg = allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length;

    const variance =
      allPercentages.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
      allPercentages.length;

    const stdDev = Math.sqrt(variance);

    const consistencyScore = Number(Math.max(0, 100 - stdDev * 2).toFixed(2));

    return res.json({
      success: true,
      data: {
        subjectWise,
        radarChart,
        progressTrend,
        consistencyScore,
      },
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSemesterWiseAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;

    const marksheets = await Marksheet.find({ studentId }).sort({ semester: 1 });

    return res.json({
      success: true,
      data: marksheets.map(m => ({
        semester: m.semester,
        cgpa: m.cgpa,
        percentage: m.percentage,
        subjects: m.subjects.map(s => ({
          name: s.name,
          marks: Number(s.marks) || 0,
          maxMarks: Number(s.maxMarks) || 100,
          grade: s.grade || "N/A"
        }))
      }))
    });

  } catch (err) {
    console.error("Semester Wise Error:", err);
    return res.status(500).json({ success: false, message: "Could not fetch semester data" });
  }
};
