import supabase from "./supabase/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  // If NEXT_PUBLIC_SITE_URL is set, include it so confirmation emails redirect to production
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : undefined,
      emailRedirectTo: SITE_URL ? `${SITE_URL}/login` : undefined,
    },
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export default {
  signInWithEmail,
  signUpWithEmail,
  signOut,
};
