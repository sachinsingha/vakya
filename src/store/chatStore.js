import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

const defaultSession = {
  id: nanoid(),
  title: "New Chat",
  messages: [],
  summary: "", // ✅ Added summary field
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      // ✅ Initial state
      sessions: [defaultSession],
      currentSessionId: defaultSession.id,
      selectedModel: "mistralai/mistral-small-3.2-24b-instruct:free",

      // ✅ Create new session
      newSession: () => {
        const newSession = {
          id: nanoid(),
          title: "Untitled",
          messages: [],
          summary: "", // ✅ Include summary
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));
      },

      // ✅ Add message to current session
      addMessage: (msg) => {
        const { sessions, currentSessionId } = get();
        const updatedSessions = sessions.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, msg] }
            : session
        );
        set({ sessions: updatedSessions });
      },

      // ✅ Set session summary
      setSessionSummary: (id, summary) => {
        const { sessions } = get();
        const updated = sessions.map((s) =>
          s.id === id ? { ...s, summary } : s
        );
        set({ sessions: updated });
      },

      // ✅ Set session title
      setSessionTitle: (id, title) => {
        const { sessions } = get();
        const updated = sessions.map((s) =>
          s.id === id ? { ...s, title } : s
        );
        set({ sessions: updated });
      },

      // ✅ Set current session
      setCurrentSession: (id) => set({ currentSessionId: id }),

      // ✅ Get current messages
      getCurrentMessages: () => {
        const { sessions, currentSessionId } = get();
        const session = sessions.find((s) => s.id === currentSessionId);
        return session ? session.messages : [];
      },

      // ✅ Set model
      setModel: (model) => set({ selectedModel: model }),

      // ✅ Regenerate last AI response
      regenerateLastResponse: async (getResponseFn) => {
        const { sessions, currentSessionId, addMessage, selectedModel } = get();
        const session = sessions.find((s) => s.id === currentSessionId);
        if (!session) return;

        const lastUserMsg = [...session.messages]
          .reverse()
          .find((m) => m.role === "user");

        if (!lastUserMsg) return;

        // Add loading message
        const loadingMsg = {
          role: "assistant",
          content: "⏳ Regenerating...",
        };
        addMessage(loadingMsg);

        try {
          const aiResponse = await getResponseFn(lastUserMsg.content, selectedModel);
          // Remove loading and add new response
          const updatedMessages = session.messages.filter(
            (m) => m.content !== "⏳ Regenerating..."
          );

          const updatedSessions = sessions.map((s) =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messages: [
                    ...updatedMessages,
                    { role: "assistant", content: aiResponse },
                  ],
                }
              : s
          );

          set({ sessions: updatedSessions });
        } catch (err) {
          console.error("❌ Regeneration failed", err);
        }
      },
    }),
    {
      name: "chat-store", // localStorage key
    }
  )
);
