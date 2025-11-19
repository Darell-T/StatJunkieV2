// app/scores/page.tsx
"use client";

import { useState, useEffect } from "react";
import * as NBAIcons from "react-nba-logos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import Pusher from "pusher-js";
import type { GameData } from "@/app/types/scores";

const teamAbbreviationMap: Record<string, string> = {
  NY: "NYK",
  WSH: "WAS",
  GS: "GSW",
  SA: "SAS",
  UTAH: "UTA",
  NO: "NOP",
};

export default function ScoresPage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Fetch initial scores
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/games");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();

    // Set up Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("nba-scores");

    pusher.connection.bind("connected", () => {
      console.log("✅ Connected to Pusher");
      setConnected(true);
    });

    pusher.connection.bind("disconnected", () => {
      console.log("❌ Disconnected from Pusher");
      setConnected(false);
    });

    channel.bind(
      "score-update",
      (data: { games: GameData[]; timestamp: string }) => {
        console.log("📡 Score update received:", data);
        setGames(data.games);
      }
    );

    // Auto-trigger updates every 15 seconds
    const cronInterval = setInterval(async () => {
      try {
        await fetch("/api/cron/update-scores", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
          },
        });
        console.log("🔄 Triggered score update");
      } catch (error) {
        console.error("Error triggering update:", error);
      }
    }, 15000);

    // Cleanup
    return () => {
      clearInterval(cronInterval);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const getTeamLogo = (abbreviation: string) => {
    const correctedAbbr = teamAbbreviationMap[abbreviation] || abbreviation;
    return NBAIcons[correctedAbbr as keyof typeof NBAIcons];
  };

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading scores...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No games scheduled</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Today's Games</h2>
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              connected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {connected ? "Live" : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game, index) => {
          const HomeLogo = getTeamLogo(game.homeAbbreviation);
          const AwayLogo = getTeamLogo(game.awayAbbreviation);
          const isLastOdd =
            games.length % 2 !== 0 && index === games.length - 1;

          const isFinal = game.scheduledTime?.toLowerCase().includes("final");
          const isScheduled = !isFinal && !game.quarter;
          const isLive = !isFinal && !isScheduled && game.quarter;

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
                    variant={isLive ? "default" : "outline"}
                    className={`text-sm px-2.5 py-0.5 ${
                      isLive
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                        : ""
                    }`}
                  >
                    {isFinal
                      ? "Final"
                      : isLive
                      ? "Live"
                      : game.scheduledTime || "Scheduled"}
                  </Badge>
                  {game.arena && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {game.arena}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {AwayLogo && (
                      <div className="h-12 w-12 shrink-0">
                        <AwayLogo />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {game.awayTeam}
                      </p>
                      <p className="text-2xl font-bold">{game.awayScore}</p>
                    </div>
                  </div>

                  <div className="text-muted-foreground font-semibold">@</div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {game.homeTeam}
                      </p>
                      <p className="text-2xl font-bold">{game.homeScore}</p>
                    </div>
                    {HomeLogo && (
                      <div className="h-12 w-12 shrink-0">
                        <HomeLogo />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs text-muted-foreground">
                    {isLive && game.time && game.quarter
                      ? `Q${game.quarter} - ${game.time}`
                      : isFinal
                      ? "Game Complete"
                      : game.scheduledTime || "Upcoming"}
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
