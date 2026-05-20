"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/auth";
import supabase from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res: any = await signUpWithEmail(email, password, name);
      const err = res?.error;
      if (err) {
        setError(err.message || String(err));
        setLoading(false);
        return;
      }

      // Try to create a profile row for the new user (if user id is available).
      // This helps avoid foreign-key conflicts when inserting posts later.
      try {
        const userId = res?.data?.user?.id;
        if (userId) {
          const { data: sessionData } = await supabase.auth.getSession();
          const session = (sessionData as any)?.session;
          const token = session?.access_token;
          if (token) {
            await fetch("/api/profiles", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id: userId, username: name }),
            });
          }
        }
      } catch (e) {
        // ignore — profile creation is best-effort here
      }

      // 성공 처리: 가입 완료 메시지 표시 후 로그인 페이지로 이동
      setMessage("가입 완료. 로그인하세요.");
      router.push("/login");
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">이름</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">이메일</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">비밀번호</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" type="password" required />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}
        {message && <div className="text-sm text-success">{message}</div>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? "가입 중..." : "회원가입"}</Button>
        </div>
      </form>
    </div>
  );
}
