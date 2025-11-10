export async function GET(request: Request) {
  // need to cache, too many api calls
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("Name");

    if (!playerName) {
      return Response.json(
        { error: "Please provide a player name" },
        { status: 400 }
      );
    }

    // keep calling until playerid is found
    let foundPlayer = null;

    for (let teamID = 1; teamID <= 30; teamID++) {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamID}/roster`
      );

      if (!response.ok) {
        throw new Error("Failed to get roster data");
      }

      // from the roster we check if the name can be found
      const roster = await response.json();

      const player = roster?.athletes?.find((athlete: any) =>
        athlete.displayName.includes(playerName)
      );

      if (player) {
        foundPlayer = player;
        break;
      }
    }

    // Check if we found a player
    if (!foundPlayer) {
      return Response.json(
        { error: `Player "${playerName}" not found` },
        { status: 404 }
      );
    }

    // now we fetch full player stats

    const playerResponse = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/${foundPlayer.id}`
    );
    const playerData = await playerResponse.json();

    const stats = playerData.athlete.statistics || [];

    const playerStats = {
      name: playerData.athlete.displayName,
      team: playerData.athlete.team.displayName,
      headshot: playerData.athlete.headshot?.href,
      avgPoints: stats.find((s: string) => s.name === "avgPoints")
        ?.displayValue,
      avgRebounds: stats.find((s: string) => s.name === "avgRebounds")
        ?.displayValue,
      avgAssists: stats.find((s: string) => s.name === "avgAssists")
        ?.displayValue,
      fieldGoalPct: stats.find((s: string) => s.name === "fieldGoalPct")
        ?.displayValue,
    };

    return Response.json({
      player: playerStats,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to search for player" },
      { status: 500 }
    );
  }
}
