"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = prefersDark ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

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
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">홈</Link>
            <Link href="/posts" className="text-sm text-muted-foreground hover:underline">글 목록</Link>
            {user && (
              <Link href="/mypage" className="text-sm text-muted-foreground hover:underline">마이페이지</Link>
            )}

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
          <button
            onClick={toggleTheme}
            className="text-sm px-3 py-1 rounded border border-border text-muted-foreground hover:opacity-90"
          >
            {theme === "dark" ? "라이트" : "다크"}
          </button>
        </div>
      </div>
    </nav>
  );
}
