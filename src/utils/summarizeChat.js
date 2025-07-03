import { getOpenAIResponse } from "./getOpenAIResponse";

/**
 * Summarizes a chat session using the selected LLM.
 * @param {Object} session - A chat session object containing messages.
 * @param {string} model - The model ID to use (e.g., "mistralai/mistral-small-3.2-24b-instruct:free").
 * @returns {Promise<string>} - A summary of the chat session.
 */
export async function summarizeChat(session, model) {
  if (!session || !session.messages || session.messages.length === 0) {
    return "⚠️ No messages to summarize.";
  }

  if (!model) {
    console.error("❌ summarizeChat Error: No model provided.");
    return "❌ Failed to generate summary. No model selected.";
  }

  const chatContent = session.messages
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
    .join("\n");

  const summarizationPrompt = `You are an intelligent assistant. Summarize the following chat conversation into a concise paragraph highlighting the main ideas, key points, and important takeaways.

Conversation:
${chatContent}

Summary:
`;

  try {
    const summary = await getOpenAIResponse(summarizationPrompt, model);
    return summary.trim();
  } catch (err) {
    console.error("❌ summarizeChat Error:", err);
    return "❌ Failed to generate summary due to an internal error.";
  }
}
