import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SketchLayout from "@/components/SketchLayout";
import LikeButton from "@/components/LikeButton";

type SearchParams = {
  q?: string;
  sort?: string;
};

export default async function PostsPage({ searchParams }: { searchParams?: SearchParams }) {
  let posts: any[] = [];
  const searchQuery = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const sort = searchParams?.sort === "views" ? "views" : "latest";

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
    const selectFields = "id, title, content, created_at, user_id, view_count, profiles(username), comments(count), post_likes(count)";

    let query = supabase
      .from("posts")
      .select(selectFields);

    if (searchQuery) {
      const like = `%${searchQuery}%`;
      query = query.or(`title.ilike.${like},content.ilike.${like}`);
    }

    if (sort === "views") {
      query = query.order("view_count", { ascending: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    posts = data ?? [];
  } catch (e) {
    console.error("Failed to load posts list", e);
    throw new Error("게시글 목록을 불러오는 중 문제가 발생했습니다.");
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

        <form className="flex flex-col gap-3 md:flex-row md:items-center mb-6" method="get">
          <div className="flex-1">
            <Input
              name="q"
              placeholder="게시글 검색 (제목/내용/작성자)"
              defaultValue={searchQuery}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              name="sort"
              defaultValue={sort}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
            </select>
            <Button type="submit">검색</Button>
          </div>
        </form>

        {posts.length === 0 && (
          <div className="text-sm text-muted-foreground">게시물이 없습니다.</div>
        )}

        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <Card key={post.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {(post.profiles?.username || "익명")} · {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {(post.content || "").slice(0, 120)}{(post.content || "").length > 120 ? "..." : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>조회 {post.view_count ?? 0}</span>
                    <span>좋아요 {post.post_likes?.[0]?.count ?? 0}</span>
                    <span>댓글 {post.comments?.[0]?.count ?? 0}</span>
                  </div>
                </CardContent>

                <div className="px-4 pb-4 flex items-center justify-between">
                  <LikeButton postId={post.id} initialCount={post.post_likes?.[0]?.count ?? 0} size="sm" />
                  <Button size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>보기</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SketchLayout>
  );
}
