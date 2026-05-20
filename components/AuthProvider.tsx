"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabaseClient from "@/lib/supabaseClient";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const s = supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      const uid = data.session?.user?.id;
      if (uid) {
        void (async () => {
          try {
            const { data: s } = await supabaseClient.auth.getSession();
            const token = (s as any)?.session?.access_token;
            if (!token) return;
            await fetch("/api/profiles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: uid, username: data.session?.user?.email ?? undefined }),
            });
          } catch (e) {
            // ignore
          }
        })();
      }
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      const uid = newSession?.user?.id;
      if (uid) {
        void (async () => {
          try {
            const { data: s } = await supabaseClient.auth.getSession();
            const token = (s as any)?.session?.access_token;
            if (!token) return;
            await fetch("/api/profiles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: uid, username: newSession?.user?.email ?? undefined }),
            });
          } catch (e) {
            // ignore
          }
        })();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabaseClient.auth.signOut();
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, signOut }}>{children}</AuthContext.Provider>
  );
}
