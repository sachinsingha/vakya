// src/components/Header.jsx
export function Header() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800">
      {/* Logo + Name */}
      <div className="flex items-center gap-2">
        <img src="/multimodel-logo.svg" alt="Logo" className="w-10 h-10" />
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Vak<span className="text-yellow-400">Ya</span>
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mt-2 md:mt-0 animate-fade-in">
        Converse with{" "}
        <span className="text-blue-400 font-medium">GPT</span>,{" "}
        <span className="text-green-400 font-medium">LLaMA</span>,{" "}
        <span className="text-pink-400 font-medium">Gemini</span> & more.
      </p>
    </div>
  );
}
