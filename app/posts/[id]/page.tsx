import { notFound } from "next/navigation";
import SketchLayout from "@/components/SketchLayout";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import PostOwnerActions from "@/components/PostOwnerActions";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();

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

  // Load the post from Supabase by id
  try {
    if (!supabase) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-sm text-destructive">Supabase 환경변수가 설정되지 않았습니다.</div>
        </div>
      );
    }
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id")
      .eq("id", id)
      .single();

    if (error) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-sm text-destructive">게시글을 불러오는 중 오류가 발생했습니다: {error.message}</div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-sm text-muted-foreground">게시글을 찾을 수 없습니다. ID: {id}</div>
        </div>
      );
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

        <div className="mt-4">
          <Link href="/posts">목록으로 돌아가기</Link>
        </div>
      </div>
    );
  } catch (e) {
    return notFound();
  }
}
