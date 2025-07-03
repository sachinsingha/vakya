import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const REFERER_URL = "https://vakya.vercel.app"; // ✅ Replace with your deployed domain

/**
 * Handles chat completions from OpenAI, OpenRouter, or Gemini
 * @param {string} prompt
 * @param {string} model
 */
export async function getOpenAIResponse(prompt, model) {
  const trimmedPrompt = prompt.trim();
  console.log("🧠 Prompt:", trimmedPrompt);
  console.log("🤖 Model selected:", model);

  // ✅ OpenAI
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
      return res.data.choices?.[0]?.message?.content || "⚠️ No response from OpenAI.";
    } catch (err) {
      console.error("❌ OpenAI Error:", err.response?.data || err.message);
      return `❌ OpenAI request failed: ${err.response?.data?.error?.message || err.message}`;
    }
  }

  // ✅ Gemini
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
      return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini.";
    } catch (err) {
      console.error("❌ Gemini Error:", err.response?.data || err.message);
      return `❌ Gemini request failed: ${err.response?.data?.error?.message || err.message}`;
    }
  }

  // ✅ OpenRouter (Default fallback)
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
  "HTTP-Referer": "https://vakya-git-main-sas-projects-3d786727.vercel.app/",
  "X-Title": "Vakya",
}

      }
    );
    return res.data.choices?.[0]?.message?.content || "⚠️ No response from OpenRouter.";
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    return `❌ OpenRouter request failed: ${err.response?.data?.error?.message || err.message}`;
  }
}
