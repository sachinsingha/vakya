import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "dark", // default
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        set({ theme: newTheme });
      },
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
      },
    }),
    {
      name: "theme-store",
      onRehydrateStorage: () => (state) => {
        // Ensures class is re-applied on reload
        const storedTheme = state?.theme || "dark";
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      },
    }
  )
);
