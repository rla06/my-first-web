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
  author_id uuid references profiles(id) on delete set null,
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

---

작성 기준: Next.js App Router, Server Components 우선. 클라이언트 상호작용이 필요한 부분에만 `"use client"`를 사용하세요.
