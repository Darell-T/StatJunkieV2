"use client";
import * as NBAIcons from "react-nba-logos";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { useState, useEffect } from "react";
import type { Team, SelectedTeam } from "@/app/types/components";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({
  onTeamSelect,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onTeamSelect?: (team: SelectedTeam) => void;
}) {
  console.log("AppSidebar received onTeamSelect?", !!onTeamSelect); // ADD THIS LINE

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
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Standings</span>
              </a>
            </SidebarMenuButton>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
