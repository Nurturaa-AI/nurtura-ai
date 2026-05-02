// Theme toggle button — switches between light and dark mode
// Simplified version that avoids the setState-in-effect pattern

"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  // useTheme gives us the current theme and the function to change it
  // "resolvedTheme" is more reliable than "theme" because it accounts
  // for the system preference and is always "light" or "dark" — never undefined
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // If currently dark switch to light, otherwise switch to dark
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-sm font-medium transition-all duration-150
        text-indigo-300/60 hover:bg-indigo-500/10
        hover:text-indigo-200 border border-transparent
      "
    >
      {/* Sun icon in dark mode, moon icon in light mode */}
      <span className="text-base">{isDark ? "☀" : "☾"}</span>
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
