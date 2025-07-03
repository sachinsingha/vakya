// Sidebar.jsx
import { useState } from "react";
import { useChatStore } from "../store/chatStore";
import {
  exportAsPDF,
  exportAsMarkdown,
  exportAsTxt,
} from "../utils/exportUtils";
import { summarizeChat } from "../utils/summarizeChat";
import { useThemeStore } from "../store/themeStore";

const MODEL_OPTIONS = [
  { label: "🌀 Mistral (Free)", value: "mistralai/mistral-small-3.2-24b-instruct:free" },
  { label: "🦙 LLaMA 3 (8B)", value: "meta-llama/llama-3-8b-instruct:free" },
  { label: "🧠 GPT-3.5", value: "openai/gpt-3.5-turbo" },
  { label: "🔥 GPT-4", value: "openai/gpt-4" },
  { label: "🌞 Gemini Pro", value: "gemini/gemini-pro" },
  { label: "🌙 Gemini 1.5 Pro", value: "gemini/gemini-1.5-pro-latest" },
];

export function Sidebar({ onClose }) {
  const {
    sessions,
    currentSessionId,
    setCurrentSession,
    newSession,
    setModel,
    selectedModel,
    setSessionSummary,
  } = useChatStore();

  const { theme, toggleTheme } = useThemeStore();
  const [format, setFormat] = useState("");
  const [summary, setSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const clearAllChats = () => {
    localStorage.removeItem("chat-store");
    window.location.reload();
  };

  const handleExport = () => {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (!session) return alert("❗ No session selected.");

    switch (format) {
      case "markdown": exportAsMarkdown(session); break;
      case "txt": exportAsTxt(session); break;
      case "pdf": exportAsPDF(session); break;
      default: alert("❗ Please select a format.");
    }

    setFormat("");
  };

  const handleSummarize = async () => {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (!session) return alert("❗ No session selected.");
    const summaryText = await summarizeChat(session, selectedModel);
    setSummary(summaryText);
    setShowSummary(true);
    setSessionSummary(session.id, summaryText);
  };

  return (
    <div className="w-64 h-full p-4 bg-white dark:bg-zinc-900 text-black dark:text-white flex flex-col gap-4 border-r dark:border-zinc-800 overflow-y-auto">
      {/* Close Button (Mobile Only) */}
      {onClose && (
        <div className="flex justify-end md:hidden">
          <button onClick={onClose} className="text-xl text-red-600">✕</button>
        </div>
      )}

      {/* New Chat */}
      <button
        onClick={newSession}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
      >
        + New Chat
      </button>

      {/* Model Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="model" className="text-sm">Model:</label>
        <select
          id="model"
          className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-sm"
          value={selectedModel}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="" disabled>Select a model</option>
          {MODEL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Chat Sessions */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <h3 className="text-sm text-gray-500 dark:text-gray-300 mb-2">💬 Chats</h3>
        <ul className="flex flex-col gap-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                setCurrentSession(s.id);
                onClose?.(); // Close drawer on mobile
              }}
              className={`cursor-pointer p-2 rounded text-sm ${
                currentSessionId === s.id
                  ? "bg-blue-700 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {s.title || "Untitled"}
            </li>
          ))}
        </ul>
      </div>

      {/* Export / Summarize */}
      <div className="flex flex-col gap-2">
        <label htmlFor="export-format" className="text-sm">Export Format:</label>
        <select
          id="export-format"
          className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-sm"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">Select Format</option>
          <option value="pdf">📄 PDF</option>
          <option value="markdown">📘 Markdown</option>
          <option value="txt">📄 Plain Text</option>
        </select>

        <button
          onClick={handleExport}
          disabled={!format || !currentSessionId}
          className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded text-white"
        >
          📥 Export Chat
        </button>

        <button
          onClick={handleSummarize}
          disabled={!currentSessionId}
          className="px-3 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 rounded text-white"
        >
          🧠 Summarize Chat
        </button>
      </div>

      {/* Summary Box */}
      {showSummary && (
        <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded text-sm whitespace-pre-wrap overflow-auto max-h-60">
          <div className="flex justify-between mb-2">
            <span className="text-yellow-600 font-semibold">🧠 Summary</span>
            <button
              onClick={() => setShowSummary(false)}
              className="text-red-500 text-xs hover:underline"
            >
              Close
            </button>
          </div>
          <div className="mb-4">{summary}</div>
          <div className="flex gap-2">
            {["markdown", "txt", "pdf"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  if (type === "pdf") {
                    import("html2pdf.js").then((html2pdf) => {
                      const container = document.createElement("div");
                      container.textContent = summary;
                      html2pdf.default().from(container).set({ filename: "summary.pdf" }).save();
                    });
                  } else {
                    const blob = new Blob([summary], {
                      type: type === "txt" ? "text/plain" : "text/markdown",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `summary.${type === "txt" ? "txt" : "md"}`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                className={`px-2 py-1 rounded text-xs text-white ${
                  type === "pdf"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : type === "txt"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {type === "pdf" ? "🖨 PDF" : type === "txt" ? "📄 TXT" : "📘 MD"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Theme / Clear Buttons */}
      <button
        onClick={toggleTheme}
        className="mt-2 px-3 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-white"
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <button
        onClick={clearAllChats}
        className="mt-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
      >
        🗑 Clear All Chats
      </button>
    </div>
  );
}
