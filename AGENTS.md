## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

- Primary color: shadcn/ui --primary
- Background: --background
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 `package.json`이 더 최신일 수 있다. 교재는 위 버전을 기준으로 설명함.
- 빌드 오류가 버전 차이에서 발생하면 `package.json` 기준으로 원인을 확인한다.

## Ch10 관련 에이전트 지침

- 문서/코드 변경 시 `lib/supabase/client.ts` 사용 여부와 `contexts/AuthContext.tsx` 연동을 우선 확인하세요.
- `.github/copilot-instructions.md`가 존재하므로 에이전트는 우선 해당 파일을 준수하세요.
- 실제 `package.json` 버전(예: @supabase/supabase-js 2.105.1 등)을 문서에 병기하여 교재 기준과 차이를 명확히 기록합니다.

-- Ch11 RLS 지침: RLS는 Supabase CLI 마이그레이션으로 관리합니다. `posts`의 `user_id`와 `auth.uid()`를 기준으로 정책을 작성하고, `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하지 마세요.


**Ch9 Auth / Routing Rules**

- 인증: 이메일/비밀번호(`signInWithPassword`)만 사용 (구버전 `auth.signIn()` 금지)
- 소셜 로그인 추가 금지
- Next.js App Router만 사용 (`next/router` 금지)
- 패키지 버전은 반드시 Ch7·Ch8 교재 기준을 따른다.
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준이다.
- 보호 라우트: `middleware.ts` 사용
- `service_role` 키는 클라이언트에 절대 노출 금지