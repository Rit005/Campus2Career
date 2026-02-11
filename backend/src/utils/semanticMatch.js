import { groq } from "../groqClient.js";

export const computeSemanticSimilarity = async (skills, domainKeywords) => {
  try {
    const prompt = `
You will return similarity scores between a student's skills and a domain's keywords.

Student Skills: ${skills.join(", ")}
Domain Keywords: ${domainKeywords.join(", ")}

Return ONLY JSON format:
{
  "similarity": 0.0
}
`;

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [{ role: "user", content: prompt }]
    });

    let raw = res.choices[0].message.content;
    let json = JSON.parse(raw);

    return json.similarity || 0;

  } catch (error) {
    console.error("Similarity error:", error);
    return 0; // fallback safe
  }
};
