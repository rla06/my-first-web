import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PostOwnerActions from "@/components/PostOwnerActions";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import CommentsThread from "@/components/CommentsThread";

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

  let data: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    view_count: number | null;
    post_likes?: { count: number }[];
    comments?: { count: number }[];
    profiles?: { username: string | null } | { username: string | null }[] | null;
  } | null = null;
  let comments: any[] = [];

  try {
    const { error: viewError } = await supabase.rpc("increment_post_view", {
      p_post_id: id,
    });
    if (viewError) {
      console.error("Failed to increment view count", viewError);
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id, view_count, post_likes(count), comments(count), profiles(username)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!post) return notFound();
    data = post;

    const { data: commentRows, error: commentsError } = await supabase
      .from("comments")
      .select("id, post_id, parent_id, author_id, author_name, content, created_at, profiles(username)")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (commentsError) throw commentsError;
    comments = commentRows ?? [];
  } catch (e) {
    console.error("Failed to load post", e);
    throw new Error("게시글을 불러오는 중 문제가 발생했습니다.");
  }

  const likeCount = data.post_likes?.[0]?.count ?? 0;
  const commentCount = data.comments?.[0]?.count ?? 0;
  const viewCount = data.view_count ?? 0;
  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
  const authorName = profile?.username || "익명";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose lg:prose-lg">
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <p className="text-sm text-muted-foreground mb-3">{authorName} · {new Date(data.created_at).toLocaleString()}</p>
        <div className="mb-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>조회 {viewCount}</span>
          <span>좋아요 {likeCount}</span>
          <span>댓글 {commentCount}</span>
        </div>
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: data.content }} />
      </article>

      {/* UI: only show owner actions for the post's author. Actual authorization is enforced by RLS (Ch11). */}
      <PostOwnerActions authorId={data.user_id} postId={data.id} />

      <div className="mt-4">
        <LikeButton postId={data.id} initialCount={likeCount} />
      </div>

      <div className="mt-8">
        <CommentsThread postId={data.id} initialComments={comments} initialCount={commentCount} />
      </div>

    </div>
  );
}

export const dynamic = "force-dynamic";
