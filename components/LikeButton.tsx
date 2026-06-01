"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  postId: string;
  initialCount: number;
  size?: "sm" | "default";
};

function getOrCreateAnonId(): string {
  const key = "anon_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(key, generated);
  return generated;
}

export default function LikeButton({ postId, initialCount, size = "default" }: Props) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const load = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id || user?.id || null;

      if (!userId) {
        const id = getOrCreateAnonId();
        setAnonId(id);
        const { data } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", postId)
          .eq("anon_id", id)
          .maybeSingle();
        setLiked(!!data);
        return;
      }

      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();
      setLiked(!!data);
    };

    load();
  }, [postId, user?.id]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id || user?.id || null;
    const currentAnonId = userId ? null : (anonId || getOrCreateAnonId());
    if (!userId && !anonId) setAnonId(currentAnonId);

    const { data, error } = await supabase.rpc("toggle_post_like", {
      p_post_id: postId,
      p_anon_id: currentAnonId,
    });

    if (!error) {
      const result = Array.isArray(data) ? data[0] : data;
      if (result) {
        setLiked(!!result.liked);
        setCount(Number(result.like_count ?? count));
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        size={size}
        variant="ghost"
        onClick={handleToggle}
        disabled={loading}
        className={`${liked ? "text-red-500" : "text-muted-foreground"} text-xl`}
      >
        {"\u2665"}
      </Button>
      <span className="text-sm text-muted-foreground">총 {count}개</span>
    </div>
  );
}
