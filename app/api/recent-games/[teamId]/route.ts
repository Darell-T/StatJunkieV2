// app/api/recent-games/[teamId]/route.ts

import { NextRequest } from "next/server";

type TeamCompetitor = {
  id: string;
  homeAway: "home" | "away";
  score: string;
  winner?: boolean;
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
  };
};

type Competition = {
  id: string;
  date: string;
  status: {
    type: {
      completed: boolean;
      state: string;
    };
  };
  competitors: TeamCompetitor[];
};

type Event = {
  id: string;
  date: string;
  name: string;
  competitions: Competition[];
};

type ScheduleResponse = {
  team: {
    id: string;
    displayName: string;
  };
  events: Event[];
};

type Game = {
  id: string;
  won: boolean;
  opponent: string;
  opponentAbbreviation: string;
  score: string;
  date: string;
  homeAway: "home" | "away";
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> } // Changed this line
) {
  try {
    const { teamId } = await context.params; // Added await

    console.log("Fetching games for team ID:", teamId);

    // Get recent completed games from the schedule
    const scheduleResponse = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/schedule?season=2025`,
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

    // Get completed games
    const completedGames = scheduleData.events
      .filter(
        (event: Event) =>
          event.competitions[0]?.status?.type?.completed === true
      )
      .slice(-5)
      .reverse();

    console.log("Completed games found:", completedGames.length);

    if (completedGames.length === 0) {
      return Response.json([]);
    }

    const formattedGames: Game[] = completedGames.map((event: Event) => {
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

      return {
        id: event.id,
        won: teamCompetitor.winner === true,
        opponent: opponentCompetitor.team.displayName,
        opponentAbbreviation: opponentCompetitor.team.abbreviation,
        score: `${teamCompetitor.score}-${opponentCompetitor.score}`,
        date: new Date(event.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        homeAway: isHomeTeam ? "home" : "away",
      };
    });

    console.log("Formatted games:", formattedGames.length);

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
