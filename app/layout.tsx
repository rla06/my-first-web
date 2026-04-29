import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import AuthProvider from "@/components/AuthProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <footer className="text-center text-muted-foreground py-4">© 2026 내 블로그</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
