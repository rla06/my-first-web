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

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 404 });

  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  const body = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!body?.title || !body?.content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient(token);
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
  if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const { data, error } = await supabase
    .from("posts")
    .update({ title: body.title, content: body.content, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient(token);
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
  if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const { data: deleted, error } = await supabase.from("posts").delete().eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(deleted);
}
