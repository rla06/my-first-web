-- Add view counts, likes, and threaded comments

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS view_count bigint NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  anon_id text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT post_likes_actor_check CHECK (
    user_id IS NOT NULL OR anon_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_anon ON public.post_likes(anon_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_post_likes_user
  ON public.post_likes(post_id, user_id)
  WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_post_likes_anon
  ON public.post_likes(post_id, anon_id)
  WHERE anon_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT comments_author_check CHECK (
    author_id IS NOT NULL OR author_name IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author_id);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_public_select_post_likes ON public.post_likes;
CREATE POLICY allow_public_select_post_likes
  ON public.post_likes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS allow_public_select_comments ON public.comments;
CREATE POLICY allow_public_select_comments
  ON public.comments
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS insert_comments_anyone ON public.comments;
CREATE POLICY insert_comments_anyone
  ON public.comments
  FOR INSERT
  WITH CHECK (
    (auth.uid() = author_id)
    OR (auth.uid() IS NULL AND author_id IS NULL AND author_name IS NOT NULL)
  );

DROP POLICY IF EXISTS update_comments_owner_only ON public.comments;
CREATE POLICY update_comments_owner_only
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS delete_comments_owner_only ON public.comments;
CREATE POLICY delete_comments_owner_only
  ON public.comments
  FOR DELETE
  USING (auth.uid() = author_id);

CREATE OR REPLACE FUNCTION public.increment_post_view(p_post_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.posts
    SET view_count = view_count + 1
    WHERE id = p_post_id
    RETURNING view_count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.toggle_post_like(
  p_post_id uuid,
  p_anon_id text DEFAULT NULL
)
RETURNS TABLE (liked boolean, like_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL AND (p_anon_id IS NULL OR length(trim(p_anon_id)) = 0) THEN
    RAISE EXCEPTION 'anon_id required';
  END IF;

  IF v_user_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.post_likes
      WHERE post_id = p_post_id AND user_id = v_user_id
    ) THEN
      DELETE FROM public.post_likes
      WHERE post_id = p_post_id AND user_id = v_user_id;
      liked := false;
    ELSE
      INSERT INTO public.post_likes (post_id, user_id)
      VALUES (p_post_id, v_user_id);
      liked := true;
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.post_likes
      WHERE post_id = p_post_id AND anon_id = p_anon_id
    ) THEN
      DELETE FROM public.post_likes
      WHERE post_id = p_post_id AND anon_id = p_anon_id;
      liked := false;
    ELSE
      INSERT INTO public.post_likes (post_id, anon_id)
      VALUES (p_post_id, p_anon_id);
      liked := true;
    END IF;
  END IF;

  SELECT count(*) INTO like_count
  FROM public.post_likes
  WHERE post_id = p_post_id;

  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_view(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_post_like(uuid, text) TO anon, authenticated;
