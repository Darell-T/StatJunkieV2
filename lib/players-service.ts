import { redis } from "@/lib/redis";

import type {
  CachedPlayer,
  Player,
  RosterAthlete,
  Roster,
  PlayerDetailResponse,
  PlayerSummary,
} from "@/app/types/player";

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
export async function getCachedPlayer(
  name: string
): Promise<CachedPlayer | null> {
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

export async function setCachedPlayer(
  name: string,
  playerData: Player
): Promise<void> {
  const key = `Player:${name.toLowerCase()}`;
  await redis.set(key, playerData, { ex: 259200 }); // CACHE FOR 3 DAYS SINCE TEAMS PLAY EVERY 2-3 DAYS(OR EVERYDAY IF YOU ARE ON THE WARRIORS)
}

// API fetch helpers
export async function fetchTeamRoster(teamID: number): Promise<Roster> {
  const response = await fetchWithRetry(
    `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamID}/roster`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch team ${teamID} roster`);
  }

  return response.json();
}

export async function findPlayerInRoster(
  roster: Roster,
  playerName: string
): Promise<RosterAthlete | undefined> {
  return roster?.athletes?.find((athlete) => {
    return athlete.displayName.toLowerCase().includes(playerName.toLowerCase());
  });
}

export async function searchPlayerAcrossTeams(
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

export async function fetchPlayerDetails(
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

export function extractPlayerStats(playerData: PlayerDetailResponse): Player {
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

export async function buildPlayerIndex(): Promise<PlayerSummary[]> {
  // 1. Generate IDs 1-30
  const teamIds = Array.from({ length: 30 }, (_, i) => i + 1); // sorry im too lazy to type 1-30

  // 2. Fire off 30 requests at the same time
  // We map over the IDs and return a Promise for each one
  const allTeamArrays = await Promise.all(
    teamIds.map(async (id) => {
      try {
        // A. Fetch the specific team
        const roster = await fetchTeamRoster(id);

        // FIX 1: Safely access team name
        const teamName = roster.team?.displayName || "Unknown Team";

        // FIX 2: Handle case where roster.athletes is undefined
        // We say (roster.athletes || []) to ensure we always map over an array
        const athletes = roster.athletes || [];

        return athletes.map((athlete) => ({
          displayName: athlete.displayName,
          id: athlete.id,
          team: teamName,

          headshot: athlete.headshot?.href || "",
        }));
      } catch (error) {
        console.error(`Failed to index team ${id}`, error);
        return [];
      }
    })
  );

  // 3. The "Flattening"
  // Right now, allTeamArrays looks like: [ [LakersPlayers], [CelticsPlayers], ... ]
  // We want: [LeBron, Davis, Tatum, Brown, ... ]
  return allTeamArrays.flat();
}
