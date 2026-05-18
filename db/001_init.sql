-- 초기 DB 마이그레이션: profiles, posts, comments
-- Run in Supabase SQL editor or via supabase CLI

create extension if not exists pgcrypto;
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  role text,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_posts_user on posts(user_id);

-- comments 테이블은 선택적이며 Ch8 모델에 포함되지 않음
-- 필요 시 별도 마이그레이션으로 추가하세요.

-- 기본 RLS 예시 (권장: 정책은 프로젝트 요구에 맞춰 조정)
-- enable row level security on posts;
-- create policy "public_select" on posts for select using (true);
