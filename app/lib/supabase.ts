// This file creates one single Supabase client
// We create it once here and import it everywhere else
// This avoids creating multiple connections to the database

import { createClient } from "@supabase/supabase-js";

// We read the keys from .env.local
// process.env gives us access to environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// The ! at the end tells TypeScript "trust me, this value exists"
// Without it TypeScript would complain it might be undefined

// Edge case: warn us immediately if keys are missing
// This saves us from mysterious errors later
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
      "Check your .env.local file has NEXT_PUBLIC_SUPABASE_URL " +
      "and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

// Create and export the client
// Every file that needs the database imports this
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
