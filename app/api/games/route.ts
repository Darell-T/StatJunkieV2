import { fetchAndParseScores } from "@/lib/scores-service";

export async function GET() {
  try {
    const gamesData = await fetchAndParseScores();
    return Response.json(gamesData);
  } catch (error) {
    console.error("Error: ", error);
    return Response.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
