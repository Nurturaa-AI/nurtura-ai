// All database queries for leads live here
// Any file that needs leads data imports from here
// This keeps our database logic in one place

import { supabase } from "@/app/lib/supabase";
import { Lead } from "@/app/types/lead";

// Fetch all leads for a tenant ordered by newest first
export async function getLeads(tenantId: string = "default"): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads") // target the leads table
    .select("*") // get all columns
    .eq("tenant_id", tenantId) // only this tenant's leads
    .order("created_at", { ascending: false }); // newest first

  // Edge case: if something went wrong, log it and return empty array
  // We return [] instead of throwing so the dashboard still loads
  if (error) {
    console.error("Error fetching leads:", error.message);
    return [];
  }

  // Edge case: if data is null return empty array
  // Supabase returns null when there are no rows
  return data ?? [];
}

// Insert a new lead into the database
// We use this when a new Instagram DM comes in
export async function createLead(lead: {
  tenant_id?: string;
  name?: string;
  instagram?: string;
  message: string;
  score?: number;
  tag?: Lead["tag"];
  status?: Lead["status"];
  raw_payload?: object;
}): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead) // insert the new lead
    .select() // return the inserted row
    .single(); // we only inserted one row so return single object

  if (error) {
    console.error("Error creating lead:", error.message);
    return null;
  }

  return data;
}

// Update a lead's status
// We use this when you mark a lead as contacted or booked
export async function updateLeadStatus(
  id: string,
  status: Lead["status"],
): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .update({ status }) // update only the status field
    .eq("id", id); // only the lead with this id

  if (error) {
    console.error("Error updating lead status:", error.message);
    return false;
  }

  // Return true to signal success
  return true;
}

// Update a lead's score and tag after AI qualification
export async function updateLeadScore(
  id: string,
  score: number,
  tag: Lead["tag"],
): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .update({ score, tag })
    .eq("id", id);

  if (error) {
    console.error("Error updating lead score:", error.message);
    return false;
  }

  return true;
}
