# Project Agent Rules

기본 규칙 (Ch7 기준):

- App Router만 사용합니다 (`app/` 디렉토리). `pages/` 또는 `next/router` 사용 금지.
- Server Components를 기본으로 사용하며, 폼/로컬 상태/브라우저 API가 필요한 경우에만 `"use client"`를 추가합니다.
- 디자인 토큰은 `app/globals.css`의 CSS 변수(`--primary`, `--background` 등)를 사용합니다.

Supabase / 보안 규칙 (Ch11 보강):

- RLS 정책은 Supabase CLI 마이그레이션으로 관리합니다. SQL Editor에서 직접 정책을 붙여넣지 않습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 포함하지 않습니다. 서비스 역할 키는 서버/빌드 서버에서만 사용합니다.
- posts 테이블의 작성자 식별자(`author_id` 또는 `user_id`)와 `auth.uid()`를 기준으로 RLS 정책을 작성합니다.
- 클라이언트 UI 분기는 UX 목적일 뿐이며 실제 보안은 RLS로 보장되어야 합니다.

문서화/버전 정책:

- 교재 기준 버전: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 프로젝트 `package.json`의 실제 버전을 항상 병기하여 차이를 문서화합니다.

이 파일은 에이전트가 프로젝트 규칙을 결정하거나 문서/코드 변경을 제안할 때 우선 참조해야 합니다.
# Project Rules (Agent) — my-first-web

이 파일은 에이전트가 이 프로젝트에서 따라야 할 구체 규칙을 정리합니다.

기본 원칙
- App Router만 사용 (`app/`), `pages/` 또는 `next/router` 사용 금지
- Server Components를 기본으로 하되, 클라이언트 전용 기능(폼, 브라우저 API)에서만 `"use client"` 사용

Supabase / 인증
- Supabase 클라이언트는 `lib/supabase/client.ts`를 우선 사용
- 서버 전용 키는 서버전용 파일/코드로 분리(예: `lib/supabase/server.ts`)하고 클라이언트에 절대 노출 금지
- 인증은 `contexts/AuthContext.tsx`(또는 `components/AuthProvider.tsx`)와 `useAuth` 훅을 사용

문서화
- 변경 시 `context.md`, `todo.md`, `ARCHITECTURE.md`를 동기화할 것
- 패키지 버전은 "교재 기준"과 "현재 설치 기준(package.json)"을 함께 기록

검증 체크리스트
- `lib/supabase/client.ts` 존재 여부
- `contexts/AuthContext.tsx` 연동 여부
- `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 여부
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
