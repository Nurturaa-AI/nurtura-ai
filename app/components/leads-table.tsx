// Clean leads table with indigo theme and full dark mode support

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/app/types/lead";

type LeadsTableProps = {
  leads: Lead[];
};

// Tag badge styles — light and dark variants
function tagStyle(tag: Lead["tag"]) {
  if (tag === "hot")
    return `
    bg-red-50 text-red-600 border border-red-100
    dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20
  `;
  if (tag === "warm")
    return `
    bg-amber-50 text-amber-600 border border-amber-100
    dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20
  `;
  return `
    bg-blue-50 text-blue-600 border border-blue-100
    dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20
  `;
}

// Status badge styles — light and dark variants
function statusStyle(status: Lead["status"]) {
  if (status === "new")
    return `
    bg-slate-50 text-slate-500 border border-slate-200
    dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700
  `;
  if (status === "contacted")
    return `
    bg-indigo-50 text-indigo-600 border border-indigo-100
    dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20
  `;
  if (status === "booked")
    return `
    bg-emerald-50 text-emerald-600 border border-emerald-100
    dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20
  `;
  return `
    bg-purple-50 text-purple-600 border border-purple-100
    dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20
  `;
}

// Score bar color based on value
function scoreBarColor(score: number) {
  if (score >= 70) return "bg-red-400";
  if (score >= 40) return "bg-amber-400";
  return "bg-blue-400";
}

// Score text color
function scoreTextColor(score: number) {
  if (score >= 70) return "text-red-500 dark:text-red-400";
  if (score >= 40) return "text-amber-500 dark:text-amber-400";
  return "text-blue-500 dark:text-blue-400";
}

// Format date to "May 1" format
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  // Edge case — no leads yet
  if (leads.length === 0) {
    return (
      <div
        className="
        bg-white dark:bg-slate-900
        rounded-xl border border-slate-100 dark:border-slate-800
        py-20 text-center
      "
      >
        <p className="text-5xl mb-4">◎</p>
        <p className="text-slate-600 dark:text-slate-400 font-semibold">
          No leads yet
        </p>
        <p className="text-slate-400 dark:text-slate-600 text-sm mt-1">
          Leads appear here when someone DMs your Instagram
        </p>
      </div>
    );
  }

  return (
    <div
      className="
      bg-white dark:bg-slate-900
      rounded-xl border border-slate-100 dark:border-slate-800
      shadow-sm overflow-hidden
    "
    >
      <Table>
        {/* Table header */}
        <TableHeader>
          <TableRow
            className="
            bg-slate-50 dark:bg-slate-800/50
            hover:bg-slate-50 dark:hover:bg-slate-800/50
            border-b border-slate-100 dark:border-slate-800
          "
          >
            {/* Each column header uses the same style */}
            {[
              "Name",
              "Instagram",
              "Message",
              "Score",
              "Tag",
              "Status",
              "Date",
            ].map((col) => (
              <TableHead
                key={col}
                className="
                  text-xs font-semibold uppercase tracking-wider
                  text-slate-400 dark:text-slate-500
                "
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table body */}
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="
                border-b border-slate-50 dark:border-slate-800/50
                hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5
                transition-colors duration-100
              "
            >
              {/* Name */}
              <TableCell className="font-semibold text-slate-800 dark:text-slate-100">
                {lead.name}
              </TableCell>

              {/* Instagram handle */}
              <TableCell className="text-indigo-500 dark:text-indigo-400 text-sm font-medium">
                {lead.instagram}
              </TableCell>

              {/* Message — truncated */}
              <TableCell
                className="
                text-slate-500 dark:text-slate-400
                text-sm max-w-45
              "
              >
                {lead.message.length > 45
                  ? lead.message.slice(0, 45) + "..."
                  : lead.message}
              </TableCell>

              {/* Score — number + bar */}
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`text-sm font-bold ${scoreTextColor(lead.score)}`}
                  >
                    {lead.score}
                  </span>
                  {/* Score bar */}
                  <div className="w-14 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-1.5 rounded-full ${scoreBarColor(lead.score)}`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
              </TableCell>

              {/* Tag badge */}
              <TableCell>
                <span
                  className={`
                  text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                  ${tagStyle(lead.tag)}
                `}
                >
                  {lead.tag}
                </span>
              </TableCell>

              {/* Status badge */}
              <TableCell>
                <span
                  className={`
                  text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                  ${statusStyle(lead.status)}
                `}
                >
                  {lead.status}
                </span>
              </TableCell>

              {/* Date */}
              <TableCell className="text-slate-400 dark:text-slate-600 text-sm">
                {formatDate(lead.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
