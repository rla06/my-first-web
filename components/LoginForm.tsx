"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res: any = await signInWithEmail(email, password);
      const err = res?.error;
      if (err) {
        setError(err.message || String(err));
        setLoading(false);
        return;
      }

      // 로그인 성공 시 /posts 로 이동
      router.push("/posts");
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">이메일</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">비밀번호</label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" type="password" required />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "로그인 중..." : "로그인"}</Button>
      </div>
    </form>
  );
}
