import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import type { Player } from "@/app/types/player";
import { Trophy, Users, Target, Activity, Loader2 } from "lucide-react";

interface StatsCardProps {
  player: Player | null;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
}

export function StatsCard({
  player,
  isLoading,
  error,
  onClear,
}: StatsCardProps) {
  // 1. LOADING STATE
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl border-none shadow-md bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-24 space-y-4">
          {/* Replaced Spinner with Loader2 from lucide-react */}
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Scouting player data...
          </p>
        </CardContent>
      </Card>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <Card className="w-full max-w-2xl border-red-500/20 bg-red-500/10">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-red-500/20 p-3 mb-4">
            <Activity className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-500">
            Player Not Found
          </h3>
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            onClick={onClear}
            variant="outline"
            className="border-red-500/20 hover:bg-red-500/10 text-red-500 hover:text-red-400"
          >
            Try Search Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 3. IDLE STATE (No player selected)
  if (!player) return null;

  // 4. SUCCESS STATE
  return (
    <Card className="w-full max-w-3xl overflow-hidden shadow-xl border-border bg-card transition-all duration-300 hover:shadow-2xl">
      {/* HERO HEADER 
        Using a dark slate background to make the name pop.
      */}
      <div className="bg-slate-900 p-6 pb-16 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {player.name}
            </h2>
            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <span className="font-semibold text-slate-200">
                {player.team}
              </span>
              <span>•</span>
              <span>{player.position}</span>
            </div>
          </div>
          <Button
            onClick={onClear}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕ Clear
          </Button>
        </div>
      </div>

      <CardContent className="pt-0 px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN: PLAYER IMAGE 
              Negative margin pulls image up into the header
          */}
          <div className="-mt-12 shrink-0 flex justify-center md:justify-start">
            <div className="relative h-48 w-48 rounded-xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg bg-slate-100">
              {player.headshot ? (
                <Image
                  src={player.headshot}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                  <Users className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STATS GRID */}
          <div className="flex-1 pt-6">
            <div className="grid grid-cols-2 gap-4">
              {/* PRIMARY STAT (Points) */}
              <StatBox
                label="PPG"
                value={player.avgPoints}
                icon={<Trophy className="h-4 w-4 text-amber-500" />}
                highlight
              />

              {/* SECONDARY STATS */}
              <StatBox
                label="RPG"
                value={player.avgRebounds}
                icon={<Activity className="h-4 w-4 text-blue-500" />}
              />
              <StatBox
                label="APG"
                value={player.avgAssists}
                icon={<Users className="h-4 w-4 text-purple-500" />}
              />
              <StatBox
                label="FG%"
                value={
                  player.fieldGoalPct ? `${player.fieldGoalPct}%` : undefined
                }
                icon={<Target className="h-4 w-4 text-green-500" />}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// HELPER COMPONENT (Updated for Dark Mode visibility)
function StatBox({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  if (!value) return null;

  return (
    <div
      className={`
      flex flex-col p-4 rounded-lg border transition-colors
      ${
        highlight
          ? "bg-amber-500/10 border-amber-500/20 text-amber-500" // Highlight (Points)
          : "bg-muted/50 border-border text-foreground hover:bg-muted" // Standard Stats
      }
    `}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold opacity-70 tracking-wider uppercase">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold tracking-tight">{value}</span>
    </div>
  );
}
