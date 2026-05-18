import Link from "next/link";
import SketchLayout from "@/components/SketchLayout";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  const samplePosts = [
    { id: "1", title: "첫 번째 포스트", excerpt: "간단한 소개글입니다." },
    { id: "2", title: "두 번째 포스트", excerpt: "두 번째 글 내용 요약입니다." },
  ];

  return (
    <SketchLayout>
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">최근 글</h1>
        </header>

        <section className="grid gap-4">
          {samplePosts.map((p) => (
            <Card key={p.id} className="p-0">
              <div className="px-4 py-3">
                <CardTitle>
                  <Link href={`/posts/${p.id}`} className="hover:underline">
                    {p.title}
                  </Link>
                </CardTitle>
                <CardDescription>{p.excerpt}</CardDescription>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </SketchLayout>
  );
}
  // `HomePage` is the default export; removed duplicate `Page` default export.
