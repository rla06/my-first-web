import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SketchLayout from "@/components/SketchLayout";

export default async function PostsPage() {
  let data: any[] | null = null;
  let error: any = null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = await cookies();
  const supabase = url && anonKey
    ? createServerClient(url, anonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      })
    : null;

  try {
    if (!supabase) throw new Error("Supabase not configured");
    const res = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id")
      .order("created_at", { ascending: false });
    data = res.data;
    error = res.error;
  } catch (e) {
    error = e;
  }

  return (
    <SketchLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">블로그</h1>
          <Button asChild>
            <Link href="/posts/new">새 글 작성</Link>
          </Button>
        </div>

        {Boolean(error) && <div className="text-sm text-destructive">목록을 불러오는 중 오류가 발생했습니다. {String(error)}</div>}

        {!Boolean(error) && data && data.length === 0 && <div className="text-sm text-muted-foreground">게시물이 없습니다.</div>}

        {!Boolean(error) && !data && <div className="text-sm text-muted-foreground">로딩...</div>}

        {!Boolean(error) && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((post: any) => (
              <Card key={post.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.user_id} · {post.created_at}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">{(post.content || "").slice(0, 120)}{(post.content || "").length>120?"...":""}</p>
                </CardContent>

                <CardAction>
                  <Button size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>보기</Link>
                  </Button>
                </CardAction>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SketchLayout>
  );
}
