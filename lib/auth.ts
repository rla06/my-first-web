import supabase from "./supabase/client";

export async function signInWithEmail(email: string, password: string) {
  // Uses supabase.auth.signInWithPassword (v2 API)
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  // Uses supabase.auth.signUp (v2 API) with user metadata for name
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : undefined,
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
