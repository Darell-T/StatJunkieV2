import { type LucideIcon } from "lucide-react";
import * as NBAIcons from "react-nba-logos";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SelectedTeam } from "@/app/types/components";
import { FavoriteButton } from "@/components/favorites/favorite-button";
export function NavMain({
  items,
  onTeamClick,
}: {
  items: {
    id?: string;
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
}) {
  const handleTeamClick = (e: React.MouseEvent, item: (typeof items)[0]) => {
    e.preventDefault();

    if (onTeamClick && item.abbreviation && item.icon && item.id) {
      onTeamClick({
        id: item.id,
        name: item.name || item.abbreviation,
        abbreviation: item.abbreviation,
        logo: item.icon,
        wins: item.wins || 0,
        losses: item.losses || 0,
        pointsPerGame: item.pointsPerGame,
        pointsAllowed: item.pointsAllowed,
        pointDiff: item.pointDiff,
      });
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title || `${item.rank}-${item.abbreviation}`}
            >
              <SidebarMenuButton
                tooltip={item.title || item.abbreviation}
                onClick={(e) => handleTeamClick(e, item)}
                asChild={false}
              >
                <div className="flex items-center gap-2 w-full group">
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
                  {item.id && item.abbreviation && (
                    <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                      <FavoriteButton
                        type="team"
                        id={item.id}
                        name={item.name || item.abbreviation}
                        abbreviation={item.abbreviation}
                        size="sm"
                        asIcon={true}
                      />
                    </div>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
