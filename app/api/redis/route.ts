import { getRedis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const redis = getRedis();
    const {
      name,
      team,
      position,
      ppgAvg,
      rebAvg,
      assistsAvg,
      fieldGoalPct,
      headshot,
    } = await req.json();

    const player = {
      name,
      team,
      position,
      ppgAvg,
      rebAvg,
      assistsAvg,
      fieldGoalPct,
      headshot,
      createdAt: Date.now(),
    };

    // this makes the player name the key
    const key = `Player:${name}`;

    // Save to Redis
    await redis.set(key, JSON.stringify(player));

    return Response.json({
      message: `Player ${name} added successfully.`,
      player,
    });
  } catch (error) {
    console.error("Error adding player:", error);
    return Response.json({ error: "Failed to add player" }, { status: 500 });
  }
}
