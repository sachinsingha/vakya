import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { useThemeStore } from "../store/themeStore";
import { getOpenAIResponse } from "../utils/getOpenAIResponse";

const LANGUAGES = [
  { label: "Auto Detect", code: "auto" },
  { label: "🇮🇳 Hindi", code: "hi-IN" },
  { label: "🇮🇳 Bengali", code: "bn-IN" },
  { label: "🇮🇳 Telugu", code: "te-IN" },
  { label: "🇮🇳 Marathi", code: "mr-IN" },
  { label: "🇮🇳 Tamil", code: "ta-IN" },
  { label: "🇮🇳 Gujarati", code: "gu-IN" },
  { label: "🇮🇳 Urdu", code: "ur-IN" },
  { label: "🇮🇳 Kannada", code: "kn-IN" },
  { label: "🇮🇳 Malayalam", code: "ml-IN" },
  { label: "🇮🇳 Punjabi", code: "pa-IN" },
  { label: "🇮🇳 Odia", code: "or-IN" },
  { label: "🇮🇳 Assamese", code: "as-IN" },
  { label: "🇮🇳 Maithili", code: "mai-IN" },
  { label: "🇮🇳 Santali", code: "sat-IN" },
  { label: "🇮🇳 Konkani", code: "kok-IN" },
  { label: "🇮🇳 English (India)", code: "en-IN" },
];

export function InputBox({ setIsLoading }) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [selectedLang, setSelectedLang] = useState("auto");

  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const {
    addMessage,
    getCurrentMessages,
    currentSessionId,
    selectedModel,
    setSessionTitle,
  } = useChatStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !currentSessionId) return;

    const userMsg = { role: "user", content };
    addMessage(userMsg);
    setInput("");
    setInterimTranscript("");
    setIsLoading(true);

    try {
      const response = await getOpenAIResponse(content, selectedModel);
      const aiMsg = { role: "assistant", content: response };
      addMessage(aiMsg);

      const messages = getCurrentMessages();
      if (messages.length === 2) {
        const title = content.slice(0, 30).replace(/\n/g, " ");
        setSessionTitle(currentSessionId, title || "Untitled");
      }
    } catch (err) {
      console.error("❌ Response error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResponse = async (content) => {
    setIsLoading(true);
    try {
      const response = await getOpenAIResponse(content, selectedModel);
      const aiMsg = { role: "assistant", content: response };
      addMessage(aiMsg);
    } catch (err) {
      console.error("❌ Voice response error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("🎤 Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      selectedLang === "auto"
        ? navigator.language || "en-IN"
        : selectedLang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (const result of event.results) {
        if (result.isFinal) final += result[0].transcript + " ";
        else interim += result[0].transcript;
      }

      if (final.trim()) {
        const userMsg = { role: "user", content: final.trim() };
        addMessage(userMsg);
        handleVoiceResponse(final.trim());
      }

      setInterimTranscript(interim);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div
      className={`p-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-zinc-900" : "bg-gray-100"
      }`}
    >
      {interimTranscript && (
        <div className="mb-2 text-sm text-yellow-500 font-medium animate-pulse">
          🎙 {interimTranscript}
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="text-sm p-2 bg-zinc-800 text-white rounded w-full md:w-60"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center w-full">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInterimTranscript("");
            }}
            placeholder="Type or speak..."
            className={`flex-1 p-2 rounded border outline-none ${
              theme === "dark"
                ? "bg-zinc-800 text-white border-zinc-700"
                : "bg-white text-black border-gray-300"
            }`}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            className={`p-2 rounded-full transition ${
              isListening
                ? "bg-red-600 animate-pulse"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
            title="Hold to speak"
          >
            🎤
          </button>

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white w-20 flex justify-center items-center"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
