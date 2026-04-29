import axios from "axios";

export const analyzeEmotion = async (text) => {
  try {
    const prompt = `
          You are an accurate emotion and sentiment analyzer.
          Return ONLY valid JSON in this formate: 

          {
            "emotion": "happy/sad/calm/angry/neutral/anxious/other",
            "sentiment":"positive/nagative/neutral",
            "sentimentScore": number(1 to -1),
            "keywords": [ "word1" , "word2" , "word3"],
            "summary": "max 20 words"
          }

          Rules:
           -emotion must be one of the given categories
           -sentiment Score must be between -1 to 1 
           -summary must be short and meaningful
           -keywords must be 3 to  important words

          Examples:
          Text: I just won the lottery!
          {"emotion":"happy","sentiment":"positive", "sentimentScore": 0.9,
          "summary":"Strong joy from winning big prize",
           "keywords":["won","lottery","excited"]}

          Text: Another Monday morning...
          {"emotion":"sad","sentiment":"nagative", "sentimentScore": -0.5,
          "summary":"Typical low-energy start of work week feeling",
           "keywords":["monday","morning","tired"],}

          Text: ${text}
          `;

    console.log("Calling LLM with text:", text);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
           
          }
        ],
        temperature: 0,
        response_format: { type: "json_object" }
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
     parsed = typeof content === "string"? JSON.parse(content):content;
     if(!parsed.emotion || !parsed.sentiment){
      throw new error("invalid AI response");
     }
} catch (err) {
  console.log("Parsing failed:", err.message);

  parsed = {
    emotion: "neutral",
    sentiment:"neutral",
    sentimentScore: 0,
    keywords: [],
    summary: text
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