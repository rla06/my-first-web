import { NextRequest, NextResponse } from "next/server";
import type { NextFetchEvent } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

  // createServerClient는 요청/응답을 전달해 현재 세션을 조회할 수 있게 함
  const supabase = createServerClient({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    // Next middleware에서는 Request/Response 객체를 넣어 세션을 읽도록 지원하는 구현을 사용
    // @supabase/ssr의 구현에 따라 옵션 이름이 다를 수 있으나 교재/실습 기준으로 req/res를 전달합니다.
    req: req as unknown as Request,
    res: res as unknown as Response,
  } as any);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // 비로그인 사용자는 로그인 페이지로 리디렉션
      const loginUrl = new URL("/login", req.url);
      // 원래 방문 경로를 쿼리로 전달하면 로그인 후 리다이렉트 가능
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  } catch (e) {
    // 인증 조회 중 에러가 나면 기본 동작(차단하지 않음)
    console.error("middleware supabase auth error", e);
    return res;
  }

  return res;
}
