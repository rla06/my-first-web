# ARCHITECTURE

## 1. 프로젝트 목표

- 개인 블로그 플랫폼을 간단하고 유지보수하기 쉽게 구현
- Next.js App Router(서버 컴포넌트 기본)로 라우팅/데이터 페칭 학습 및 적용
- 작성/임시저장/수정이 가능한 글 관리 기능 제공
- 인증 기반 개인 영역(마이페이지) 및 공개 글 보기(SEO 친화적) 지원
- Tailwind CSS 및 shadcn/ui를 사용한 일관된 UI

## 2. 페이지 맵 (Next.js App Router 기준)

| 페이지 | URL | 라우트 파일 (예시) | 인증 | 설명 |
|---|---:|---|---|---|
| 홈 | `/` | `app/page.tsx` | 공개 | 최근 글, 검색, 피드 |
| 글 목록 | `/posts` | `app/posts/page.tsx` | 공개 | 페이징/필터/검색 가능한 글 리스트 |
| 글 상세 | `/posts/[id]` | `app/posts/[id]/page.tsx` | 공개(읽기) | 본문, 메타, 댓글, 공유 버튼 |
| 글 작성 | `/posts/new` | `app/posts/new/page.tsx` | 인증 필요 | 새 글 작성 폼(임시저장/미리보기/게시) |
| 로그인 | `/login` | `app/login/page.tsx` | 공개 | 로그인 및 리디렉션 처리 |
| 회원가입 | `/signup` | `app/signup/page.tsx` | 공개 | 회원가입 폼 (이메일/비밀번호) |
| 마이페이지 | `/mypage` | `app/mypage/page.tsx` | 인증 필요 | 내 글/초안/프로필/설정 대시보드 |

### 권장 추가 라우트

- `app/posts/[id]/edit` — 글 편집
- `app/posts/drafts` — 임시저장 목록
- `app/users/[username]` — 공개 프로필
- `app/settings` — 계정/알림 설정
- `app/404`, `app/error` — 커스텀 에러 페이지

## 3. 유저 플로우

### A. 글 읽기
1. 홈 또는 글 목록에서 글 선택 → `/posts/[id]`
2. 서버에서 글 데이터 로드(서버 컴포넌트) → 본문 렌더
3. 댓글/좋아요 등의 상호작용은 클라이언트 컴포넌트로 처리
4. 인증 필요 시 `/login`로 리디렉션 후 원래 페이지로 복귀

### B. 글 작성
1. `/posts/new` 접속(비로그인 시 `/login`으로 리디렉션)
2. 클라이언트 폼(제목, 본문, 태그, 임시저장)
3. 임시저장: 로컬스토리지 또는 `drafts` 엔드포인트
4. 게시 → `POST /api/posts` → 성공 시 `/posts/[id]`로 이동

### C. 마이페이지
1. `/mypage` 접근(인증 필요)
2. 탭: `내 글`, `초안`, `프로필`, `설정`
3. 글 선택 → 상세 또는 편집 페이지로 이동

## 4. 컴포넌트 구조 (shadcn/ui 기준)

설계 원칙: shadcn/ui의 핵심 컴포넌트(`Button`, `Card`, `Input`, `Dialog`)를 우선 사용하고, 프로젝트 고유 컴포넌트는 `components/`에 둔다.

- `app/layout.tsx` — 전역 레이아웃: `Header`, `Footer`, 전역 스타일 적용
- `components/Header.tsx` — 네비게이션, 로그인 상태 표시
- `components/SketchLayout.tsx` — 페이지용 그리드(메인 + 사이드바)
- `components/NewPostForm.tsx` — 글 작성 클라이언트 폼 (`use client`)
- `components/ui/*` — shadcn/ui에서 가져온 재사용 컴포넌트 (Button, Card, Input, Dialog 등)
- `app/posts/page.tsx` — 포스트 리스트(서버 컴포넌트, Card 사용)
- `app/posts/[id]/page.tsx` — 포스트 상세(서버 컴포넌트, 서버에서 데이터 로드)

