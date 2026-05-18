"use client"

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import PostActions from "@/components/PostActions";

export default function PostOwnerActions({ authorId, postId }: { authorId: string; postId: string }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;
  if (user.id !== authorId) return null;

  return <PostActions id={postId} />;
}

// NOTE: This component only controls UI visibility for the author (UX only).
// Actual authorization must be enforced via RLS policies in Ch11.
