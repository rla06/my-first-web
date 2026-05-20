import { NextResponse, NextRequest } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required' }, { status: 500 });
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string);
    if (userErr || !userData?.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = userData.user.id;
    // Ensure the provided id matches authenticated user
    if (userId !== body.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data, error } = await supabaseAdmin
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
