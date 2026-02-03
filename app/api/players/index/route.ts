import { buildPlayerIndex } from "@/lib/players-service";
import { getRedis } from "@/lib/redis";
import { PlayerSummary } from "@/app/types/player";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();

    // 1. Try to fetch the master list from Redis
    const REDIS_KEY = process.env.REDIS_MASTER_LIST!;
    const redis = getRedis();
    let allPlayers: PlayerSummary[] = [];

    try {
      const playersData = await redis.get(REDIS_KEY);
      if (playersData && Array.isArray(playersData) && playersData.length > 0) {
        allPlayers = playersData as unknown as PlayerSummary[];
      }
    } catch (redisError) {
      console.error("Redis error:", redisError);
    }

    // 2. If master list is empty, build a new index
    if (!allPlayers || allPlayers.length === 0) {
      allPlayers = await buildPlayerIndex();

      // Save to Redis for 3 days (259200 seconds)
      try {
        await redis.set(REDIS_KEY, allPlayers, { ex: 259200 });
      } catch (redisError) {
        console.error("Failed to cache index:", redisError);
        throw new Error("Failed to cache player index in Redis");
      }
    }

    // 3. If there is no query, return the first 10
    if (!query) {
      return Response.json({ results: allPlayers.slice(0, 10) });
    }

    // 4. Filter the list in memory
    const filtered = allPlayers.filter((p) =>
      p.displayName.toLowerCase().includes(query)
    );

    // Limit to top 7 results
    return Response.json({ results: filtered.slice(0, 7) });
  } catch (error) {
    console.error("Search API Error:", error);
    return Response.json(
      { error: "Failed to search players" },
      { status: 500 }
    );
  }
}
