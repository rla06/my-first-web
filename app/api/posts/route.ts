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
    if (!body?.title || !body?.content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Expect Authorization header with user's access token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient(token);
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = userData.user.id;
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title: body.title, content: body.content, user_id: userId }])
      .select()
      .single();

    if (error) {
      const msg = (error?.message || "").toString();
      if (msg.includes("row-level security") || msg.includes("row level security")) {
        return NextResponse.json({ error: "Row-level security blocked the insert. Ensure the user is logged in and that the RLS policy allows inserts when user_id equals auth.uid()." }, { status: 403 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
