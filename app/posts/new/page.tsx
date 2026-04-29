import SketchLayout from "@/components/SketchLayout";
import NewPostForm from "@/components/NewPostForm";

export default function NewPostPage() {
  return (
    <SketchLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-4">새 글 작성</h1>
        <div className="p-4 border rounded-md bg-card">
          <NewPostForm />
        </div>
      </div>
    </SketchLayout>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("저장되었습니다");
    router.push("/posts");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">새 글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-input px-3 py-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <Button type="submit">저장</Button>
          <Button variant="ghost" onClick={() => router.push("/posts")}>취소</Button>
        </div>
      </form>
    </div>
  );
}
