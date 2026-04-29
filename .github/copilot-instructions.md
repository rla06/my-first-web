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
