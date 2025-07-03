import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getGeminiResponse(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return content || "⚠️ No response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    return "❌ Failed to fetch response from Gemini.";
  }
}
