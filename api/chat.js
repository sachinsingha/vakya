export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { model, messages, temperature } = req.body;

  try {
    let reply;

    if (model.startsWith("openai/")) {
      // Your OpenAI handler here
      reply = await fetchOpenAI(model, messages, temperature);
    } else if (model.startsWith("gemini/")) {
      // Gemini logic
      reply = await fetchGemini(messages);
    } else if (model.startsWith("mistralai/")) {
      // Mistral logic
      reply = await fetchMistral(messages);
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat API failed" });
  }
}
