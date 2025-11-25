"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SelectedTeam } from "@/app/types/components";

export default function Page() {
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam | null>(null);
  const [favoriteStats, setFavoriteStats] = useState({
    teams: 0,
    players: 0,
  });

  useEffect(() => {
    const fetchFavoriteStats = async () => {
      try {
        const [teamsRes, playersRes] = await Promise.all([
          fetch("/api/favorites/teams"),
          fetch("/api/favorites/players"),
        ]);

        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setFavoriteStats((prev) => ({
            ...prev,
            teams: teamsData.favorites?.length || 0,
          }));
        }

        if (playersRes.ok) {
          const playersData = await playersRes.json();
          setFavoriteStats((prev) => ({
            ...prev,
            players: playersData.favorites?.length || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching favorite stats:", error);
      }
    };

    fetchFavoriteStats();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" onTeamSelect={setSelectedTeam} />
      <SidebarInset>
        <SiteHeader selectedTeam={selectedTeam} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards selectedTeam={selectedTeam} />
              
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Favorite Teams
                    </CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{favoriteStats.teams}</div>
                    <p className="text-xs text-muted-foreground">
                      Teams you&apos;re following
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link href="/favorites">View Favorites</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Favorite Players
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{favoriteStats.players}</div>
                    <p className="text-xs text-muted-foreground">
                      Players you&apos;re tracking
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link href="/favorites">View Favorites</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Quick Actions
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/scores">View Live Scores</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/teams">Browse Teams</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/player-stats">Search Players</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
