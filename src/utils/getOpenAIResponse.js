import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const REFERER_URL = "http://localhost:5173"; // Change when deployed

/**
 * Returns a response from OpenAI, OpenRouter, or Gemini based on model ID
 * @param {string} prompt - User's message prompt
 * @param {string} model - Model name (e.g., "openai/gpt-3.5-turbo", "gemini/gemini-pro")
 */
export async function getOpenAIResponse(prompt, model) {
  const trimmedPrompt = prompt.trim();
  console.log("🧠 Prompt:", trimmedPrompt);
  console.log("🤖 Model selected:", model);

  // Handle OpenAI
  if (model.startsWith("openai/")) {
    const realModel = model.replace("openai/", "");
    if (!OPENAI_API_KEY) return "❌ OpenAI API key missing.";
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: realModel,
          messages: [{ role: "user", content: trimmedPrompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data?.choices?.[0]?.message?.content || "⚠️ No response from OpenAI.";
    } catch (err) {
      console.error("❌ OpenAI Error:", err.response?.data || err.message);
      return `❌ OpenAI request failed. ${err.response?.data?.error?.message || err.message}`;
    }
  }

  // Handle Gemini
  if (model.startsWith("gemini/")) {
    const realModel = model.replace("gemini/", "");
    if (!GEMINI_API_KEY) return "❌ Gemini API key missing.";
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${realModel}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: trimmedPrompt }] }],
        }
      );
      return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini.";
    } catch (err) {
      console.error("❌ Gemini Error:", err.response?.data || err.message);
      return `❌ Gemini request failed. ${err.response?.data?.error?.message || err.message}`;
    }
  }

  // Handle OpenRouter
  if (!OPENROUTER_API_KEY) return "❌ OpenRouter API key missing.";
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: trimmedPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": REFERER_URL,
        },
      }
    );
    return res.data?.choices?.[0]?.message?.content || "⚠️ No response from OpenRouter.";
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    return `❌ OpenRouter request failed. ${err.response?.data?.error?.message || err.message}`;
  }
}
