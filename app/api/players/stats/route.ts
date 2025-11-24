import {
  extractPlayerStats,
  fetchPlayerDetails,
  getCachedPlayer,
  setCachedPlayer,
} from "@/lib/players-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerID = searchParams.get("playerID");

    if (!playerID) {
      return Response.json(
        { error: "playerID query parameter is required" },
        { status: 400 }
      );
    }

    const cacheKey = `player:${playerID}`;
    const cached = await getCachedPlayer(cacheKey);
    if (cached) {
      return Response.json(cached);
    }

    const playerDetailsResponse = await fetchPlayerDetails(playerID);
    const playerStats = extractPlayerStats(playerDetailsResponse);

    // Cache using setCachedPlayer (handles 3-day TTL internally)
    await setCachedPlayer(playerID, playerStats);

    return Response.json(playerStats);
  } catch (error) {
    console.error("Error fetching player stats: ", error);
    return Response.json(
      { error: "Failed to fetch player stats" },
      { status: 500 }
    );
  }
}
