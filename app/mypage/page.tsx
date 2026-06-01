import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MyPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cookieStore = await cookies();
  const supabase = url && anonKey
    ? createServerClient(url, anonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      })
    : null;

  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, bio")
    .eq("id", user.id)
    .maybeSingle();

  const username = profile?.username || user.email || "사용자";
  const avatarUrl = profile?.avatar_url || "";
  const bio = profile?.bio || "소개가 없습니다.";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>내 프로필</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="프로필 이미지"
                  className="h-20 w-20 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  없음
                </div>
              )}
              <div className="space-y-1">
                <p className="text-lg font-semibold">{username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground">소개</h3>
              <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">{bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
