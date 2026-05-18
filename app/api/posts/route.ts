import { NextResponse, NextRequest } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

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

    // Require server-side service role flow for safe writes.
    // This prevents unreliable client-side REST forwarding which can cause 403s
    // when tokens/headers are missing or RLS blocks the request.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required for write operations' }, { status: 500 });
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = userData.user.id;
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([{ title: body.title, content: body.content, user_id: userId }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
