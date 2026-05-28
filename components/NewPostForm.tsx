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
  const [formError, setFormError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setTitleError(null);
    setContentError(null);
    if (!user) {
      setFormError("로그인이 필요합니다.");
      return;
    }
    const nextTitle = title.trim();
    const nextContent = content.trim();
    let hasError = false;
    if (nextTitle.length < 2) {
      setTitleError("제목은 2자 이상 입력해 주세요.");
      hasError = true;
    }
    if (nextContent.length < 10) {
      setContentError("내용은 10자 이상 입력해 주세요.");
      hasError = true;
    }
    if (hasError) return;

    setSaving(true);
    try {
      // 1. Supabase client insert with RLS (requires user_id)
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert([{ title: nextTitle, content: nextContent, user_id: user.id }])
        .select()
        .single();

      if (insertError) {
        console.error("Failed to create post", insertError);
        throw new Error("게시글을 저장할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      }

      if (!data?.id) {
        throw new Error("생성된 글의 ID를 확인할 수 없습니다.");
      }

      // 성공하면 새 글 상세로 이동
      router.push(`/posts/${data.id}`);
    } catch (err: any) {
      console.error("Failed to create post", err);
      setFormError("게시글 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">제목</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" />
        {titleError && <div className="text-xs text-destructive mt-1">{titleError}</div>}
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
        {contentError && <div className="text-xs text-destructive mt-1">{contentError}</div>}
      </div>

      {formError && <div className="text-sm text-destructive">{formError}</div>}

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
