import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { useThemeStore } from "../store/themeStore";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { getOpenAIResponse } from "../utils/getOpenAIResponse";
import { motion } from "framer-motion";

export function ChatWindow() {
  const { getCurrentMessages, regenerateLastResponse } = useChatStore();
  const { theme } = useThemeStore();

  const messages = getCurrentMessages();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex-1 overflow-y-auto px-4 py-6 transition-colors duration-300
      ${theme === "dark" ? "bg-zinc-950" : "bg-white"} max-h-screen`}
    >
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row"
        >
          {/* Avatar */}
          <div className="sm:mr-3 mb-1 sm:mb-0 text-2xl select-none">
            {msg.role === "user" ? "🧍" : "🤖"}
          </div>

          {/* Message Bubble */}
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1 font-semibold">
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`p-3 rounded-xl whitespace-pre-wrap text-sm break-words
                ${
                  msg.role === "user"
                    ? theme === "dark"
                      ? "bg-blue-900 text-white"
                      : "bg-blue-100 text-black"
                    : theme === "dark"
                    ? "bg-zinc-800 text-green-300"
                    : "bg-gray-100 text-green-900"
                }`}
            >
              <ReactMarkdown
                children={msg.content}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={theme === "dark" ? vscDarkPlus : oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="rounded text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className={`px-1 py-0.5 rounded text-sm ${
                          theme === "dark"
                            ? "bg-zinc-700 text-yellow-300"
                            : "bg-yellow-100 text-yellow-900"
                        }`}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </motion.div>

            {msg.role === "assistant" && i === messages.length - 1 && (
              <button
                onClick={() => regenerateLastResponse(getOpenAIResponse)}
                className="mt-2 text-xs text-blue-500 hover:underline"
              >
                🔄 Regenerate
              </button>
            )}
          </div>
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
