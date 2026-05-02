// Fake leads we use to build and test the dashboard
// We replace this with real Supabase data later

import { Lead } from "@/app/types/lead";

// This is an array (list) of leads
// Each one follows the exact Lead type we defined
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Amara Okafor",
    instagram: "@amaracreates",
    message: "Hi, how much do your services cost?",
    score: 87,
    tag: "hot",
    status: "new",
    created_at: "2026-05-01T10:30:00Z",
  },
  {
    id: "2",
    name: "James Adeyemi",
    instagram: "@jamesdigital",
    message: "Love your content! Do you offer one on one coaching?",
    score: 72,
    tag: "warm",
    status: "contacted",
    created_at: "2026-05-01T11:15:00Z",
  },
  {
    id: "3",
    name: "Fatima Bello",
    instagram: "@fatima.bello",
    message: "Nice post!",
    score: 18,
    tag: "cold",
    status: "new",
    created_at: "2026-05-01T12:00:00Z",
  },
  {
    id: "4",
    name: "Chidi Mensah",
    instagram: "@chidimensah",
    message: "Can we jump on a call this week?",
    score: 95,
    tag: "hot",
    status: "booked",
    created_at: "2026-05-01T13:45:00Z",
  },
  {
    id: "5",
    name: "Ngozi Williams",
    instagram: "@ngoziwilliams_",
    message: "What packages do you have available?",
    score: 65,
    tag: "warm",
    status: "new",
    created_at: "2026-05-01T14:20:00Z",
  },
];
