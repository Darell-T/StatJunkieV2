import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    const url = new URL("/sign-in?error=missing_code", request.url);
    return NextResponse.redirect(url);
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const url = new URL("/sign-in?error=" + encodeURIComponent(error.message), request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL(next, request.url));
}


