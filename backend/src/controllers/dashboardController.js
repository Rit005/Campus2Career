import { groq } from "../groqClient.js";

export const getHiringDashboard = async (req, res) => {
  try {
    const { pipeline } = req.body;

    const prompt = `
      Generate hiring dashboard insights:
      {
        "pipeline_overview": "",
        "funnel_metrics": [],
        "bottlenecks": [],
        "recommendations": []
      }

      Data: ${JSON.stringify(pipeline)}
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      data: JSON.parse(response.choices[0].message.content),
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Hiring dashboard failed" });
  }
};