컴포넌트 사용 가이드:
- 리스트/카드는 `Card`로 감싸고 `CardTitle`, `CardDescription`으로 내용 구성
- 버튼은 `Button` 사용(링크는 `asChild`로 처리)
- 입력은 `Input` 사용, 대형 텍스트는 `<textarea>` 또는 별도 리치에디터 컴포넌트로 분리

## 5. 데이터 모델 (Supabase 대비)

### profiles
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);
```

### posts
```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text not null,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### comments
```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);
```

권장 인덱스/정책: `idx_posts_published`, RLS로 작성/수정 권한 제어

## 6. TODO / 추가 예정

- 컴포넌트 세부 계층(예: CardHeader, CardFooter) — TODO: 추가 예정
- 상세 DB 필드(태그 테이블, 좋아요 테이블) — TODO: 추가 예정

## Authentication & Routing (Ch9 기준)

- 인증 흐름: signup(회원가입) -> login(로그인) -> posts(글 목록)
- Header 상태 분기: 비로그인 시(로그인/회원가입 버튼), 로그인 시(새 글 쓰기/로그아웃 버튼)
- 인증 방식: 이메일/비밀번호(`signInWithPassword`) 사용 — 소셜 로그인 미사용
- 보호 라우트: `/posts/new` (현재 `middleware.ts`를 사용해 비로그인 접근 차단)
- 클라이언트에서는 `next/router`와 `pages/` 라우터를 사용하지 말고 App Router(`next/navigation`)만 사용
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 이름을 유지
- 보안: `service_role` 키는 서버 전용(비공개)으로 유지 — 클라이언트에 절대 노출 금지

### Ch11 RLS 요약

- RLS 정책은 Supabase CLI 마이그레이션으로 적용합니다(콘솔 SQL 편집기는 권장하지 않음).
- `posts.user_id` 컬럼을 `auth.users(id)`와 연결해, RLS에서는 `auth.uid()`와 비교하여 행 수준 권한을 판정합니다.
- 프론트엔드 분기는 UX 용도일 뿐이며, 실제 권한/보안은 RLS에 의해 강제됩니다.

#### 보안 계층

- UI 분기(UX): 버튼/메뉴 노출 제어는 사용자 경험을 위한 처리
- DB 보안(RLS): 실제 권한 강제는 RLS 정책으로 처리

#### 보호 정책 목록 (posts)

- SELECT: 누구나 읽기
- INSERT: 로그인 사용자 본인만(`user_id = auth.uid()`)
- UPDATE: 작성자만(`user_id = auth.uid()`)
- DELETE: 작성자만(`user_id = auth.uid()`)

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 `package.json`의 버전이 더 최신일 수 있으니 빌드 오류가 발생하면 `package.json`을 우선 확인하세요.

## Ch10 시작 전 규칙 요약

- Supabase 클라이언트는 `lib/supabase/client.ts`를 사용하도록 권장합니다. 서버 전용 작업이 필요한 경우 `lib/supabase/server.ts`(서비스 역할 키 사용)처럼 분리하세요.
- 인증 흐름은 Ch9의 `useAuth` 훅과 `AuthProvider`를 활용합니다. `contexts/AuthContext.tsx`가 프로젝트에 존재해야 합니다.
- posts 컬럼명은 Ch8 스키마를 그대로 사용합니다: `id`, `author_id`, `title`, `slug`, `content`, `published`, `published_at`, `created_at`, `updated_at`.
- 수정/삭제 UI는 프론트엔드 UX로 남겨두고 실제 권한 관리는 Ch11에서 RLS로 처리합니다.
- App Router만 사용하고 `next/router`/`pages/` 사용을 금지합니다.

## 실제 설치 버전(프로젝트 기준)
- `package.json`에 기록된 현재 주요 패키지 버전(예시):
  - Next.js: 16.2.1
  - @supabase/supabase-js: 2.105.1
  - @supabase/ssr: 0.10.2


---

작성 기준: Next.js App Router, Server Components 우선. 클라이언트 상호작용이 필요한 부분에만 `"use client"`를 사용하세요.
