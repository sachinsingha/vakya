import axios from "axios";

// ✅ Import your API keys from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ Production domain - required by OpenRouter
const REFERER_URL = "https://vakya.vercel.app";

/**
 * Fetches AI model response based on selected provider (OpenAI, Gemini, OpenRouter).
 *
 * @param {string} prompt - The user input.
 * @param {string} model - The model identifier (e.g., "openai/gpt-3.5-turbo", "gemini/gemini-pro", "mistralai/mistral-7b-instruct").
 * @returns {Promise<string>} - The model's text response or error message.
 */
export async function getOpenAIResponse(prompt, model) {
  const trimmedPrompt = prompt.trim();
  console.log("🧠 Prompt:", trimmedPrompt);
  console.log("🤖 Model selected:", model);

  // ▶️ OpenAI
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

  // ▶️ Gemini
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

  // ▶️ OpenRouter (Default)
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
          "HTTP-Referer": REFERER_URL, // 👈 must match domain configured in OpenRouter
          "X-Title": "Vakya",           // Optional branding
        },
      }
    );
    return res.data.choices?.[0]?.message?.content || "⚠️ No response from OpenRouter.";
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    return `❌ OpenRouter request failed: ${err.response?.data?.error?.message || err.message}`;
  }
}
