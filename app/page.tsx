// Main dashboard page
// Now fetches real leads from Supabase instead of mock data

// This makes the page a server component
// Server components can fetch data directly without useEffect
// They run on the server so the data is ready before the page loads

import StatsCards from "@/app/components/stats-cards";
import LeadsTable from "@/app/components/leads-table";
import { getLeads } from "@/app/lib/leads";

export default async function Home() {
  // Fetch real leads from Supabase
  // Because this is a server component we can use async/await directly
  // No useEffect or useState needed
  const leads = await getLeads();

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-transparent">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lead Dashboard
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            All incoming Instagram leads in one place
          </p>
        </div>

        {/* Live indicator */}
        <div
          className="
          flex items-center gap-2 text-xs font-medium
          bg-indigo-50 dark:bg-indigo-500/10
          text-indigo-600 dark:text-indigo-400
          border border-indigo-100 dark:border-indigo-500/20
          px-3 py-1.5 rounded-full
        "
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          Listening for leads
        </div>
      </div>

      {/* Stats — now uses real data */}
      <StatsCards leads={leads} />

      {/* Table section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Recent Leads
          </h2>
          <span
            className="
            text-xs font-medium
            text-slate-500 dark:text-slate-400
            bg-slate-100 dark:bg-white/5
            border border-slate-200 dark:border-white/10
            px-3 py-1 rounded-full
          "
          >
            {leads.length} total
          </span>
        </div>

        {/* LeadsTable now receives real leads from Supabase */}
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
