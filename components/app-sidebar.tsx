"use client";

import { useState, useEffect, type ComponentProps } from "react";
import * as NBAIcons from "react-nba-logos";
import { Trophy } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import type { Team, SelectedTeam } from "@/app/types/components";

const userData = {
  name: "User",
  email: "user@example.com",
  avatar: "",
};

export function AppSidebar({
  onTeamSelect,
  ...props
}: ComponentProps<typeof Sidebar> & {
  onTeamSelect?: (team: SelectedTeam) => void;
}) {
  const [standings, setStandings] = useState<{
    eastern: Team[];
    western: Team[];
    loading: boolean;
    error: string | null;
  }>({
    eastern: [],
    western: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setStandings((prevState) => ({ ...prevState, loading: true }));
        const response = await fetch("/api/standings");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch standings! status: ${response.status}`
          );
        }
        const standingsData = await response.json();
        setStandings({
          eastern: standingsData.eastern,
          western: standingsData.western,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStandings((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };
    fetchStandings();
  }, []);

  const correctEasternNames = {
    NY: "NYK",
    WSH: "WAS",
  };

  const easternNavItems = standings.eastern.map((team, index) => {
    const correctedEastAbbrev =
      correctEasternNames[
        team.abbreviation as keyof typeof correctEasternNames
      ] || team.abbreviation;

    return {
      id: team.id,
      rank: index + 1,
      abbreviation: correctedEastAbbrev,
      wins: team.wins,
      losses: team.losses,
      url: "#",
      icon: NBAIcons[correctedEastAbbrev as keyof typeof NBAIcons],
      name: team.name,
      pointsPerGame: team.pointsPerGame,
      pointsAllowed: team.pointsAllowed,
      pointDiff: team.pointDiff,
    };
  });

  const correctWesternNames = {
    GS: "GSW",
    SA: "SAS",
    UTAH: "UTA",
    NO: "NOP",
  };

  const westernNavItems = standings.western.map((team, index) => {
    const correctedWestAbbrev =
      correctWesternNames[
        team.abbreviation as keyof typeof correctWesternNames
      ] || team.abbreviation;

    return {
      id: team.id,
      rank: index + 1,
      abbreviation: correctedWestAbbrev,
      wins: team.wins,
      losses: team.losses,
      url: "#",
      icon: NBAIcons[correctedWestAbbrev as keyof typeof NBAIcons],
      name: team.name,
      pointsPerGame: team.pointsPerGame,
      pointsAllowed: team.pointsAllowed,
      pointDiff: team.pointDiff,
    };
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold tracking-tight">NBA Standings</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>Eastern Conference</SidebarGroupLabel>
        <NavMain items={easternNavItems} onTeamClick={onTeamSelect} />
        <SidebarGroupLabel>Western Conference</SidebarGroupLabel>
        <NavSecondary
          items={westernNavItems}
          onTeamClick={onTeamSelect}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
