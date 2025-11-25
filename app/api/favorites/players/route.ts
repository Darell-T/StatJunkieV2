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
    const player_id = searchParams.get("player_id");

    // If player_id is provided, check if it's favorited
    if (player_id) {
      const { data, error } = await supabase
        .from("user_favorite_players")
        .select("*")
        .eq("user_id", user.id)
        .eq("player_id", player_id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" which is fine
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ favorites: data ? [data] : [] });
    }

    // Otherwise, return all favorites
    const { data, error } = await supabase
      .from("user_favorite_players")
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
    const { player_id, player_name, player_team } = body;

    if (!player_id || !player_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_favorite_players")
      .insert({
        user_id: user.id,
        player_id,
        player_name,
        player_team: player_team || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "23505") {
        // Unique constraint violation - already favorited
        return NextResponse.json(
          { error: "Player already favorited" },
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
    console.error("Unexpected error in POST /api/favorites/players:", error);
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
    const player_id = searchParams.get("player_id");

    if (!player_id) {
      return NextResponse.json(
        { error: "Missing player_id parameter" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("user_favorite_players")
      .delete()
      .eq("user_id", user.id)
      .eq("player_id", player_id);

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

