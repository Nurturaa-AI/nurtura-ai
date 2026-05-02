// Theme toggle — fixed hydration mismatch
// We show a neutral icon on first render, then switch once
// the client knows which theme is active

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // mounted tells us when we are safely on the client
  // On the server we don't know the theme yet so we
  // wait until the component mounts before showing the icon
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This runs only on the client, never on the server
    // Setting mounted here is intentional — we are NOT
    // syncing state with an external system, we are simply
    // waiting for the browser to be ready
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

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
      {/*
        suppressHydrationWarning tells React to ignore any mismatch
        on this specific element during hydration.
        We use it here because the icon INTENTIONALLY differs between
        server (unknown theme) and client (resolved theme).
        This is the recommended pattern for theme toggles in Next.js.
      */}
      <span className="text-base" suppressHydrationWarning>
        {/* Before mounted: show a neutral placeholder */}
        {/* After mounted: show the correct icon for the current theme */}
        {!mounted ? "◐" : resolvedTheme === "dark" ? "☀" : "☾"}
      </span>

      <span suppressHydrationWarning>
        {!mounted
          ? "Toggle theme"
          : resolvedTheme === "dark"
            ? "Light Mode"
            : "Dark Mode"}
      </span>
    </button>
  );
}
