import axios from "axios";

export const analyzeEmotion = async (text) => {
  try {
    const prompt = `
You are an AI that analyzes emotions.

Return ONLY valid JSON. No explanation.

Format:
{
  "emotion": "happy/sad/calm/angry/neutral",
  "keywords": ["word1", "word2"],
  "summary": "long summary"
}

Text: "${text}"
`;

    console.log("Calling LLM with text:", text);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("LLM RAW RESPONSE:", response.data);

    const content = response.data.choices[0].message.content;

  
    let parsed;

    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");

      const jsonString = content.substring(start, end + 1);

      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.log("Parsing failed:", err.message);

      parsed = {
        emotion: "neutral",
        keywords: [],
        summary: content
      };
    }

    return parsed;

  } catch (error) {
      console.error("LLM FULL ERROR:", error.response?.data || error.message);

    return {
      emotion: "unknown",
      keywords: [],
      summary: "Analysis failed"
    };
  }
};