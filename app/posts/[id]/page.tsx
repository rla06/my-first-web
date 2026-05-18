import { notFound } from "next/navigation";
import SketchLayout from "@/components/SketchLayout";
import supabase from "@/lib/supabase";
import Link from "next/link";
import PostOwnerActions from "@/components/PostOwnerActions";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();

  // Load the post from Supabase by id
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id")
      .eq("id", id)
      .single();

    if (error || !data) return notFound();

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
