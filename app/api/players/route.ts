import {
  getCachedPlayer,
  setCachedPlayer,
  searchPlayerAcrossTeams,
  fetchPlayerDetails,
  extractPlayerStats,
} from "@/lib/players-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("Name");

    if (!playerName) {
      return Response.json(
        { error: "Please provide a player name" },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = await getCachedPlayer(playerName);
    if (cached) return Response.json(cached);

    // Search for player across all teams
    const searchResult = await searchPlayerAcrossTeams(playerName);

    if (!searchResult) {
      return Response.json(
        { error: `Player "${playerName}" not found` },
        { status: 404 }
      );
    }

    // Fetch detailed player data
    const playerData = await fetchPlayerDetails(searchResult.playerID);
    const playerStats = extractPlayerStats(playerData);

    // Cache the result
    await setCachedPlayer(playerName, playerStats);

    return Response.json({ player: playerStats, source: "api" });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to search for player" },
      { status: 500 }
    );
  }
}
