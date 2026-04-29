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
