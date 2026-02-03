import { groq } from "../groqClient.js";
import { getHiringPipeline } from "../utils/getHiringPipeline.js";
import { predictHiringSuccess } from "../ml/predictHiring.js";

export const getHiringDashboard = async (req, res) => {
  try {
    const pipeline = await getHiringPipeline();
    const ml = predictHiringSuccess(pipeline);

    const prompt = `
You are a strict JSON generator.
Only output valid JSON.

{
  "pipeline_overview": "",
  "funnel_metrics": [],
  "bottlenecks": [],
  "recommendations": [],
  "future_prediction": ""
}

Use this hiring pipeline:
${JSON.stringify(pipeline, null, 2)}

Also use this ML prediction:
${JSON.stringify(ml, null, 2)}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content.trim();
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);

    return res.json({
      success: true,
      pipeline,
      ml,
      insights: json,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Hiring dashboard failed" });
  }
};
