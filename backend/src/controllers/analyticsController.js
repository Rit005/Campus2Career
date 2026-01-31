import { groq } from "../groqClient.js";

export const analyzeWorkforce = async (req, res) => {
  try {
    const { companyData } = req.body;

    const prompt = `
      Analyze workforce data and return JSON:
      {
        "attrition_risk": "",
        "key_trends": [],
        "skill_demand": [],
        "diversity_insights": ""
      }

      Data: ${JSON.stringify(companyData)}
    `;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      data: JSON.parse(response.choices[0].message.content),
    });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Workforce analytics failed" });
  }
};
