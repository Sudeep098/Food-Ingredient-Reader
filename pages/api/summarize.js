export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Give a very short and simple summary of these food ingredients.
Mention if people with any medical conditions should avoid it.

Ingredients:
${text}`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.status(200).json({ summary: output });

  } catch (err) {
    res.status(500).json({ error: "Gemini API failed" });
  }
}
