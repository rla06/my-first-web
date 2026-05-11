-- Add pgcrypto extension and comments table
create extension if not exists pgcrypto;

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comments_post on comments(post_id);

-- Row level security / policies should be added as needed by the project
