"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export default function PostActions({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = () => {
    // 실제 삭제 로직이 있다면 여기 호출
    alert("삭제되었습니다");
    router.push("/posts");
  };

  return (
    <div className="mt-6 flex items-center space-x-3">
      <Button variant="outline" onClick={() => router.push("/posts")}>목록으로</Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">삭제</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>정말 이 게시글을 삭제하시겠습니까? 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
