import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([{ title: "test", content: "test", user_id: "00000000-0000-0000-0000-000000000000" }])
    .select();
  return NextResponse.json({ data, error });
}
