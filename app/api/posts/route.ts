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

    // If service role key is available, validate token and insert via admin client
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
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
    }

    // Fallback for local/dev: forward request to Supabase REST using user's token.
    // Decode token payload to extract user id (unverified decoding).
    try {
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const userId = payload.sub || payload.user_id;
      if (!userId) {
        return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
      }

      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!SUPABASE_URL) {
        return NextResponse.json({ error: 'Missing SUPABASE URL' }, { status: 500 });
      }

      const restUrl = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/posts`;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      };
      if (ANON_KEY) headers['apikey'] = ANON_KEY;

      const r = await fetch(restUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify([{ title: body.title, content: body.content, user_id: userId }]),
      });

      const respBody = await r.json().catch(() => null);
      if (!r.ok) {
        return NextResponse.json({ error: respBody?.message ?? 'Insert failed' }, { status: r.status });
      }

      // REST returns an array of inserted rows
      const created = Array.isArray(respBody) ? respBody[0] : respBody;
      return NextResponse.json(created, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: 'Token decode/forward failed' }, { status: 500 });
    }

    // Fallback stub
    const id = String(Date.now());
    const created = { id, ...body };
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
