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
