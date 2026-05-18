"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function PostActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NOTE: Showing/hiding these buttons is a client-side UX convenience only.
  // Do NOT treat this as authorization — enforce permissions with RLS (Ch11).

  const handleDelete = async () => {
    setErrorMsg(null);
    if (deleting) return;
    setDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = (sessionData as any)?.session;
      const token = session?.access_token;
      if (!token) {
        setErrorMsg("세션이 유효하지 않습니다. 다시 로그인해 주세요.");
        setDeleting(false);
        return;
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(body?.error ?? "삭제에 실패했습니다.");
        setDeleting(false);
        return;
      }
      router.push("/posts");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "삭제 중 오류가 발생했습니다.");
      setDeleting(false);
    }
  };

  return (
    <div className="mt-6 flex items-center space-x-3">
      <Button variant="outline" onClick={() => router.push("/posts")}>목록으로</Button>
      <Button variant="secondary" onClick={() => router.push(`/posts/${id}/edit`)}>수정</Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={deleting}>삭제</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>정말 이 게시글을 삭제하시겠습니까? 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>

          {errorMsg && <div className="text-sm text-destructive mb-2">{errorMsg}</div>}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "삭제 중..." : "삭제"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
