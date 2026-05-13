import supabase from "./supabase/client";

// Re-export the browser/server-aware supabase client from lib/supabase/client.ts
export const supabaseClient = supabase;
export default supabaseClient;
