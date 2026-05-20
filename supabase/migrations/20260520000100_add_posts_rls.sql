-- Migration: add_posts_rls
-- WARNING: 이 파일은 Supabase CLI 마이그레이션용입니다.
-- 실행 전: 기존 정책/컬럼명(user_id vs author_id)을 확인하세요.
-- DROP POLICY IF EXISTS 문은 중복 생성을 방지합니다.

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 읽기 허용
DROP POLICY IF EXISTS allow_public_select ON public.posts;
CREATE POLICY allow_public_select
  ON public.posts
  FOR SELECT
  USING (true);

-- INSERT: 로그인 사용자만 가능, 삽입되는 user_id는 auth.uid()와 같아야 함
DROP POLICY IF EXISTS insert_authenticated_user ON public.posts;
CREATE POLICY insert_authenticated_user
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 작성자만 가능, 업데이트 후에도 user_id는 auth.uid()와 같아야 함
DROP POLICY IF EXISTS update_owner_only ON public.posts;
CREATE POLICY update_owner_only
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 작성자만 가능
DROP POLICY IF EXISTS delete_owner_only ON public.posts;
CREATE POLICY delete_owner_only
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);
