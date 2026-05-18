"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// NOTE: This component performs client-side ownership checks for UX only.
// Actual authorization must be enforced via RLS policies (Ch11).

export default function EditPostForm({ id }: { id: string }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, user_id")
          .eq("id", id)
          .single();
        if (!mounted) return;
        if (error || !data) {
          setError("게시글을 불러올 수 없습니다.");
          setLoadingPost(false);
          return;
        }
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setAuthorId(data.user_id ?? null);
      } catch (e) {
        if (!mounted) return;
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (mounted) setLoadingPost(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loadingPost) return <div className="p-6">로딩...</div>;

  if (!user) return <div className="p-6">로그인이 필요합니다.</div>;

  if (!authorId || user.id !== authorId) return <div className="p-6">편집 권한이 없습니다.</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력하세요.");
      return;
    }
    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = (sessionData as any)?.session;
      const token = session?.access_token;
      if (!token) {
        setError("세션이 유효하지 않습니다. 다시 로그인해 주세요.");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const result = await res.json().catch(() => null);
      if (!res.ok) {
        setError(result?.error ?? "저장에 실패했습니다.");
        setSaving(false);
        return;
      }

      router.push(`/posts/${id}`);
    } catch (e: any) {
      setError(e?.message ?? "저장 중 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">제목</label>
        <Input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} placeholder="제목을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">본문</label>
        <textarea
          value={content}
          onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base placeholder:text-muted-foreground"
          rows={10}
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
        <Button variant="outline" asChild>
          <a href={`/posts/${id}`}>취소</a>
        </Button>
      </div>
    </form>
  );
}
