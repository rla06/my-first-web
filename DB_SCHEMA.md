# DB Schema — Supabase (초안)

이 문서는 Supabase 프로젝트에서 사용할 데이터베이스 스키마 초안입니다. Supabase의 인증(Auth)은 `auth.users` 테이블을 사용하므로, 사용자 프로필 등은 `profiles` 테이블로 분리합니다.

## 테이블: profiles
- 사용자 메타데이터를 저장 (Supabase Auth와 1:1)

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);
```

## 테이블: posts
- 블로그 포스트

```sql
create table if not exists posts (
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

create index if not exists idx_posts_author on posts(author_id);
create index if not exists idx_posts_published on posts(published);
```

## 테이블: comments
- 포스트 댓글 (간단한 구조)

```sql
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comments_post on comments(post_id);
```

## 권한(간단 가이드)
- Supabase RLS 사용 권장: 테이블별로 RLS 정책 설정
- 예: `posts`는 공개 읽기(퍼블리시된 포스트), 작성/수정은 인증된 사용자로 제한

## 마이그레이션 및 배포
1. Supabase SQL Editor에 직접 붙여넣기 또는
2. `supabase` CLI(`supabase db push`)로 마이그레이션 관리

---
추가: 필요한 컬럼(태그, 카테고리, 좋아요 등)이나 관계가 있으면 알려주시면 반영하겠습니다.
