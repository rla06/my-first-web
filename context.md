# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, DB 스키마 초안, Supabase 설정 문서
- 진행 중: Supabase 프로젝트 생성 및 연동, 포스트 상세 페이지 (데이터 로딩 미완)
- 미착수: 마이페이지

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정

## 새로 추가된 항목

- Supabase 초기 마이그레이션 스크립트: `db/001_init.sql`
- 클라이언트 인증 컴포넌트: `components/AuthForm.tsx` (현재: OTP 이메일 방식이었으나 Ch9 기준에 의해 이메일/비밀번호 로그인으로 통일)
- 로그인 페이지: `app/login/page.tsx`
- 회원가입 페이지: `app/signup/page.tsx`
- 인증 관리: `lib/auth.ts` (signInWithPassword, signUpWithEmail 등) 및 `contexts/AuthContext.tsx`
- 보호 라우트: `middleware.ts` 추가 (현재 보호 경로: `/posts/new`)
- 포스트 편집 템플릿: `app/posts/[id]/edit/page.tsx` (플레이스홀더)

## Ch9 관련 상태 요약
- 인증: Supabase Auth 이메일/비밀번호
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ch8 Supabase CLI 연결 확인: `projects list`, `projects api-keys` 점검 완료
- Supabase 대시보드: Authentication -> Sign In / Providers -> Email, URL Configuration 확인 완료

## Ch9 Supabase Auth 작업 요약
- 인증: Supabase Auth 이메일/비밀번호 (`signInWithPassword`, `signUp`, `signOut` 사용)
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (클라이언트), `SUPABASE_SERVICE_ROLE_KEY`(서버 전용)
- Ch8 CLI 연결 확인: `npx supabase projects list`, `npx supabase projects api-keys` 권장
- 생성/수정 파일: `lib/auth.ts`, `app/login/page.tsx`, `app/signup/page.tsx`, `contexts/AuthContext.tsx` (AuthProvider), `app/layout.tsx` 연결, `components/Header.tsx`, `middleware.ts`
- 보호 라우트: `/posts/new` (middleware.ts에서 처리)

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

## 변경 파일

- `docs/DB_SCHEMA.md`: Supabase용 DB 스키마 초안 추가
- `docs/SUPABASE_SETUP.md`: Supabase 설정 및 마이그레이션 가이드 추가
- `.env.local.example`: Supabase 환경변수 예시 추가
- `.github/copilot-instructions.md`: 세션 컨텍스트 로드 규칙 추가
- `lib/supabase.ts`: Supabase 클라이언트 래퍼 추가
- `app/api/posts/route.ts`: POST 엔드포인트를 Supabase로 통합(환경변수 없을 때는 스텁 유지)
- `components/NewPostForm.tsx`: 클라이언트 작성 폼 추가
- `app/posts/[id]/page.tsx`: Supabase에서 포스트 로드 시도 로직 추가

## 최근 작업 요약 (2026-04-29)

- `ARCHITECTURE.md` 보강: 페이지 맵에 `/signup` 추가 및 데이터 모델 정리
- `copilot-instructions.md` 생성: 디자인 토큰과 컴포넌트 규칙 명시
- `.env.local` 예시 생성: 로컬 개발용 Supabase 키 자리표시자 추가
- 개발 서버 이슈 해결: 중복 실행 중인 Next dev 프로세스 종료 및 런타임 에러(supabaseUrl missing) 대응

## 다음 단계
- dev 서버 정상화 확인 및 브라우저에서 화면 검증
- Supabase 실제 키를 `.env.local`에 설정하여 통합 테스트 실행
- 와이어프레임(디자인 산출물) 이미지 생성 또는 외부 도구(v0.dev)로 시각화

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용
- Supabase 연동 준비: 로컬 환경에 `.env.local` 또는 배포 환경의 환경변수로 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 설정 필요

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 수업 설명은 교재 기준을 따르되, 빌드/실행 문제는 실제 `package.json` 버전을 우선 확인하세요.

## Ch10 시작 전 Readiness 체크리스트

- `lib/supabase/client.ts` 또는 `lib/supabase.ts`가 실제로 존재하고, 프로젝트 내에서 임포트 되는지 확인
- 인증은 `contexts/AuthContext.tsx` (또는 `components/AuthProvider.tsx`)의 `useAuth` 훅을 통해 사용되고 있는지 확인
- `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 설정되어 있는지 확인
- posts 컬럼명이 Ch8 스키마와 일치하는지 확인: `id`, `author_id`, `title`, `slug`, `content`, `published`, `published_at`, `created_at`, `updated_at`
- App Router만 사용하고 `next/router` 또는 `pages/` 라우터가 없는지 확인
- 수정·삭제 UI는 프론트엔드 UX로 남겨두고, 실제 권한 처리는 Ch11 RLS에서 설정할 계획임을 문서화
- `package.json`의 실제 버전과 교재 기준 버전을 비교하여 문서에 병기할 것

## 현재 설치된 주요 패키지 버전(확인 필요)
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치(프로젝트 `package.json` 기준): Next.js 16.2.1, @supabase/supabase-js 2.105.1, @supabase/ssr 0.10.2

## Ch11 RLS 기준 요약

- RLS 적용 방식: SQL Editor에서 직접 실행하지 않고 Supabase CLI 마이그레이션으로 관리합니다. 마이그레이션 파일은 `supabase/migrations/`에 남깁니다.
- 정책 기준: `posts` 테이블의 작성자 식별자를 `author_id`(또는 스키마에서 사용 중인 `user_id`)와 `auth.uid()`를 기준으로 정책을 작성합니다. 예: 작성자만 수정/삭제 가능하도록 하는 정책.
- 클라이언트 분기는 UI/UX 목적일 뿐이며, 실제 보안은 RLS로 보장되어야 합니다. 프론트엔드에서 권한 분기만으로 보안을 대체하지 마세요.
- 절대 금지: `SUPABASE_SERVICE_ROLE_KEY` 또는 서비스 역할 키를 클라이언트에 포함하지 마세요. 서버(또는 Edge 함수)에서만 사용해야 합니다.
- SQL 생성 시점: 지금은 정책 SQL을 만들지 않고 대상(타깃)과 설계를 확정합니다. 실제 정책은 이후 마이그레이션 파일로 추가합니다.

## 현재 권장 RLS 적용 대상 (설계 단계)

- `posts` 테이블: 읽기(공개)와 쓰기(게시/수정/삭제)에 대해 다음 정책을 적용할 예정입니다.
	- 게시(INSERT): 인증된 사용자만 허용 (auth.uid() 존재)
	- 수정(UPDATE): `author_id = auth.uid()` 인 경우에만 허용
	- 삭제(DELETE): `author_id = auth.uid()` 인 경우에만 허용
	- 공개여부(PUBLISHED) 읽기: `published = true` 인 경우 누구나 읽기 가능, 작성자는 자신의 draft도 읽기 가능하도록 추가 정책 필요

위 항목들은 설계 단계의 대상이며, 실제 SQL은 마이그레이션 파일로 작성합니다.
