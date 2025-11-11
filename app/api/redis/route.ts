import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const {
    playerName,
    team,
    position,
    ppgAvg,
    rebAvg,
    assistsAvg,
    fieldGoalPct,
    headshot,
  } = await req.json();

  const player = {
    playerName,
    team,
    position,
    ppgAvg,
    rebAvg,
    assistsAvg,
    fieldGoalPct,
    headshot,
    createdAt: Date.now(),
  };

  await redis.set(`Player: ${player}`, JSON.stringify(player));

  return Response.json({
    message: `Added: ${player}`,
  });
}
