"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
      router.push("/");
    } catch (e) {
      console.error("signOut error", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <nav style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold">내 블로그</Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">홈</Link>
          <Link href="/posts" className="text-sm text-muted-foreground hover:underline">글 목록</Link>

          {user ? (
            <>
              <Link href="/posts/new" className="text-sm text-muted-foreground hover:underline">새 글 쓰기</Link>
              <button
                onClick={handleSignOut}
                disabled={loading || busy}
                className="text-sm px-3 py-1 rounded bg-muted hover:opacity-90 disabled:opacity-50"
              >
                {loading || busy ? '로딩...' : '로그아웃'}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted-foreground hover:underline">로그인</Link>
              <Link href="/signup" className="text-sm text-muted-foreground hover:underline">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
