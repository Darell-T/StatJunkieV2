import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";
import * as NBAIcons from "react-nba-logos";

import { Button } from "@/components/ui/button";
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
};
export function NavMain({
  items,
  onTeamClick,
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
}) {
  const handleTeamClick = (e: React.MouseEvent, item: (typeof items)[0]) => {
    e.preventDefault();
    console.log("Team clicked:", item);
    console.log("onTeamClick exists?", !!onTeamClick);

    if (onTeamClick && item.abbreviation && item.icon) {
      const teamData = {
        name: item.name || item.abbreviation,
        abbreviation: item.abbreviation,
        logo: item.icon,
        wins: item.wins || 0,
        losses: item.losses || 0,
        pointsPerGame: item.pointsPerGame,
        pointsAllowed: item.pointsAllowed,
        pointDiff: item.pointDiff,
      };
      console.log("Calling onTeamClick with:", teamData);
      onTeamClick(teamData);
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>Brainstorming</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
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
                <div className="flex items-center gap-2 w-full">
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
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
