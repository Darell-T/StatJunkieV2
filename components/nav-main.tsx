import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";
import * as NBAIcons from "react-nba-logos";
import type { NBALogo } from "react-nba-logos";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    icon?: LucideIcon | (typeof NBAIcons)[keyof typeof NBAIcons];
    rank?: number;
    abbreviation?: string;
    wins?: string | number;
    losses?: string | number;
    title?: string;
    url: string;
  }[];
}) {
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
              <SidebarMenuButton tooltip={item.title || item.abbreviation}>
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
