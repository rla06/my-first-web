import { notFound } from "next/navigation";
import SketchLayout from "@/components/SketchLayout";
import supabase from "@/lib/supabase";
import { posts } from "@/lib/posts";
import PostActions from "@/components/PostActions";
import Link from "next/link";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();

  // Try to load from Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (!error && data) {
        return (
          <SketchLayout>
            <article className="prose">
              <h1>{data.title}</h1>
              <p className="text-muted-foreground">작성자 · 작성일</p>
              <div className="mt-4" dangerouslySetInnerHTML={{ __html: data.content }} />
            </article>
          </SketchLayout>
        );
      }
    } catch (e) {
      // ignore and fallback
    }
  }

  // Fallback to local posts
  const post = posts.find((p) => p.id === Number(id));
  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose lg:prose-lg">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{post.author} · {post.date}</p>
        <p className="mb-6">{post.content}</p>
      </article>

      <PostActions id={post.id} />
      <div className="mt-4">
        <Link href="/posts">목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
