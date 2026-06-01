"use client"

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type CommentRow = {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string | null;
  author_name: string | null;
  content: string;
  created_at: string;
  profiles?: { username: string | null } | { username: string | null }[] | null;
};

type Props = {
  postId: string;
  initialComments: CommentRow[];
  initialCount: number;
};

export default function CommentsThread({ postId, initialComments, initialCount }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [commentCount, setCommentCount] = useState(initialCount);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, CommentRow[]>();
    for (const comment of comments) {
      const key = comment.parent_id ?? "root";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(comment);
    }
    for (const [key, list] of map.entries()) {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      map.set(key, list);
    }
    return map;
  }, [comments]);

  const collectDescendantIds = (rootId: string, list: CommentRow[]) => {
    const ids = new Set<string>();
    const stack = [rootId];

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!currentId || ids.has(currentId)) continue;
      ids.add(currentId);

      for (const item of list) {
        if (item.parent_id === currentId) {
          stack.push(item.id);
        }
      }
    }

    return ids;
  };

  const submitComment = async (parentId: string | null, value: string) => {
    setError(null);
    if (!value.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    if (!user && !authorName.trim()) {
      setError("익명 댓글은 이름이 필요합니다.");
      return;
    }

    setSubmitting(true);
    const payload = {
      post_id: postId,
      parent_id: parentId,
      author_id: user?.id ?? null,
      author_name: user ? null : authorName.trim(),
      content: value.trim(),
    };

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert([payload])
      .select("id, post_id, parent_id, author_id, author_name, content, created_at, profiles(username)")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    const next = data as unknown as CommentRow;
    setComments((prev) => [...prev, next]);
    setCommentCount((prev) => prev + 1);
    setContent("");
    setReplyContent("");
    setReplyTo(null);
    setSubmitting(false);
  };

  const startEdit = (comment: CommentRow) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
    setError(null);
  };

  const handleUpdate = async (commentId: string) => {
    const nextContent = editingContent.trim();
    if (!nextContent) {
      setError("수정할 내용을 입력해주세요.");
      return;
    }

    setSavingId(commentId);
    const { error: updateError } = await supabase
      .from("comments")
      .update({ content: nextContent })
      .eq("id", commentId);

    if (updateError) {
      setError(updateError.message);
      setSavingId(null);
      return;
    }

    setComments((prev) => prev.map((comment) => (
      comment.id === commentId ? { ...comment, content: nextContent } : comment
    )));
    setEditingId(null);
    setEditingContent("");
    setSavingId(null);
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setComments((prev) => {
      const idsToRemove = collectDescendantIds(commentId, prev);
      setCommentCount((count) => Math.max(0, count - idsToRemove.size));
      return prev.filter((comment) => !idsToRemove.has(comment.id));
    });

    if (editingId === commentId) {
      setEditingId(null);
      setEditingContent("");
    }
    setDeletingId(null);
  };

  const renderComments = (parentId: string | null, depth = 0) => {
    const key = parentId ?? "root";
    const list = grouped.get(key) ?? [];
    if (list.length === 0) return null;

    return (
      <div className={depth === 0 ? "space-y-4" : "space-y-3 ml-4 border-l border-border pl-4"}>
        {list.map((comment) => {
          const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
          const name = profile?.username || comment.author_name || "익명";
          const isReplying = replyTo === comment.id;
          const canManage = !!user && !!comment.author_id && comment.author_id === user.id;
          const isEditing = editingId === comment.id;

          return (
            <div key={comment.id} className="rounded-md border border-border bg-card p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{name}</span>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleUpdate(comment.id)} disabled={savingId === comment.id}>
                      {savingId === comment.id ? "저장 중..." : "저장"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditingContent("");
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setReplyTo(isReplying ? null : comment.id)}>
                  답글
                </Button>
                {canManage && !isEditing && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(comment)}>
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                    >
                      {deletingId === comment.id ? "삭제 중..." : "삭제"}
                    </Button>
                  </>
                )}
              </div>

              {isReplying && (
                <div className="mt-3 space-y-2">
                  {!user && (
                    <Input
                      placeholder="이름"
                      value={authorName}
                      onChange={(event) => setAuthorName(event.target.value)}
                    />
                  )}
                  <textarea
                    className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="답글을 입력하세요"
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => submitComment(comment.id, replyContent)}
                      disabled={submitting}
                    >
                      {submitting ? "등록 중..." : "답글 등록"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                      취소
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4">{renderComments(comment.id, depth + 1)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">댓글 ({commentCount})</h2>
      </div>

      <div className="mt-4 space-y-3 rounded-md border border-border bg-card p-4">
        {!user && (
          <Input
            placeholder="이름"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
          />
        )}
        <textarea
          className="min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <Button onClick={() => submitComment(null, content)} disabled={submitting}>
            {submitting ? "등록 중..." : "댓글 등록"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 댓글이 없습니다.</p>
        ) : (
          renderComments(null)
        )}
      </div>
    </section>
  );
}
