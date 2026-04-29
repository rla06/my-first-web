import Link from "next/link";

export default function Header() {
  return (
    <nav style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold">내 블로그</Link>
        <div className="space-x-4">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">홈</Link>
          <Link href="/posts" className="text-sm text-muted-foreground hover:underline">글 목록</Link>
          <Link href="/posts/new" className="text-sm text-muted-foreground hover:underline">새 글 쓰기</Link>
        </div>
      </div>
    </nav>
  );
}
