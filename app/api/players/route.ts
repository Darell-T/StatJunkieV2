import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get("Name");

    console.log(`Searching for: ${playerName}`);

    if (!playerName) {
      return Response.json(
        { error: "Please provide a player name" },
        { status: 400 }
      );
    }

    let foundPlayer = null;
    let playerID = null;

    for (let teamID = 1; teamID <= 30; teamID++) {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamID}/roster`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch team ${teamID} roster`);
      }

      const roster = await response.json();

      const player = roster?.athletes?.find((athlete: any) => {
        return athlete.displayName
          .toLowerCase()
          .includes(playerName.toLowerCase());
      });

      if (player) {
        playerID = player.id;

        foundPlayer = player;
        console.log(`Found: ${player.displayName} (ID: ${playerID})`);

        break;
      }
    }

    if (!foundPlayer) {
      return Response.json(
        { error: `Player "${playerName}" not found` },
        { status: 404 }
      );
    }

    const playerResponse = await fetch(
      `https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerID}`
    );

    const playerData = await playerResponse.json();
    const stats = playerData?.athlete?.statsSummary?.statistics || [];
    // AM I USING THE CORRECT PATH NOW???????
    console.log("Stats", stats); //YES

    const playerStats = {
      name: playerData?.athlete?.displayName,
      team: playerData.athlete?.team?.displayName || "Free Agent",
      headshot: playerData?.athlete?.headshot?.href,
      position: playerData?.athlete?.position?.displayName || "Unknown",
      avgPoints: stats.find((s: any) => s.name === "avgPoints")?.displayValue,
      avgRebounds: stats.find((s: any) => s.name === "avgRebounds")
        ?.displayValue,
      avgAssists: stats.find((s: any) => s.name === "avgAssists")?.displayValue,
      fieldGoalPct: stats.find((s: any) => s.name === "fieldGoalPct")
        ?.displayValue,
    };

    return Response.json({ player: playerStats });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to search for player" },
      { status: 500 }
    );
  }
}
