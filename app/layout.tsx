// Root layout — wraps every page with font, theme provider, and sidebar

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/components/sidebar";
import ThemeProvider from "@/app/components/theme-provider";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nurtura AI",
  description: "AI lead qualification for Instagram",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning is needed on html element
        because next-themes adds the "dark" class after hydration
        without this you get a console warning
      */}
      <body className={font.className}>
        {/* ThemeProvider wraps everything so dark mode works on all pages */}
        <ThemeProvider>
          <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
