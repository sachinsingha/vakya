import { useState } from "react";
import { useChatStore } from "../store/chatStore";
import { exportChat } from "../utils/exportChat";

export function ExportModal({ onClose }) {
  const { sessions, currentSessionId, selectedModel } = useChatStore();
  const session = sessions.find((s) => s.id === currentSessionId);

  const [format, setFormat] = useState("markdown");
  const [withSummary, setWithSummary] = useState(true);
  const [withAvatars, setWithAvatars] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    await exportChat({ session: { ...session, model: selectedModel }, format, withSummary, withAvatars });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-semibold mb-4">📄 Export Chat</h2>

        {/* Format Selector */}
        <div className="mb-4">
          <label className="block mb-1">Export Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800"
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="txt">Plain Text (.txt)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>

        {/* Summary Option */}
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={withSummary}
            onChange={(e) => setWithSummary(e.target.checked)}
            className="mr-2"
          />
          Include AI-generated summary
        </label>

        {/* Avatars Option */}
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={withAvatars}
            onChange={(e) => setWithAvatars(e.target.checked)}
            className="mr-2"
          />
          Show avatars (🤖 🧍)
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
    </div>
  );
}
