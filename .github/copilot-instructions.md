# GitHub Copilot Instructions

Tech Stack:

- Next.js: 16.2.1 (App Router ONLY)
- Tailwind CSS: ^4

Coding Conventions:

- 기본적으로 Server Component 사용 (App Router 환경에서 작성)
- 스타일링은 Tailwind CSS만 사용

Known AI Mistakes / Rules for Copilot:

- `next/router` 사용 금지 — `next/navigation`을 사용하세요.
- Pages Router 사용 금지 (App Router만 허용).
- `params`를 사용할 때는 항상 `await`를 포함하여 비동기 안전성을 보장하세요.

유의사항: 위에 명시된 Next.js와 Tailwind CSS 버전은 프로젝트의 `package.json`에 명시된 값과 일치합니다.
