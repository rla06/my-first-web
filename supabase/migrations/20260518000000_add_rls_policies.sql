-- Enable RLS on posts and add policies so authenticated users can create/select/update/delete their own posts

-- Enable row level security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (you may tighten this if needed)
CREATE POLICY "Public select" ON public.posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert rows where new.user_id equals auth.uid()
CREATE POLICY "Insert own posts" ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = new.user_id);

-- Allow owners to update their posts
CREATE POLICY "Update own posts" ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = new.user_id);

-- Allow owners to delete their posts
CREATE POLICY "Delete own posts" ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Note: Apply this migration in your Supabase project (SQL editor or supabase CLI).
-- If you prefer keeping posts publicly readable but only writable by owners, the above is appropriate.
