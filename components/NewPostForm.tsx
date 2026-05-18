"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase/client";

export default function NewPostForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력하세요.");
      return;
    }

    setSaving(true);
    try {
      const { data, error: supaError } = await supabase
        .from("posts")
        .insert([{ title: title.trim(), content: content.trim(), user_id: user.id }])
        .select("id")
        .single();

      if (supaError || !data) {
        setError(supaError?.message ?? "저장에 실패했습니다.");
        setSaving(false);
        return;
      }

      // 성공하면 새 글 상세로 이동
      router.push(`/posts/${data.id}`);
    } catch (err: any) {
      setError(err?.message ?? "게시 중 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">제목</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">본문</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base placeholder:text-muted-foreground"
          rows={10}
          placeholder="내용을 입력하세요"
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "게시 중..." : "게시"}
        </Button>
        <Button variant="outline" asChild>
          <a href="/posts">취소</a>
        </Button>
      </div>
    </form>
  );
}
