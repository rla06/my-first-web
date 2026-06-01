"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase/client";

type ProfileData = {
  username: string;
  avatar_url: string;
  bio: string;
};

type ProfileEditorProps = {
  userId: string;
  email: string;
  initialProfile: ProfileData;
};

export default function ProfileEditor({ userId, email, initialProfile }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [username, setUsername] = useState(initialProfile.username);
  const [bio, setBio] = useState(initialProfile.bio);
  
  const [error, setError] = useState<string | null>(null);

  const displayAvatar = initialProfile.avatar_url || "";
  const displayUsername = initialProfile.username || email || "사용자";
  const displayBio = initialProfile.bio || "소개가 없습니다.";

  async function handleSave() {
    setError(null);
    setSaving(true);
    
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim() || null,
          bio: bio.trim() || null,
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setIsEditing(false);
      // Let the parent layout know, or since it's just client-side, we can force a router.refresh() 
      // but modifying window location is simpler for now, or just let the user see the optimistic update.
      window.location.reload();
    } catch (e: any) {
      console.error("Failed to update profile", e);
      setError("프로필 업데이트 중 문제가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex items-center gap-4">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="프로필 이미지"
                className="h-20 w-20 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                없음
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">닉네임</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">소개</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base placeholder:text-muted-foreground"
                rows={4}
                placeholder="자기소개를 입력하세요"
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                취소
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="flex items-center gap-4">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt="프로필 이미지"
            className="h-20 w-20 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
            없음
          </div>
        )}
        <div className="space-y-1 md:hidden">
          <p className="text-lg font-semibold">{displayUsername}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="hidden md:block space-y-1">
          <p className="text-lg font-semibold">{displayUsername}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">소개</h3>
          <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">{displayBio}</p>
        </div>
        <div>
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            프로필 수정
          </Button>
        </div>
      </div>
    </div>
  );
}
