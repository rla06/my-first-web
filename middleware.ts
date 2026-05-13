import { NextRequest, NextResponse } from "next/server";
import type { NextFetchEvent } from "next/server";

// 보호할 경로는 matcher로도 지정
export const config = {
  // 보호할 경로들: 현재 프로젝트에 존재하는 `/posts/new`만 매칭합니다.
  matcher: ["/posts/new"],
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // 환경변수 누락 시 기본 동작(차단하지 않음)
    return res;
  }

  // Simple cookie-based check for Supabase session tokens in middleware environment.
  // @supabase/ssr createServerClient signature varies by version and may not work here,
  // so we conservatively check cookies that Supabase sets for client sessions.
  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;
  const supabaseAuth = req.cookies.get("supabase-auth-token")?.value;

  if (!accessToken && !refreshToken && !supabaseAuth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
