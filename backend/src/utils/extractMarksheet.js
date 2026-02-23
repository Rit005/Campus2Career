import pdf from "pdf-parse";

export async function extractFullMarksheet(buffer) {
  const pdfData = await pdf(buffer);
  const text = pdfData.text;


  const subjectRegex = /([A-Z]{2,3}\s?\d{3})-(.*?)\s+(\d+(\.\d+)?)\s*\/\s*100\s+([A-F][+\-]?)/g;

  const subjects = [];
  let match;

  while ((match = subjectRegex.exec(text)) !== null) {
    subjects.push({
      code: match[1].trim(),
      name: match[2].trim(),
      total100: parseFloat(match[3]),
      grade: match[5],
    });
  }

  if (subjects.length === 0) {
    subjects.push(...await extractUsingAI(text));
  }

  return subjects;
}

async function extractUsingAI(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `
Extract subject, final marks out of 100, and grade.
Input:
${text}

Output JSON array:
[
  { "code": "", "name": "", "total100": 0, "grade": "" }
]
`}]
  });

  return JSON.parse(response.choices[0].message.content);
}
