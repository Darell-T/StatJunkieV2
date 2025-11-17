"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import * as NBAIcons from "react-nba-logos";
import type { NBALogo } from "react-nba-logos";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SelectedTeam = {
  name: string;
  abbreviation: string;
  logo: React.ComponentType;
  wins: string | number;
  losses: string | number;
  pointsPerGame?: number;
  pointsAllowed?: number;
  pointDiff?: number;
};

export function NavSecondary({
  items,
  onTeamClick,
  ...props
}: {
  items: {
    icon?: LucideIcon | (typeof NBAIcons)[keyof typeof NBAIcons];
    rank?: number;
    abbreviation?: string;
    wins?: string | number;
    losses?: string | number;
    title?: string;
    name?: string;
    url: string;
    pointsPerGame?: number;
    pointsAllowed?: number;
    pointDiff?: number;
  }[];
  onTeamClick?: (team: SelectedTeam) => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const handleTeamClick = (item: (typeof items)[0]) => {
    if (onTeamClick && item.abbreviation && item.icon) {
      onTeamClick({
        name: item.name || item.abbreviation,
        abbreviation: item.abbreviation,
        logo: item.icon,
        wins: item.wins || 0,
        losses: item.losses || 0,
        pointsPerGame: item.pointsPerGame || 0,
        pointsAllowed: item.pointsAllowed || 0,
        pointDiff: item.pointDiff || 0,
      });
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title || `${item.rank}-${item.abbreviation}`}
            >
              <SidebarMenuButton onClick={() => handleTeamClick(item)}>
                {item.rank && <span>{item.rank}.</span>}
                {item.icon && (
                  <div className="h-11 w-11">
                    <item.icon />
                  </div>
                )}
                {item.abbreviation && <span>{item.abbreviation}</span>}
                {item.wins !== undefined && item.losses !== undefined && (
                  <span>
                    {item.wins}-{item.losses}
                  </span>
                )}
                {item.title && <span>{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
