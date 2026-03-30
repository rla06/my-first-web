export default function Home() {
  const posts = [
    {
      title: "첫 번째 글 — 블로그 시작",
      excerpt: "이 블로그는 개인 기록과 학습 노트를 위한 공간입니다.",
      author: "홍길동",
      date: "2026-03-25",
    },
    {
      title: "데이터 분석 기초",
      excerpt: "공공인재빅데이터융합학 전공자를 위한 기초 정리.",
      author: "홍길동",
      date: "2026-03-20",
    },
    {
      title: "타입스크립트 시작하기",
      excerpt: "타입 안정성을 높이는 방법과 기본 패턴 소개.",
      author: "홍길동",
      date: "2026-03-10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">내 블로그</h1>
          <nav>
            <ul className="flex gap-4">
              <li><a href="#" className="text-sm text-gray-600">홈</a></li>
              <li><a href="#" className="text-sm text-gray-600">소개</a></li>
              <li><a href="#" className="text-sm text-gray-600">연락</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="space-y-6">
        {posts.map((post) => (
          <article key={post.title} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <p className="text-sm text-gray-400">작성일: {post.date} · 작성자: {post.author}</p>
          </article>
        ))}
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 내 블로그</p>
      </footer>
    </div>
  );
}
