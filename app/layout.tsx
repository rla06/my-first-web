import "./globals.css";
import Link from "next/link";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        <nav className="bg-gray-800 text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold">내 블로그</Link>
            <div className="space-x-4">
              <Link href="/" className="text-sm text-gray-200 hover:text-white hover:underline">홈</Link>
              <Link href="/posts" className="text-sm text-gray-200 hover:text-white hover:underline">블로그</Link>
              <Link href="/posts/new" className="text-sm text-gray-200 hover:text-white hover:underline">새 글 쓰기</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
        <footer className="text-center text-gray-500 py-4">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
