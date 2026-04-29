-- 초기 DB 마이그레이션: profiles, posts, comments
-- Run in Supabase SQL editor or via supabase CLI

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

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

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comments_post on comments(post_id);

-- 기본 RLS 예시 (권장: 정책은 프로젝트 요구에 맞춰 조정)
-- enable row level security on posts;
-- create policy "public_select" on posts for select using (published = true);
