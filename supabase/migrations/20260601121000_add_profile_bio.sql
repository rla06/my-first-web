-- Add bio field to profiles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text;
