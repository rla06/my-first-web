# Copilot Instructions (GitHub override for this repo)

이 파일은 리포지토리 레벨에서 GitHub Copilot 또는 에이전트가 참고해야 할 프로젝트 규칙을 정리합니다.

기본 원칙
- App Router만 사용합니다 (`app/` 디렉토리). `pages/` 또는 `next/router` 사용 금지.
- Server Components를 기본으로 하되, 폼/로컬 상태/브라우저 API가 필요한 경우에만 `"use client"`를 사용하세요.
- 디자인 토큰은 `app/globals.css`의 CSS 변수(`--primary`, `--background`, 등)를 사용합니다.

Ch10 기준(중요)
- Ch7·Ch8 교재 기준 패키지를 기본 권장으로 문서화하되, 실제 `package.json`의 현재 설치 버전도 함께 기록합니다.
- Supabase 클라이언트는 `lib/supabase/client.ts`(또는 `lib/supabase.ts`에서 `client.ts`를 임포트하는 형태)를 사용하도록 권장합니다.
- 인증은 Ch9 구현인 `useAuth` 훅 및 `AuthProvider`(또는 `contexts/AuthContext.tsx`)를 사용합니다.
- posts 스키마(Ch8 기준)를 그대로 사용합니다: `id`, `author_id`, `title`, `slug`, `content`, `published`, `published_at`, `created_at`, `updated_at`.
- 수정/삭제 UI는 프론트엔드 UX이며 실제 권한·정책 관리는 Ch11의 RLS로 처리합니다.
- 절대 `SUPABASE_SERVICE_ROLE_KEY`를 클라이언트에 넣지 마세요.

Ch11 RLS 보안 규칙
- 보안은 클라이언트 if문이 아니라 RLS로 강제합니다.
- RLS SQL은 Supabase CLI 마이그레이션으로 남깁니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에서 절대 사용하지 않습니다.

환경변수
- 로컬 개발: `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 설정합니다.

검증 체크리스트
- `lib/supabase/client.ts` 존재 여부 확인
- `contexts/AuthContext.tsx` 또는 `components/AuthProvider.tsx`가 프로젝트에 연동되어 있는지 확인
- `app/posts` 라우트에 CRUD 관련 placeholder 또는 API 엔드포인트가 준비되어 있는지 확인

커밋/PR 규칙
- 작은 단위로 커밋하세요. PR 제목에 `feat`/`fix`/`chore` 프리픽스를 사용합니다.

참고: 프로젝트 레벨 copilot 지침은 개발용이며, CI/CD 환경에서 별도의 보안 정책이 우선됩니다.
AGENT.md를 참조한다. AGENT.md에는 프로젝트의 기술 스택, 코딩 컨벤션, 디자인 토큰, 컴포넌트 규칙, 그리고 AI가 자주 하는 실수에 대한 정보가 담겨 있다. 이 정보를 바탕으로 프로젝트의 코드 스타일과 구조에 대한 지침을 작성한다.

세션 시작 시 Copilot이 로드하는 컨텍스트 (우선순위 순):

- `copilot-instructions.md` (자동 로드) — 공통 규칙과 프로젝트 에이전트 지침
- `context.md` (수동 참조) — 현재 프로젝트 상태 요약
- `todo.md` (수동 참조) — 현재 할 일 목록
- `ARCHITECTURE.md` (수동/선택) — 프로젝트별 설계 가이드
- 열린 파일들 (자동 포함) — 현재 작업 중인 코드

위 컨텍스트를 항상 참고하여 변경을 제안하거나 코드를 작성한다. `ARCHITECTURE.md`가 존재할 경우 우선적으로 설계 규칙을 따르고, `context.md`와 `todo.md`의 상태를 반영해 작업 우선순위를 결정한다.

## Design Tokens

- Primary color: use `--primary` CSS variable in `app/globals.css` (project uses gray-scale placeholder by default)
- Background: `--background`
- Foreground (text): `--foreground`
- Card background: `--card` and `--card-foreground`
- Border / input: `--border`, `--input`
- Radius: `--radius` for rounded corners

Use these variables instead of hardcoded Tailwind colors so theme changes apply globally.

## Component Rules

- Prefer `components/ui/*` (shadcn/ui) components: `Button`, `Card`, `Input`, `Dialog`.
- Put project-specific components in `components/` (e.g., `Header.tsx`, `SketchLayout.tsx`, `NewPostForm.tsx`).
- Use `Button asChild` for links to preserve semantics and styles.
- Default to Server Components; add `"use client"` only when required (forms, local state, browser APIs).

## Known AI Mistakes (project-specific)

- Do not use `next/router`; use `next/navigation` for App Router.
- Do not create `pages/` router files; use `app/` routes.
- Avoid hardcoded Tailwind colors (use CSS variables/design tokens).
- Verify import paths for shadcn/ui components (`@/components/ui/...`) to avoid hallucinated paths.

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 `package.json`이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 `package.json` 기준으로 원인을 확인한다.

**Ch9 Auth / Routing Rules**

- 인증: 이메일/비밀번호 (`signInWithPassword`)만 사용 — 구버전 `auth.signIn()` 사용 금지
- 소셜 로그인은 추가하지 않는다.
- App Router만 사용한다. `next/router` 또는 `pages/` 라우터를 사용하지 마라.
- 보호 라우트는 `middleware.ts`로 구현한다.
- `service_role` 키는 클라이언트에 절대 넣지 않는다.
