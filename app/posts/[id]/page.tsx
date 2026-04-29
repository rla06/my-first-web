import { notFound } from "next/navigation";
import SketchLayout from "@/components/SketchLayout";
import supabase from "@/lib/supabase";

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();

  // Try to load from Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error || !data) return notFound();

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

  // Fallback content if Supabase not configured
  return (
    <SketchLayout>
      <article className="prose">
        <h1>포스트 {id}</h1>
        <p className="text-muted-foreground">작성자 · 작성일</p>
        <div className="mt-4">
          <p>여기에 글 본문이 출력됩니다. Supabase 연결 후 실제 데이터로 대체됩니다.</p>
        </div>
      </article>
    </SketchLayout>
  );
}
import { posts } from "@/lib/posts";
import PostActions from "@/components/PostActions";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
        <Link href="/posts" className="text-blue-500 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose lg:prose-lg">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{post.author} · {post.date}</p>
        <p className="mb-6">{post.content}</p>
      </article>

      <PostActions id={post.id} />
    </div>
  );
}
