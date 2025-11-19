"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RecentGames } from "@/components/recent-games";
import { Game } from "@/app/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { SelectedTeam } from "@/app/types/components";

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam | null>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch games when team is selected
  useEffect(() => {
    if (selectedTeam?.id) {
      const fetchGames = async () => {
        setLoading(true);
        const startTime = Date.now(); // Track start time

        try {
          const response = await fetch(`/api/recent-games/${selectedTeam.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch games");
          }
          const data: Game[] = await response.json();

          // Calculate remaining time to meet minimum delay
          const elapsedTime = Date.now() - startTime;
          const minDelay = 500; // Minimum 500ms (half a second)
          const remainingTime = Math.max(0, minDelay - elapsedTime);

          // Wait for remaining time before showing results
          await new Promise((resolve) => setTimeout(resolve, remainingTime));

          setRecentGames(data);
        } catch (error) {
          console.error("Error fetching games:", error);
          setRecentGames([]);

          // Still respect minimum delay on error
          const elapsedTime = Date.now() - startTime;
          const minDelay = 500;
          const remainingTime = Math.max(0, minDelay - elapsedTime);
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        } finally {
          setLoading(false);
        }
      };
      fetchGames();
    } else {
      setRecentGames([]);
    }
  }, [selectedTeam?.id]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" onTeamSelect={setSelectedTeam} />
      <SidebarInset>
        <SiteHeader selectedTeam={selectedTeam} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards selectedTeam={selectedTeam} />

              {/* Recent games section */}
              {loading ? (
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12">
                      <Spinner className="h-12 w-12 mb-4" />
                      <p className="text-muted-foreground">Loading games...</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <RecentGames games={recentGames} selectedTeam={selectedTeam} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
