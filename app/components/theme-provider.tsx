// This wraps our entire app and makes dark mode work everywhere
// It's a thin wrapper around the next-themes library

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// children is everything inside the provider — our whole app
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      // "class" means it toggles the "dark" class on the html element
      attribute="class"
      // defaultTheme is what shows on first visit
      defaultTheme="light"
      // enableSystem lets it follow the user's OS dark mode setting
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
