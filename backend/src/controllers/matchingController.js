import { groq } from "../groqClient.js";

export const matchCandidate = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText & jobDescription required" });
    }

    const prompt = `
      Compare resume with job description and return JSON:
      {
        "match_score": "",
        "strengths": [],
        "skill_gaps": [],
        "summary": ""
      }

      Resume: ${resumeText}
      Job: ${jobDescription}
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      data: JSON.parse(response.choices[0].message.content),
    });

  } catch (err) {
    console.error("Matching Error:", err);
    res.status(500).json({ error: "Candidate matching failed" });
  }
};
