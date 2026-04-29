import Link from "next/link";
import SketchLayout from "@/components/SketchLayout";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PostsPage() {
  const posts = [
    { id: "1", title: "첫 번째 포스트", excerpt: "요약 텍스트" },
    { id: "2", title: "두 번째 포스트", excerpt: "요약 텍스트" },
  ];

  return (
    <SketchLayout>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">글 목록</h1>
          <Button asChild>
            <Link href="/posts/new">새 글 쓰기</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-0">
              <div className="px-4 py-3">
                <CardTitle>
                  <Link href={`/posts/${p.id}`} className="hover:underline">{p.title}</Link>
                </CardTitle>
                <CardDescription>{p.excerpt}</CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SketchLayout>
  );
}
import Link from "next/link";
import { posts } from "@/lib/posts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">블로그</h1>
        <Link href="/posts/new" className="">
          <Button asChild>
            <a>새 글 작성</a>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.author} · {post.date}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">{post.content.slice(0, 120)}{post.content.length>120?"...":""}</p>
            </CardContent>

            <CardAction>
              <Link href={`/posts/${post.id}`}>
                <Button size="sm" asChild>
                  <a>보기</a>
                </Button>
              </Link>
            </CardAction>
          </Card>
        ))}
      </div>
    </div>
  );
}
