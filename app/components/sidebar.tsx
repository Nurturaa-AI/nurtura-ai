// Sidebar navigation with indigo theme and dark mode support

"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/app/components/theme-toggle";

type NavItem = {
  label: string;
  icon: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▣", href: "/" },
  { label: "Leads", icon: "◎", href: "/leads" },
  { label: "Sequences", icon: "◇", href: "/sequences" },
  { label: "Analytics", icon: "△", href: "/analytics" },
  { label: "Settings", icon: "○", href: "/settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    // The sidebar background:
    // Light mode: deep indigo (indigo-950)
    // Dark mode: near-black slate (slate-950)
    <aside
      className="
      w-60 h-screen flex flex-col shrink-0
      bg-indigo-950 dark:bg-slate-950
      border-r border-indigo-900 dark:border-slate-800
    "
    >
      {/* Brand area */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          {/* Animated indigo dot */}
          <div className="relative w-3 h-3">
            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-indigo-400 animate-ping opacity-50"></div>
          </div>

          <span className="text-white font-bold text-lg tracking-tight">
            Nurtura AI
          </span>
        </div>
        <p className="text-indigo-400/60 text-xs mt-1.5 ml-5">
          Lead Intelligence
        </p>
      </div>

      <Separator className="bg-indigo-900/50 dark:bg-slate-800" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p
          className="
          text-indigo-400/40 text-xs font-semibold
          uppercase tracking-widest px-3 mb-4
        "
        >
          Menu
        </p>

        {navItems.map((item) => {
          const isActive = active === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-indigo-500/20 text-white border border-indigo-500/30"
                    : "text-indigo-300/60 hover:bg-indigo-500/10 hover:text-indigo-200 border border-transparent"
                }
              `}
            >
              {/* Icon — brighter when active */}
              <span className={`text-sm ${isActive ? "text-indigo-400" : ""}`}>
                {item.icon}
              </span>
              {item.label}

              {/* Active dot on the right side */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              )}
            </button>
          );
        })}
      </nav>

      <Separator className="bg-indigo-900/50 dark:bg-slate-800" />

      {/* Theme toggle */}
      <div className="px-3 pt-3">
        <ThemeToggle />
      </div>

      <Separator className="bg-indigo-900/50 dark:bg-slate-800 mt-3" />

      {/* User profile at bottom */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-1">
          {/* Avatar with indigo background */}
          <div
            className="
            w-8 h-8 rounded-full flex items-center justify-center shrink-0
            bg-indigo-500
          "
          >
            <span className="text-white text-xs font-bold">BC</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              Benjamin Cole
            </p>
            <p className="text-indigo-400/50 text-xs truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
