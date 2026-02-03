import { groq } from '../groqClient.js';
import pdfParse from 'pdf-parse-fixed';
import mammoth from 'mammoth';
import Marksheet from '../models/Marksheet.js';
import AcademicSummary from '../models/AcademicSummary.js';
import Resume from '../models/Resume.js';

const extractTextFromFile = async (buffer, mimeType) => {
  if (mimeType === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimeType === 'text/plain') {
    return buffer.toString('utf8');
  }
  throw new Error('Unsupported file format');
};

const parseMarksheetWithAI = async (text) => {
  const prompt = `Extract marksheet data from the following text. Return ONLY valid JSON:
{
  "semester": "semester name/number",
  "subjects": [
    { "name": "subject name", "marks": 0, "maxMarks": 100, "grade": "grade or empty" }
  ],
  "attendance": null
}
Rules:
- Extract ALL subjects
- Handle various marking schemes
- If grade not mentioned, use empty string
- Return ONLY JSON, no markdown`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
    messages: [{ role: 'user', content: `${prompt}\n\n${text}` }],
  });

  const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI response');
  return JSON.parse(jsonMatch[0]);
};

export const uploadMarksheet = async (req, res) => {
  try {
    const studentId = req.user?._id;
    if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    const parsed = await parseMarksheetWithAI(text);

    const totalMarks = parsed.subjects.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
    const totalMax = parsed.subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 100), 0);
    const percentage = totalMax > 0 ? parseFloat(((totalMarks / totalMax) * 100).toFixed(2)) : 0;

    const marksheetData = {
      studentId,
      semester: parsed.semester || 'Unknown',
      subjects: parsed.subjects.map(s => ({
        name: s.name || 'Unknown',
        marks: Number(s.marks) || 0,
        maxMarks: Number(s.maxMarks) || 100,
        grade: s.grade || ''
      })),
      attendance: parsed.attendance || null,
      overallPercentage: percentage,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedAt: new Date()
    };

    const marksheet = await Marksheet.findOneAndUpdate(
      { studentId, semester: marksheetData.semester },
      marksheetData,
      { upsert: true, new: true }
    );

    await updateAcademicSummary(studentId);

    res.status(201).json({ success: true, message: 'Marksheet uploaded', data: marksheet });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

export const getAllMarksheets = async (req, res) => {
  try {
    const marksheets = await Marksheet.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: marksheets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch marksheets' });
  }
};

