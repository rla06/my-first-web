import { NextResponse, NextRequest } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: "Supabase not configured" }, { status: 404 });

  const { data, error } = await supabaseAdmin.from("posts").select("*").eq("id", id).single();
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

  // If service role key exists, validate and update via admin client
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string);
    if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const { data, error } = await supabaseAdmin
      .from("posts")
      .update({ title: body.title, content: body.content, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Fallback: forward to Supabase REST with user's token
  try {
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const userId = payload.sub || payload.user_id;
    if (!userId) return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL) return NextResponse.json({ error: 'Missing SUPABASE URL' }, { status: 500 });

    const restUrl = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/posts?id=eq.${id}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
    if (ANON_KEY) headers['apikey'] = ANON_KEY;

    const r = await fetch(restUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ title: body.title, content: body.content, updated_at: new Date() }),
    });
    const respBody = await r.json().catch(() => null);
    if (!r.ok) return NextResponse.json({ error: respBody?.message ?? 'Update failed' }, { status: r.status });
    const updated = Array.isArray(respBody) ? respBody[0] : respBody;
    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Token decode/forward failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string);
    if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const { data, error } = await supabaseAdmin.from("posts").delete().eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Fallback: forward to REST
  try {
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')}/rest/v1/posts?id=eq.${id}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) headers['apikey'] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    const r = await fetch(restUrl, { method: 'DELETE', headers });
    const respBody = await r.json().catch(() => null);
    if (!r.ok) return NextResponse.json({ error: respBody?.message ?? 'Delete failed' }, { status: r.status });
    const deleted = Array.isArray(respBody) ? respBody[0] : respBody;
    return NextResponse.json(deleted, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Delete forward failed' }, { status: 500 });
  }
}
