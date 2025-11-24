import { buildPlayerIndex } from "@/lib/players-service";
import { redis } from "@/lib/redis";
import { PlayerSummary } from "@/app/types/player";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();

    // 1. Try to fetch the master list from Redis
    const REDIS_KEY = "ALL_NBA_PLAYERS";
    const playersData = await redis.get(REDIS_KEY);
    let allPlayers: PlayerSummary[] = [];

    if (playersData) {
      // CACHE HIT
      // console.log("Search Index Cache HIT");
      allPlayers = playersData as unknown as PlayerSummary[];
    } else {
      // CACHE MISS: We need to build the index (The "Hydration")
      console.log("Search Index Cache MISS - Building from ESPN...");
      allPlayers = await buildPlayerIndex();

      // Save to Redis for 24 hours (86400 seconds)
      await redis.set(REDIS_KEY, allPlayers, { ex: 86400 });
    }

    // 2. If there is no query, maybe return the first 10 (or empty)
    if (!query) {
      return Response.json({ results: allPlayers.slice(0, 10) });
    }

    // 3. Filter the list in memory (Super fast)
    const filtered = allPlayers.filter((p) =>
      p.displayName.toLowerCase().includes(query)
    );

    // Limit to top 5-10 results to keep the dropdown small
    return Response.json({ results: filtered.slice(0, 7) });
  } catch (error) {
    console.error("Search API Error:", error);
    return Response.json(
      { error: "Failed to search players" },
      { status: 500 }
    );
  }
}