export const deleteMarksheet = async (req, res) => {
  try {
    const deleted = await Marksheet.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    await updateAcademicSummary(req.user._id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

const updateAcademicSummary = async (studentId) => {
  const marksheets = await Marksheet.find({ studentId }).sort({ createdAt: 1 });
  if (marksheets.length === 0) return;

  const subjectScores = {};
  marksheets.forEach(ms => {
    ms.subjects.forEach(s => {
      const key = s.name.toLowerCase();
      if (!subjectScores[key]) subjectScores[key] = { total: 0, count: 0 };
      subjectScores[key].total += (s.marks / s.maxMarks) * 100;
      subjectScores[key].count += 1;
    });
  });

  const subjectAverages = Object.entries(subjectScores).map(([name, data]) => ({
    subject: name,
    average: parseFloat((data.total / data.count).toFixed(2))
  }));

  const strengths = subjectAverages.filter(s => s.average >= 75).map(s => s.subject);
  const weaknesses = subjectAverages.filter(s => s.average < 50).map(s => s.subject);

  const semesterTrend = marksheets.map((ms, i) => {
    let trend = 'stable';
    if (i > 0) {
      const diff = ms.overallPercentage - marksheets[i - 1].overallPercentage;
      trend = diff > 2 ? 'up' : diff < -2 ? 'down' : 'stable';
    }
    return { semester: ms.semester, percentage: ms.overallPercentage, trend };
  });

  const percentages = semesterTrend.map(s => s.percentage);
  const consistencyScore = percentages.length > 1
    ? parseFloat((100 - (Math.max(...percentages) - Math.min(...percentages))).toFixed(2))
    : 100;

  await AcademicSummary.findOneAndUpdate(
    { studentId },
    {
      strengths,
      weaknesses,
      semesterTrend,
      consistencyScore,
      overallAverage: parseFloat((percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(2)),
      totalSemesters: marksheets.length,
      subjectWisePerformance: subjectAverages.map(s => ({ ...s, trend: 'stable' })),
      lastUpdated: new Date()
    },
    { upsert: true, new: true }
  );
};

export const getAcademicDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const marksheets = await Marksheet.find({ studentId }).sort({ createdAt: 1 });
    const summary = await AcademicSummary.findOne({ studentId });

    if (marksheets.length === 0) {
      return res.json({
        success: true,
        data: {
          overallPerformance: null,
          semesterTrend: [],
          subjectWisePerformance: [],
          strengths: [],
          weaknesses: [],
          recommendations: ['Upload your first marksheet to get started']
        }
      });
    }

    const subjectPerformance = {};
    marksheets.forEach(ms => {
      ms.subjects.forEach(s => {
        const key = s.name.toLowerCase();
        if (!subjectPerformance[key]) subjectPerformance[key] = { total: 0, count: 0 };
        subjectPerformance[key].total += (s.marks / s.maxMarks) * 100;
        subjectPerformance[key].count += 1;
      });
    });

    const subjectWise = Object.entries(subjectPerformance).map(([name, data]) => ({
      subject: name,
      average: parseFloat((data.total / data.count).toFixed(2))
    })).sort((a, b) => b.average - a.average);

    const overallPerformance = parseFloat((marksheets.reduce((sum, ms) => sum + ms.overallPercentage, 0) / marksheets.length).toFixed(2));

    const prompt = `Analyze academic performance and provide 3-4 concise recommendations.
Overall: ${overallPerformance}%
Subjects: ${subjectWise.map(s => `${s.subject}: ${s.average}%`).join(', ')}
Strengths: ${summary?.strengths.join(', ') || 'None'}
Weaknesses: ${summary?.weaknesses.join(', ') || 'None'}

Return ONLY valid JSON:
{
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    let recommendations = ['Continue focusing on your strengths', 'Dedicate more time to weaker subjects'];
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      });
      const match = response.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.recommendations) recommendations = parsed.recommendations;
      }
    } catch (e) { console.warn('AI recommendations unavailable'); }

    res.json({
      success: true,
      data: {
        overallPerformance,
        semesterTrend: summary?.semesterTrend || marksheets.map(ms => ({ semester: ms.semester, percentage: ms.overallPercentage, trend: 'stable' })),
        subjectWisePerformance: subjectWise,
        strengths: summary?.strengths || subjectWise.filter(s => s.average >= 75).map(s => s.subject),
        weaknesses: summary?.weaknesses || subjectWise.filter(s => s.average < 50).map(s => s.subject),
        recommendations,
        consistencyScore: summary?.consistencyScore || 100,
        totalSemesters: marksheets.length
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Dashboard error' });
  }
};

export const analyzeCareer = async (req, res) => {
  try {
    const studentId = req.user._id;

    const [marksheets, resume, academicSummary] = await Promise.all([
      Marksheet.find({ studentId }).sort({ createdAt: -1 }),
      Resume.findOne({ studentId }),
      AcademicSummary.findOne({ studentId })
    ]);

    if (marksheets.length === 0) {
      return res.status(400).json({ success: false, message: 'Upload marksheets first' });
    }

    const strongSubjects = academicSummary?.strengths || [];
    const resumeSkills = resume?.skills || [];
    const overallAvg = academicSummary?.overallAverage || 0;

    const prompt = `Analyze career potential based on:
- Strong subjects: ${strongSubjects.join(', ')}
- Resume skills: ${resumeSkills.join(', ')}
- Overall academic average: ${overallAvg}%

Map academics to career paths. Examples:
- DSA + OS → Software Engineer
- Math + Stats → Data Analyst
- Networking → Cloud/DevOps
- Design skills → UX/UI Designer

Return ONLY valid JSON:
{
  "careerDomains": [{"name": "", "matchScore": 0, "description": ""}],
  "recommendedRoles": [{"title": "", "domain": "", "matchScore": 0, "description": ""}],
  "skillGaps": [{"skill": "", "importance": "high", "resources": [""]}],
  "recommendedCertifications": [{"name": "", "provider": "", "url": "", "priority": ""}],
  "suggestedProjects": [{"title": "", "description": "", "difficulty": "", "technologies": [""], "outcome": ""}],
  "learningRoadmap": [{"phase": "", "duration": "", "goals": [""], "resources": [""]}]
}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    const match = response.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Failed to parse AI response');

    const careerData = JSON.parse(match[0]);

    await CareerProfile.findOneAndUpdate(
      { studentId },
      { ...careerData, lastAnalyzed: new Date(), updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: careerData });
  } catch (error) {
    console.error('Career analysis error:', error);
    res.status(500).json({ success: false, message: 'Career analysis failed' });
  }
};

export const getCareerProfile = async (req, res) => {
  try {
    const profile = await CareerProfile.findOne({ studentId: req.user._id });
    res.json({ success: true, data: profile || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch career profile' });
  }
};

import CareerProfile from '../models/CareerProfile.js';