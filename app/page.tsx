import Link from "next/link";
import SketchLayout from "@/components/SketchLayout";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type HomePost = {
  id: string;
  title: string;
  content: string;
};

export default async function HomePage() {
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

  let posts: HomePost[] = [];
  let loadError: string | null = null;

  try {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(2);
    if (error) throw error;
    posts = (data ?? []) as HomePost[];
  } catch (e: any) {
    loadError = e?.message ?? "최근 글을 불러오는 중 오류가 발생했습니다.";
  }

  return (
    <SketchLayout>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">최근 글</h1>
        </header>

        {loadError && <div className="text-sm text-destructive">{loadError}</div>}

        {!loadError && posts.length === 0 && (
          <div className="text-sm text-muted-foreground">최근 글이 없습니다.</div>
        )}

        {!loadError && posts.length > 0 && (
          <section className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-0">
                <div className="px-4 py-3">
                  <CardTitle>
                    <Link href={`/posts/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{(post.content || "").slice(0, 80)}</CardDescription>
                </div>
              </Card>
            ))}
          </section>
        )}
      </div>
    </SketchLayout>
  );
}
  // `HomePage` is the default export; removed duplicate `Page` default export.
