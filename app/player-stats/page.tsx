"use client";
import { InputWithButton } from "@/components/player-search";
import { StatsCard } from "@/components/stats-card";
import { useState } from "react";
import type { PlayerSummary } from "@/app/types/player";
import type { Player } from "@/app/types/player";

export default function SearchPage() {
  // State for full player stats (from API)
  const [playerStats, setPlayerStats] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle when user clicks a player from the dropdown
  const handlePlayerSelect = async (player: PlayerSummary) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our optimized stats endpoint using playerID
      const response = await fetch(`/api/players/stats?playerID=${player.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch player stats");
      }

      const data = await response.json();
      setPlayerStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch player stats"
      );
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing the selection
  const handleClearStats = () => {
    setPlayerStats(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full mt-20 px-4">
      {/* Search Bar */}
      <InputWithButton onPlayerSelect={handlePlayerSelect} />

      {/* Stats Card - Shows detailed player statistics */}
      <StatsCard
        player={playerStats}
        isLoading={isLoading}
        error={error}
        onClear={handleClearStats}
      />
    </div>
  );
}
