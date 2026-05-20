import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createServerClient(token?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createServerClient(token);
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
    if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = userData.user.id;
    // Ensure the provided id matches authenticated user
    if (userId !== body.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: body.id, username: body.username ?? null }, { onConflict: "id" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
