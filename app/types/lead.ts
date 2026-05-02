// This describes exactly what one lead looks like
// Every lead in Nurtura AI must have all these fields

export type Lead = {
  id: string; // unique identifier for each lead
  name: string; // the lead's name
  instagram: string; // their instagram handle e.g. @johndoe
  message: string; // the first message they sent
  score: number; // AI score from 0 to 100
  tag: "hot" | "warm" | "cold"; // only these three values allowed
  status: "new" | "contacted" | "booked" | "closed"; // where they are in the pipeline
  created_at: string; // when they first reached out
};
