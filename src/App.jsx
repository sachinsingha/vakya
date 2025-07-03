import { useEffect, useState } from "react";
import { useChatStore } from "./store/chatStore";
import { useThemeStore } from "./store/themeStore";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { InputBox } from "./components/InputBox";
import { Header } from "./components/Header";

export default function App() {
  const { currentSessionId, setCurrentSession, sessions } = useChatStore();
  const { theme } = useThemeStore();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ shared state

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!currentSessionId && sessions.length > 0) {
      setCurrentSession(sessions[0].id);
    }
  }, [currentSessionId, sessions]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-zinc-900">
      <button
        onClick={() => setSidebarVisible(true)}
        className="md:hidden p-2 fixed top-3 left-3 z-50 bg-zinc-800 text-white rounded"
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-white dark:bg-zinc-900 transform transition-transform duration-300 ease-in-out
          ${sidebarVisible ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-auto md:w-64`}
      >
        <Sidebar onClose={() => setSidebarVisible(false)} />
      </div>

      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <div className="border-b dark:border-zinc-800 p-4">
          <Header />
        </div>

        <ChatWindow isLoading={isLoading} />
        <InputBox setIsLoading={setIsLoading} />
      </div>
    </div>
  );
}
