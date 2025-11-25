import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const team_id = searchParams.get("team_id");

    // If team_id is provided, check if it's favorited
    if (team_id) {
      const { data, error } = await supabase
        .from("user_favorite_teams")
        .select("*")
        .eq("user_id", user.id)
        .eq("team_id", team_id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" which is fine
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ favorites: data ? [data] : [] });
    }

    // Otherwise, return all favorites
    const { data, error } = await supabase
      .from("user_favorite_teams")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ favorites: data || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { team_id, team_name, team_abbreviation } = body;

    if (!team_id || !team_name || !team_abbreviation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_favorite_teams")
      .insert({
        user_id: user.id,
        team_id,
        team_name,
        team_abbreviation,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "23505") {
        // Unique constraint violation - already favorited
        return NextResponse.json(
          { error: "Team already favorited" },
          { status: 409 }
        );
      }
      if (error.code === "42P01") {
        // Table doesn't exist
        return NextResponse.json(
          { error: "Database table not found. Please run the migration SQL." },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorite: data });
  } catch (error) {
    console.error("Unexpected error in POST /api/favorites/teams:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const team_id = searchParams.get("team_id");

    if (!team_id) {
      return NextResponse.json(
        { error: "Missing team_id parameter" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("user_favorite_teams")
      .delete()
      .eq("user_id", user.id)
      .eq("team_id", team_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

