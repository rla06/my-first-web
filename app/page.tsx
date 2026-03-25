export default function Home() {
  const posts = [
    {
      title: "첫 번째 글 — 블로그 시작",
      excerpt: "이 블로그는 개인 기록과 학습 노트를 위한 공간입니다.",
      date: "2026-03-25",
    },
    {
      title: "데이터 분석 기초",
      excerpt: "공공인재빅데이터융합학 전공자를 위한 기초 정리.",
      date: "2026-03-20",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">홍길동의 블로그</h1>
          <p className="text-sm text-gray-500">공공인재빅데이터 · 기록과 생각</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-6">
          {posts.map((post) => (
            <article key={post.title} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{post.date}</p>
              <p className="text-gray-700">{post.excerpt}</p>
              <div className="mt-4">
                <a className="text-blue-600 hover:underline" href="#">
                  계속 읽기 →
                </a>
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">홍길동</h3>
            <p className="text-gray-600 mb-1">하이대</p>
            <p className="text-gray-600 mb-3">공공인재빅데이터</p>
            <p className="text-gray-700">취미: 영화시청</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-2">카테고리</h4>
            <ul className="text-gray-600 space-y-1">
              <li>학습 노트</li>
              <li>프로젝트</li>
              <li>일상</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} 홍길동
      </footer>
    </div>
  );
}
