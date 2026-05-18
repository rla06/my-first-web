"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase/client";
import { signInWithEmail, signUpWithEmail, signOut as authSignOut } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 초기 사용자 확인
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setUser(null);
      setLoading(false);
    });

    // 로그인/로그아웃 상태 변화 리스너
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      // 구독 해제
      try {
        listener?.subscription.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  async function handleSignIn(email: string, password: string) {
    return await signInWithEmail(email, password);
  }

  async function handleSignUp(email: string, password: string, name?: string) {
    return await signUpWithEmail(email, password, name);
  }

  async function handleSignOut() {
    const res = await authSignOut();
    setUser(null);
    return res;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail: handleSignIn, signUpWithEmail: handleSignUp, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
