// Stats cards — fixed dark mode text colors

import { Lead } from "@/app/types/lead";

type StatsCardsProps = {
  leads: Lead[];
};

type StatCard = {
  label: string;
  value: number;
  icon: string;
  description: string;
  // Light mode classes
  iconClass: string;
  // Value color works for both light and dark
  valueClass: string;
  // Border and hover for both modes
  borderClass: string;
};

export default function StatsCards({ leads }: StatsCardsProps) {
  const total = leads.length;
  const hot = leads.filter((l) => l.tag === "hot").length;
  const warm = leads.filter((l) => l.tag === "warm").length;
  const cold = leads.filter((l) => l.tag === "cold").length;

  const stats: StatCard[] = [
    {
      label: "Total Leads",
      value: total,
      icon: "▣",
      description: "All time",
      // icon background and color
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      // value text — readable in both modes
      valueClass: "text-indigo-600 dark:text-indigo-400",
      borderClass:
        "border-slate-100 hover:border-indigo-200 dark:border-white/10 dark:hover:border-indigo-500/30",
    },
    {
      label: "Hot Leads",
      value: hot,
      icon: "▲",
      description: "Score 70+",
      iconClass: "bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400",
      valueClass: "text-red-500 dark:text-red-400",
      borderClass:
        "border-slate-100 hover:border-red-200 dark:border-white/10 dark:hover:border-red-500/30",
    },
    {
      label: "Warm Leads",
      value: warm,
      icon: "◆",
      description: "Score 40–69",
      iconClass:
        "bg-amber-50 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400",
      valueClass: "text-amber-500 dark:text-amber-400",
      borderClass:
        "border-slate-100 hover:border-amber-200 dark:border-white/10 dark:hover:border-amber-500/30",
    },
    {
      label: "Cold Leads",
      value: cold,
      icon: "●",
      description: "Score 0–39",
      iconClass:
        "bg-blue-50 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
      valueClass: "text-blue-500 dark:text-blue-400",
      borderClass:
        "border-slate-100 hover:border-blue-200 dark:border-white/10 dark:hover:border-blue-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`
            rounded-xl border p-5 shadow-sm
            transition-all duration-200 cursor-default
            bg-white dark:bg-white/5
            ${stat.borderClass}
          `}
        >
          {/* Top row — icon + description tag */}
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div
              className={`
              w-10 h-10 rounded-xl flex items-center
              justify-center text-sm font-bold
              ${stat.iconClass}
            `}
            >
              {stat.icon}
            </div>

            {/* Description tag */}
            <span
              className="
              text-xs
              text-slate-400 dark:text-slate-500
              bg-slate-50 dark:bg-white/5
              border border-slate-100 dark:border-white/10
              px-2 py-0.5 rounded-full
            "
            >
              {stat.description}
            </span>
          </div>

          {/* Big number — now has proper dark: color */}
          <p className={`text-4xl font-bold mb-1 ${stat.valueClass}`}>
            {stat.value}
          </p>

          {/* Label */}
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
