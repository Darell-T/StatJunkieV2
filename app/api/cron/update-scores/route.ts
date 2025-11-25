import { pusherServer } from "@/lib/pusher";
import { fetchAndParseScores } from "@/lib/scores-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Security: Only allow requests with correct secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch latest scores from ESPN
    const gamesData = await fetchAndParseScores();

    // Broadcast to all connected clients via Pusher
    await pusherServer.trigger("nba-scores", "score-update", {
      games: gamesData,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      gamesCount: gamesData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating scores:", error);
    return NextResponse.json(
      { error: "Failed to update scores" },
      { status: 500 }
    );
  }
}
