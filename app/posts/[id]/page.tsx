import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PostOwnerActions from "@/components/PostOwnerActions";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;
  if (!id) notFound();

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

  if (!supabase) {
    console.error("Supabase not configured");
    throw new Error("게시글을 불러오는 중 문제가 발생했습니다.");
  }

  let data: { id: string; title: string; content: string; created_at: string; user_id: string } | null = null;
  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!post) return notFound();
    data = post;
  } catch (e) {
    console.error("Failed to load post", e);
    throw new Error("게시글을 불러오는 중 문제가 발생했습니다.");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose lg:prose-lg">
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{data.user_id} · {new Date(data.created_at).toLocaleString()}</p>
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: data.content }} />
      </article>

      {/* UI: only show owner actions for the post's author. Actual authorization is enforced by RLS (Ch11). */}
      <PostOwnerActions authorId={data.user_id} postId={data.id} />

    </div>
  );
}

export const dynamic = "force-dynamic";
