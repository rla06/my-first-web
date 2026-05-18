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

  // Require server-side service role for safe writes
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required for write operations' }, { status: 500 });
  }

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

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const id = params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required for write operations' }, { status: 500 });
  }

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string);
  if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  const { data: deleted, error } = await supabaseAdmin.from("posts").delete().eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(deleted);
}
