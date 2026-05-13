# Project Agent Rules (Ch9 Supabase Auth 기준)

- 라우터: Next.js App Router 사용. `next/router` 또는 `pages/` 기반 라우터 사용 금지.
- 인증: 이메일/비밀번호 방식만 사용한다. Supabase Auth의 `signInWithPassword`를 사용한다.
- 소셜 로그인: 추가하지 않는다.
- 보호 라우트: `middleware.ts`로 구현한다 (서버 사이드 리디렉션/접근 제어).
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 사용한다. 서비스 역할 키는 서버 전용으로 관리한다.
- 패키지 버전(교재 기준):
  - Next.js 16.2.1
  - @supabase/supabase-js 2.47.12
  - @supabase/ssr 0.5.2
- 문서화: 교재 기준과 현재 설치된 `package.json` 버전을 함께 표기하라. 실제 프로젝트 상태와 충돌할 수 있는 변경은 삭제하지 말고 "교재 기준" / "현재 설치 기준"으로 병기하라.
- 보안: 절대로 `service_role` 키를 클라이언트 코드나 `.env.local`의 `NEXT_PUBLIC_` 접두사가 붙은 변수로 노출하지 마라.
- 컴포넌트 규칙: Server Components 우선, 브라우저 API/상호작용이 필요한 컴포넌트만 `"use client"` 추가.
