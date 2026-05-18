# Copilot Instructions (project-specific)

## Purpose
프로젝트 전반에서 AI 보조(코드 생성, 수정) 시 따라야 할 규칙과 디자인 토큰, 컴포넌트 사용 지침을 정리합니다.

## Design Tokens
- 색상/토큰은 `app/globals.css`의 CSS 변수를 사용합니다.
- 기본 변수 예시:

:root {
  --primary: 220 70% 50%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 98%;
  --foreground: 220 10% 10%;
  --card: 0 0% 100%;
  --card-foreground: 220 10% 10%;
  --border: 220 12% 90%;
  --input: 220 12% 96%;
  --radius: 8px;
}

- Tailwind 색상 대신 위 변수들을 사용하세요.

## Component Rules
- 우선순위: shadcn/ui (`components/ui/*`) 컴포넌트를 사용합니다: `Button`, `Card`, `Input`, `Dialog`, `Sheet`, `Toast`.
- 커스텀 컴포넌트는 `components/`에 둡니다 (예: `Header.tsx`, `SketchLayout.tsx`, `NewPostForm.tsx`).
- 링크에 스타일을 적용할 때 `Button asChild`를 사용해 시멘틱을 유지합니다.
- 기본은 Server Component; 클라이언트 전용 기능(폼, 브라우저 API, 로컬 상태)은 `"use client"`를 꼭 추가합니다.

## Next.js App Router 규칙
- App Router만 사용합니다 (`app/` 디렉토리). `pages/`는 만들지 마세요.
- 라우팅/리다이렉트: `next/navigation`의 `redirect()`/`useRouter()` 대신 App Router 권장 API를 사용하세요.

## 환경변수
- 로컬 개발 시 `.env.local`에 다음을 설정하세요:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (필요시) `SUPABASE_SERVICE_ROLE_KEY`

## Known AI Mistakes (프로젝트 특화)
- `next/router` 사용: App Router 환경에서는 `next/router`를 사용하지 마세요.
- Hardcoded Tailwind 색상 사용: 색은 CSS 변수로 처리합니다.
- 잘못된 shadcn 경로: shadcn 컴포넌트는 `@/components/ui/...` 또는 로컬 `components/ui`를 확인하세요.
- `id` 타입: Supabase 연동 시 `id`는 `uuid`를 사용합니다.

## Commit / PR 규칙
- 작은 단위로 커밋하세요 (기능 단위).
- PR 제목은 `feat`, `fix`, `chore` 프리픽스를 사용합니다.
- 변경된 디자인 토큰이나 글로벌 스타일은 반드시 `ARCHITECTURE.md`에 기록하세요.
