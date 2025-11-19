// app/api/recent-games/[teamId]/route.ts

import { NextRequest } from "next/server";
import type {
  TeamCompetitor,
  EventForSchedule,
  ScheduleResponse,
  Game,
} from "@/app/types/scores";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params;

    console.log("Fetching games for team ID:", teamId);

    const scheduleResponse = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/schedule?season=2026`,
      {
        next: { revalidate: 3600 },
      }
    );

    console.log("ESPN API response status:", scheduleResponse.status);

    if (!scheduleResponse.ok) {
      const errorText = await scheduleResponse.text();
      console.error("ESPN API error:", errorText);
      throw new Error(`Failed to fetch schedule: ${scheduleResponse.status}`);
    }

    const scheduleData: ScheduleResponse = await scheduleResponse.json();

    console.log("Total events:", scheduleData.events?.length);

    const completedGames = scheduleData.events
      .filter(
        (event: EventForSchedule) =>
          event.competitions[0]?.status?.type?.completed === true
      )
      .slice(-5)
      .reverse();

    console.log("Completed games found:", completedGames.length);

    if (completedGames.length === 0) {
      return Response.json([]);
    }

    const formattedGames: Game[] = completedGames.map(
      (event: EventForSchedule) => {
        const competition = event.competitions[0];
        const homeTeam = competition.competitors.find(
          (team: TeamCompetitor) => team.homeAway === "home"
        );
        const awayTeam = competition.competitors.find(
          (team: TeamCompetitor) => team.homeAway === "away"
        );

        if (!homeTeam || !awayTeam) {
          throw new Error("Missing team data in competition");
        }

        const isHomeTeam = homeTeam.id === teamId;
        const teamCompetitor = isHomeTeam ? homeTeam : awayTeam;
        const opponentCompetitor = isHomeTeam ? awayTeam : homeTeam;

        // Helper function to extract score
        const getScore = (
          score: string | number | { value: number; displayValue: string }
        ): string => {
          if (typeof score === "string") return score;
          if (typeof score === "number") return String(score);
          return score.displayValue;
        };

        const teamScore = getScore(teamCompetitor.score);
        const opponentScore = getScore(opponentCompetitor.score);

        console.log("Team score:", teamScore);
        console.log("Opponent score:", opponentScore);

        return {
          id: event.id,
          won: teamCompetitor.winner === true,
          opponent: opponentCompetitor.team.displayName,
          opponentAbbreviation: opponentCompetitor.team.abbreviation,
          score: `${teamScore}-${opponentScore}`,
          date: new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          homeAway: isHomeTeam ? "home" : "away",
        };
      }
    );

    console.log("Formatted games:", formattedGames);

    return Response.json(formattedGames);
  } catch (error) {
    console.error("Error fetching recent games:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return Response.json(
      { error: "Failed to fetch recent games" },
      { status: 500 }
    );
  }
}
