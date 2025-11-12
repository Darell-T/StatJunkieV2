import { redis } from "@/lib/redis";

//TOOK A LOT OF CREATIVITY TO GET THE CURRENT SEASON STATS

/*NEED TO FIND A WAY TO SPEED UP THE FIRST PLAYER THAT IS SEARCHED TIME*/

//you get a type, you get a type, EVERYONE GETS A TYPE!(opera reference)

type CachedPlayer = {
  player: Player;
  source: string;
};

type Player = {
  name: string;
  team: string;
  headshot: string;
  position: string;
  avgPoints?: string;
  avgRebounds?: string;
  avgAssists?: string;
  fieldGoalPct?: string;
};

type RosterAthlete = {
  id: string;
  displayName: string;
};

type Roster = {
  athletes?: RosterAthlete[];
};

type StatSummary = {
  name: string;
  displayValue: string;
};

type PlayerDetailResponse = {
  athlete?: {
    displayName: string;
    headshot?: {
      href: string;
    };
    position?: {
      displayName: string;
    };
    team?: {
      displayName: string;
    };
    statsSummary?: {
      statistics: StatSummary[];
    };
  };
};

// Retry helper with exponential backoff
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response; // Success, YOU HAVE WON THE LOTTERY!
      }

      // If rate limited or server error, retry
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }

      // For other errors (like 404), don't retry
      return response;
    } catch (error) {
      lastError = error;

      // If this was our last attempt, give up
      if (attempt === retries - 1) {
        throw lastError;
      }

      // Calculate wait time: 1s, 2s, 4s
      const waitTime = 1000 * Math.pow(2, attempt);

      console.log(
        `Attempt ${attempt + 1} failed, retrying in ${waitTime}ms...`
      );

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// Cache helpers
async function getCachedPlayer(name: string): Promise<CachedPlayer | null> {
  const key = `Player:${name.toLowerCase()}`;
  const cachedPlayer = await redis.get(key);

  if (cachedPlayer) {
    // error logging because i like breaking stuff
    console.log("Returning cached player data");
    console.log("Type: ", typeof cachedPlayer);
    console.log("Value: ", cachedPlayer);

    return { player: cachedPlayer as Player, source: "cache" };
  }
  return null;
}

async function setCachedPlayer(
  name: string,
  playerData: Player
): Promise<void> {
  const key = `Player:${name.toLowerCase()}`;
  await redis.set(key, playerData, { ex: 259200 }); // CACHE FOR 3 DAYS SINCE TEAMS PLAY EVERY 2-3 DAYS(OR EVERYDAY IF YOU ARE ON THE WARRIORS)
}

// API fetch helpers
async function fetchTeamRoster(teamID: number): Promise<Roster> {
  const response = await fetchWithRetry(
    `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamID}/roster`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch team ${teamID} roster`);
  }

  return response.json();
}

async function findPlayerInRoster(
  roster: Roster,
  playerName: string
): Promise<RosterAthlete | undefined> {
  return roster?.athletes?.find((athlete) => {
    return athlete.displayName.toLowerCase().includes(playerName.toLowerCase());
  });
}

async function searchPlayerAcrossTeams(
  playerName: string
): Promise<{ player: RosterAthlete; playerID: string } | null> {
  // ADDED CACHING BECAUSE CALLING THIS API SO MANY TIMES IS INSANITY
  for (let teamID = 1; teamID <= 30; teamID++) {
    const roster = await fetchTeamRoster(teamID);
    const player = await findPlayerInRoster(roster, playerName);

    if (player) {
      console.log(`Found: ${player.displayName} (ID: ${player.id})`);
      return { player, playerID: player.id };
    }
  }

  return null;
}

async function fetchPlayerDetails(
  playerID: string
): Promise<PlayerDetailResponse> {
  const response = await fetchWithRetry(
    `https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${playerID}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch player ${playerID} details`);
  }

  return response.json();
}

function extractPlayerStats(playerData: PlayerDetailResponse): Player {
  const stats = playerData?.athlete?.statsSummary?.statistics || [];

  return {
    name: playerData?.athlete?.displayName || "Unknown",
    team: playerData.athlete?.team?.displayName || "Free Agent",
    headshot: playerData?.athlete?.headshot?.href || "",
    position: playerData?.athlete?.position?.displayName || "Unknown",
    avgPoints: stats.find((s) => s.name === "avgPoints")?.displayValue,
    avgRebounds: stats.find((s) => s.name === "avgRebounds")?.displayValue,
    avgAssists: stats.find((s) => s.name === "avgAssists")?.displayValue,
    fieldGoalPct: stats.find((s) => s.name === "fieldGoalPct")?.displayValue,
  };
}

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

    console.log(`Searching for: ${playerName}`);

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
