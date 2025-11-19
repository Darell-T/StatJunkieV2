// components/recent-games.tsx
"use client";

import * as NBAIcons from "react-nba-logos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/app/types/game";
import type { SelectedTeam } from "@/app/types/components";

// Mapping for team abbreviations to icon names
const teamAbbreviationMap: Record<string, string> = {
  NY: "NYK",
  WSH: "WAS",
  GS: "GSW",
  SA: "SAS",
  UTAH: "UTA",
  NO: "NOP",
};

export function RecentGames({
  games,
  selectedTeam,
}: {
  games: Game[];
  selectedTeam: SelectedTeam | null;
}) {
  if (games.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Select a team to view recent games
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getOpponentLogo = (opponentAbbr: string) => {
    const correctedAbbr = teamAbbreviationMap[opponentAbbr] || opponentAbbr;
    return NBAIcons[correctedAbbr as keyof typeof NBAIcons];
  };

  return (
    <div className="px-4 lg:px-6">
      <h2 className="text-xl font-semibold mb-4">Last 5 Games</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game, index) => {
          const OpponentLogo = getOpponentLogo(game.opponentAbbreviation);
          const TeamLogo = selectedTeam?.logo;
          const isLastOdd =
            games.length % 2 !== 0 && index === games.length - 1;

          return (
            <Card
              key={game.id}
              className={`hover:shadow-lg transition-shadow ${
                isLastOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={game.won ? "default" : "destructive"}
                    className={`text-sm px-2.5 py-0.5 ${
                      game.won
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                    }`}
                  >
                    {game.won ? "W" : "L"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {game.date}
                  </span>
                </div>

                {/* Team logos and scores */}
                <div className="flex items-center justify-between gap-4">
                  {/* Selected Team */}
                  <div className="flex items-center gap-3">
                    {TeamLogo && (
                      <div className="h-12 w-12 shrink-0">
                        <TeamLogo />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeam?.name}
                      </p>
                      <p className="text-2xl font-bold">
                        {game.score.split("-")[0]}
                      </p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-muted-foreground font-semibold">vs</div>

                  {/* Opponent */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {game.opponent}
                      </p>
                      <p className="text-2xl font-bold">
                        {game.score.split("-")[1]}
                      </p>
                    </div>
                    {OpponentLogo && (
                      <div className="h-12 w-12 shrink-0">
                        <OpponentLogo />
                      </div>
                    )}
                  </div>
                </div>

                {/* Home/Away indicator */}
                <div className="mt-3 text-center">
                  <span className="text-xs text-muted-foreground">
                    {game.homeAway === "home" ? "Home Game" : "Away Game"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
